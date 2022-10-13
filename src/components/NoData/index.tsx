import React from 'react';

export interface NoData {
  title: string;
}

const NoData = (props: NoData) => {
  const { title } = props;

  return <div className="bg-white py-20 text-gray-400 text-center">{title}</div>;
};

export default NoData;
