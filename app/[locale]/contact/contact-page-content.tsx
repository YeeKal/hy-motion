"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";

import { MessageSquare } from "lucide-react"; // Example icons

export function ContactPageContent() {
  const t = useTranslations();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here
    // e.g., send data to an API endpoint
    console.log("Form submitted");
    // Add user feedback, e.g., a toast notification
    alert(t("successMessage"));
    (event.target as HTMLFormElement).reset();
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <MessageSquare className="mr-2 h-6 w-6 text-primary" /> {t("title")}
          </CardTitle>
          <CardDescription>
            {t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label
                htmlFor="name"
                className="text-gray-700 dark:text-gray-300"
              >
                {t("nameLabel")}
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1"
                placeholder={t("namePlaceholder")}
              />
            </div>
            <div>
              <Label
                htmlFor="email"
                className="text-gray-700 dark:text-gray-300"
              >
                {t("emailLabel")}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1"
                placeholder={t("emailPlaceholder")}
              />
            </div>
            <div>
              <Label
                htmlFor="subject"
                className="text-gray-700 dark:text-gray-300"
              >
                {t("subjectLabel")}
              </Label>
              <Input
                id="subject"
                name="subject"
                type="text"
                className="mt-1"
                placeholder={t("subjectPlaceholder")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="message"
                className="text-gray-700 dark:text-gray-300"
              >
                {t("messageLabel")}
              </Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                required
                className="resize-none w-full min-h-6 bg-transparent border-0 px-4 text-sm placeholder:text-muted-foreground "
                placeholder={t("messagePlaceholder")}
              />
            </div>
            {/* Add reCAPTCHA component here if you integrate it */}
            <div>
              <Button type="submit" className="w-full">
                {t("submitButton")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

