// components/sections/TaskAbilities.tsx
import Image from 'next/image';

interface TaskAbilitiesProps {
  title: string;
  description: string;
  tasks: Array<{
    key: string;
    icon: string;
    title: string;
    description: string;
    images: { input: string; output: string };
  }>;
}

export default function TaskAbilities({
  title,
  description,
  tasks
}: TaskAbilitiesProps) {
  return (
    <section className="w-full bg-gray-50 py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{title}</h2>
          <p className="mt-4 text-lg text-gray-600">{description}</p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {tasks.map((task) => (
            <div key={task.key} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{task.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{task.title}</h3>
                  <p className="mt-1 text-gray-600">{task.description}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <Image
                    src={task.images.input}
                    alt={`Input for ${task.title}`}
                    className="rounded-md border border-gray-200 aspect-square object-cover"
                    width={300}
                    height={300}
                  />
                </div>
                <div>
                  <Image
                    src={task.images.output}
                    alt={`Output for ${task.title}`}
                    className="rounded-md border border-gray-200 aspect-square object-cover"
                    width={300}
                    height={300}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}