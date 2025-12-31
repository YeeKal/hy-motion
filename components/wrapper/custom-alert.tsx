"use client"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useRouter } from '@/i18n/routing';

interface CustomAlertProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  actionText: string
  redirectUrl?: string
}

export function CustomAlert({ isOpen, onClose, title, description, actionText, redirectUrl }: CustomAlertProps) {
  const router = useRouter();
  const handleAction = () => {
    if (redirectUrl) {
      router.push(redirectUrl)
    }
    onClose()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <AlertDialogAction onClick={handleAction}>{actionText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
