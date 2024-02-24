import React from 'react';

export interface PageTitleProps {
  children: React.ReactNode;
}

const PageTitle = (props: PageTitleProps) => {
  return <h2 className="text-center text-xl mt-2 lg:mt-4">{props.children}</h2>;
};

export default PageTitle;
