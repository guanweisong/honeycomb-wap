import React from 'react';

export interface NoData {
  title: string;
}

const NoData = (props: NoData) => {
  const { title } = props;

  return <div className="py-20 text-center">{title}</div>;
};

export default NoData;
