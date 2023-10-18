'use client';

import { MenuEntity } from '@/src/types/menu/menu.entity';
import { useSelectedLayoutSegments } from 'next/navigation';
import React from 'react';
import Link from 'next/link';

export interface BreadCrumbProps {
  menu: MenuEntity[];
}

export interface BreadData {
  label: React.ReactNode;
  link?: any;
}

const Breadcrumb = (props: BreadCrumbProps) => {
  const menu = props.menu;
  const segments = useSelectedLayoutSegments();
  const segmentType = segments[0];
  const segmentTypePath = segments[1]?.split('/') ?? [];

  const HomeItem = menu.find((item) => item.id === 'home');

  const breadData: BreadData[] = [
    {
      label: HomeItem?.title,
      link: '/list/category',
    },
  ];

  switch (segmentType) {
    case 'list':
      if (segmentTypePath[1]) {
        const firstLevelItem = menu.find((item) => item.titleEn === segmentTypePath[1]);
        if (firstLevelItem) {
          breadData.push({
            label: firstLevelItem.title,
          });
        }
      }
      if (segmentTypePath[2]) {
        const secondLevelItem = menu.find((item) => item.titleEn === segmentTypePath[2]);
        if (secondLevelItem) {
          breadData.push({
            label: secondLevelItem.title,
          });
        }
      }
      break;
  }

  console.log('breadData', breadData);

  if (breadData.length === 1) {
    breadData.pop();
  }

  if (breadData.length === 0) {
    return null;
  }

  return (
    <div className="mb-2 lg:mb-4 container box-border px-2 dark:text-gray-400">
      {breadData.map((item, index) => (
        <>
          {item.link ? <Link href={item.link}>{item.label}</Link> : <span>{item.label}</span>}
          {index !== breadData.length - 1 ? ' / ' : ''}
        </>
      ))}
    </div>
  );
};

export default Breadcrumb;
