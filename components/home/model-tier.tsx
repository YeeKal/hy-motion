// components/ModelTiers.tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { Icon } from "../wrapper/lucide-icon";

interface ModelTierItem {
  name: string;
  icon: string;
  badge?: string;
  description: string;
  ctaText: string;
  link: string;
  isPrimary: boolean;
  comingSoon?: boolean;
}

interface ModelTiersProps {
  data: {
    title: string;
    description: string;
    label:{
            modelLabel: string;
            commingSoon: string;
        },
    items: ModelTierItem[];
    bottomCta: {
      title: string;
      description: string;
      buttonText: string;
      link: string;
    };
  };
}

export default function ModelTiers({ data }: ModelTiersProps) {
  if (!data) return null;

  return (
    <section className="py-16 md:py-24 bg-muted/40">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">
            {data.title}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            {data.description}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {data.items.map((tier) => (
            <Card
              key={tier.name}
              // 使用 border-primary/50 来高亮主卡片
              // 使用 bg-card 确保在深色模式下背景正确
              className={`flex flex-col transition-all duration-300 border-2 bg-card 
                ${tier.isPrimary
                  ? "border-primary shadow-2xl shadow-primary/10 scale-105 z-10"
                  : "border-border hover:border-primary/50 shadow-lg hover:shadow-xl"
                }`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon
                      name={tier.icon}
                      className={`w-5 h-5 ${tier.isPrimary ? "text-primary" : tier.comingSoon ? "text-muted-foreground" : "text-foreground"}`}
                    />
                    <span className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      {data.label.modelLabel}
                    </span>
                  </div>

                  {tier.badge && (
                    <Badge variant="default" className="bg-primary/15 text-primary hover:bg-primary/25 border-0">
                      {tier.badge}
                    </Badge>
                  )}

                  {tier.comingSoon && (
                    <Badge variant="secondary" className="bg-primary/15 text-primary">
                      {data.label.commingSoon}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl font-bold text-card-foreground">
                  {tier.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-grow">
                <CardDescription className="text-base leading-relaxed text-muted-foreground">
                  {tier.description}
                </CardDescription>
              </CardContent>

              <CardFooter>
                <Link href={tier.link} className="w-full" aria-disabled={tier.comingSoon}>
                  <Button
                    // 主按钮用 default (Primary Color)，次要按钮用 outline/secondary
                    variant={tier.isPrimary ? "default" : "outline"}
                    size="lg"
                    className={`w-full font-semibold ${tier.isPrimary ? "shadow-lg shadow-primary/20" : ""
                      }`}
                    disabled={tier.comingSoon}
                  >
                    {tier.ctaText}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 p-8 bg-card rounded-2xl max-w-4xl mx-auto border border-border shadow-sm">
          <h3 className="text-xl font-semibold mb-2 text-card-foreground">
            {data.bottomCta.title}
          </h3>
          <p className="text-muted-foreground mb-6">
            {data.bottomCta.description}
          </p>
          <Link href={data.bottomCta.link}>
            <Button variant="secondary" size="lg">
              {data.bottomCta.buttonText}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}