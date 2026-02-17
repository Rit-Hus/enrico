import React from 'react';

const Features: React.FC = () => {
  const steps = [
    {
      emoji: '💡',
      title: 'Expert Guidance',
      description: 'Get advice from experienced entrepreneurs who have been there.'
    },
    {
      emoji: '🚀',
      title: 'Fast Launch',
      description: 'Turn your idea into a business quickly with our optimized process.'
    },
    {
      emoji: '📈',
      title: 'Growth Support',
      description: 'Access the resources you need to scale your startup effectively.'
    }
  ];

  return (
    <section className="py-24 border-t border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="text-center p-6 space-y-4 group hover:bg-white dark:hover:bg-gray-800/50 hover:shadow-xl hover:shadow-blue-500/5 rounded-2xl transition-all border border-transparent hover:border-gray-50 dark:hover:border-gray-700">
              <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">{step.emoji}</div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">{step.title}</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
