import React from 'react';

interface IProps {
  text: string;
}

const Signature = (props: IProps) => {
  const renderLine = () => {
    return <span className="h-px flex-1 mt-3 bg-gray-100" />;
  };

  return (
    <div className="flex my-4">
      {renderLine()}
      <span className="px-4 text-gray-400">{props.text}</span>
      {renderLine()}
    </div>
  );
};

export default Signature;
