import React from 'react';

export interface BlockProps {
  title: string;
  children: React.ReactElement;
}

const Card = (props: BlockProps) => {
  const { title, children } = props;

  return (
    <div className="my-5 lg:my-10">
      <div className="text-lg border-b-2 py-2 border-gray-300 dark:border-gray-600 dark:text-gray-400">
        {title}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Card;
