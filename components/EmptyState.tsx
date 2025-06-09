import React from 'react';

const EmptyState = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
        <div className="text-gray-400 dark:text-gray-500 text-3xl">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;
