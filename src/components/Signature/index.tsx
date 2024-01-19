import React from 'react';

interface IProps {
  text: string;
}

const Signature = (props: IProps) => {
  const renderLine = () => {
    return <span className="h-px flex-1 mt-2.5 bg-auto-back-gray/30" />;
  };

  return (
    <div className="flex my-4">
      {renderLine()}
      <span className="px-4 text-auto-front-gray/50">{props.text}</span>
      {renderLine()}
    </div>
  );
};

export default Signature;
