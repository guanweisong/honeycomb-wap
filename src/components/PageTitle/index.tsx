import React from 'react';

export interface PageTitleProps {
  children: React.ReactNode;
}

const PageTitle = (props: PageTitleProps) => {
  return <h2 className="text-center text-base lg:text-xl pt-2 lg:pt-4">{props.children}</h2>;
};

export default PageTitle;
