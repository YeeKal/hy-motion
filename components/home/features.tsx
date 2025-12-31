interface FeaturesProps {
  title: string
  description: string
  items: Array<{
    key: string
    emoji: string
    title: string
    description: string
  }>
}

export function Features({
  title,
  description,
  items
}: FeaturesProps) {
  return (
    <section className="container px-4 mx-auto bg-secondary  py-20 px-4">
      <div className="">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            {title}
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.key} className="bg-card p-6 rounded-lg shadow-sm">
              <div className="flex justify-center mb-4 text-4xl">{item.emoji}</div>
              <h3 className="text-lg font-semibold text-center mb-2 text-foreground">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-center">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

