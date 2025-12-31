'use client'
import { Button } from "@/components/ui/button"

interface ScrollButtonProps {
  targetId: string;
  buttonText?: string
}

export default function ScrollButton({ targetId, buttonText = "Play Now!" }: ScrollButtonProps) {
  const scrollToGameplay = () => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
      <Button 
        variant="default"
        onClick={scrollToGameplay}
      >
        {buttonText}
      </Button>
  );
}
