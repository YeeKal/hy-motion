// lib/icons.tsx 或 components/ui/icon.tsx
import * as Icons from "lucide-react";
import { type LucideIcon } from "lucide-react";

type IconName = keyof typeof Icons;

export const Icon = ({ 
  name, 
  ...props 
}: { 
  name: IconName | string; 
} & React.ComponentPropsWithoutRef<LucideIcon>) => {
  const LucideIcon = (Icons as any)[name] as LucideIcon | undefined;

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  return <LucideIcon {...props} />;
};