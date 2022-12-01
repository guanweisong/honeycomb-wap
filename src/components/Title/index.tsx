'use client';

import { useEffect } from 'react';

export interface TitleProps {
  title?: string;
}

export default function Title(props: TitleProps) {
  const { title } = props;

  useEffect(() => {
    document.title = title ?? '';
  }, [title]);

  return null;
}
