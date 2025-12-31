import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { PaymentChannel, $Enums, CreditTransactionType } from '@prisma/client';
import { PricingCodes, SubscriptionTrialCredits } from '@/lib/ai-tools/products';
import {DefaultCustomSign} from "@/lib/constants";

/**
 * Webhook Response Interface
 * 
 * Represents the structure of incoming webhook events from Creem.
 * This is a simplified version focusing on essential fields for the template.
 * 
 * @interface WebhookResponse
 * @property {string} id - Unique identifier for the webhook event
 * @property {string} eventType - Type of event (e.g., "checkout.completed", "subscription.paid")
 * @property {Object} object - Contains the event payload
 * @property {string} object.request_id - Contains userId for one-time payments
 * @property {string} object.id - Unique identifier for the payment/subscription
 * @property {Object} object.customer - Customer information
 * @property {Object} object.product - Product information including billing type
 * @property {string} object.status - Current status of the payment/subscription
 * @property {Object} object.metadata - Additional data passed during checkout
 */
export interface WebhookResponse {
    id: string;
    eventType: string;
    object: {
        request_id: string;
        object: string;
        id: string;
        customer: {
            id: string;
        };
        product: {
            id: string;
            billing_type: string;
            price: number;
        };
        last_transaction: {
            id: string;
            amount: number;
            currency: string;
        };
        status: string;
        current_period_end_date: string;
        metadata: any;
    };
}

/**
 * POST /api/webhook
 * 
 * Processes incoming webhook events from Creem's payment system.
 * Handles both one-time payments and subscription lifecycle events.
 * 
 * Event Types Handled:
 * 1. One-Time Payments:
 *    - checkout.completed: Payment successful, fulfill purchase
 * 
 * 2. Subscriptions:
 *    - subscription.paid: New subscription or successful renewal
 *    - subscription.canceled: Subscription cancellation requested
 *    - subscription.expired: Subscription ended (payment failed or period ended)
 * 
 * @async
 * @function
 * @param {NextRequest} req - Incoming webhook request containing event data
 * @returns {Promise<NextResponse>} Confirmation of webhook processing
 * 
 * @example Webhook Event - One-Time Payment
 * {
 *   "id": "whk_123",
 *   "eventType": "checkout.completed",
 *   "object": {
 *     "request_id": "user_123",
 *     "id": "pay_123",
 *     "customer": { "id": "cus_123" },
 *     "product": {
 *       "id": "prod_123",
 *       "billing_type": "one-time"
 *     }
 *   }
 * }
 * 
 * @example Webhook Event - Subscription
 * {
 *   "id": "whk_456",
 *   "eventType": "subscription.paid",
 *   "object": {
 *     "id": "sub_123",
 *     "metadata": { "userId": "user_123" },
 *     "customer": { "id": "cus_123" },
 *     "product": {
 *       "id": "prod_456",
 *       "billing_type": "recurring"
 *     }
 *   }
 * }
 */

function getStatus(status: string): $Enums.SubscriptionStatus {
    switch (status) {
        case 'trialing':
            return $Enums.SubscriptionStatus.TRIAL
        case 'active':
            return $Enums.SubscriptionStatus.ACTIVE;
        case 'canceled':
            return $Enums.SubscriptionStatus.CANCELED;
        case 'expired':
            return $Enums.SubscriptionStatus.EXPIRED;
        default:
            return $Enums.SubscriptionStatus.ACTIVE;
    }
}

export async function POST(req: NextRequest) {
    const webhook = (await req.json()) as WebhookResponse;
    // Determine payment type based on billing_type
    const isSubscription = webhook.object.product.billing_type === "recurring";
    //  get body params
    console.log("webhook: ", webhook)

    if (!webhook) {
        return NextResponse.json({ error: 'No payload' }, { status: 400 });
    }
    if (!isSubscription) {
        return NextResponse.json({
            success: true,
            message: "Webhook received successfully",
          });
    }

    const creemCustomSign = webhook.object.metadata.creemCustomSign || "";
    if(!creemCustomSign || creemCustomSign !== DefaultCustomSign) {
        return NextResponse.json({ error: 'Invalid creem custom sign' }, { status: 400 });
    }

    const userId = webhook.object.metadata.userId;


    try {
        /**
           * Subscription Flow
           * ----------------
           * Handles the complete subscription lifecycle:
           * 
           * 1. subscription.paid
           *    - New subscription or successful renewal
           *    - Create/update subscription record
           *    - Enable access to subscription features
           * 
           * 2. subscription.canceled
           *    - User requested cancellation
           *    - Mark subscription for non-renewal
           *    - Optionally maintain access until period end
           * 
           * 3. subscription.expired
           *    - Final state: payment failed or canceled period ended
           *    - Update subscription status
           *    - Revoke access to subscription features
           */
        if (webhook.eventType === "subscription.paid") {
            const productId = webhook.object.product.id;
            const product = PricingCodes.find(
                p => p.productId.monthly === productId ||
             p.productId.yearly === productId);
             
            if (!product) {
                return NextResponse.json({ error: `Product ${productId} not found` }, { status: 400 });
            }
            const isInTrial = webhook.object.status == 'trialing'
            const isYearly = product?.productId.yearly === productId;
             const credits = isYearly ? product?.credit.yearly : product?.credit.monthly;
            console.log("product: ", product)
            


            await prisma.$transaction(async (tx) => {

                const payment = await tx.payment.create({
                    data: {
                        userId,
                        amount: webhook.object.last_transaction.amount,
                        currency: webhook.object.last_transaction.currency,
                        status: 'SUCCEED',
                        channel: PaymentChannel.CREEM,
                        credit: credits,
                        paypalPayerId: webhook.object.customer.id,
                        paymentId: webhook.object.id,
                        subscriptionId: product.code as $Enums.SubscriptionTier,
                        updatedAt: new Date()
                    }
                })

                // Create credit transaction record
                await tx.creditTransaction.create({
                    data: {
                        userId: userId,
                        type: CreditTransactionType.MONTHLY_REFILL,
                        amount: credits,
                        description: `get ${credits} credits for subscription to ${product.name}`,
                        relatedEntityId: payment.id
                    }
                })

                // Update user credits
                await tx.user.update({
                    where: { id: userId },
                    data: {
                        credits: credits,
                        subscriptionTier: product.code as $Enums.SubscriptionTier,
                        subscriptionExpires: new Date(webhook.object.current_period_end_date), 
                        lastCreditRefill: new Date(),
                        subscriptionStatus: getStatus(webhook.object.status),
                        subscriptionId: webhook.object.id
                    }
                })
            }, {
                maxWait: 5000, // default: 2000
                timeout: 10000, // default: 5000
            })
        }

        if (webhook.eventType === "subscription.canceled") {
            // Update subscription status to handle cancellation
            await prisma.user.update({
                where: { id: userId },
                data: {
                    subscriptionStatus: $Enums.SubscriptionStatus.CANCELED,
                }
            })
        }

        if (webhook.eventType === "subscription.expired") {
            // Final subscription state update
            // expired, so clear credits
            await prisma.user.update({
                where: { id: userId },
                data: {
                    credits: 0,
                    subscriptionStatus: $Enums.SubscriptionStatus.EXPIRED,
                }
            })
        }


        // Confirm webhook processing
        return NextResponse.json({
            success: true,
            message: "Webhook received successfully",
        });


    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}