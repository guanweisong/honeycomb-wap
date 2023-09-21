import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import React from 'react';
import { MediaEntity } from '@/src/types/media/media.entity';

export interface MarkDownProps {
  children?: string;
  imagesInContent?: MediaEntity[];
}

const MarkDown = (props: MarkDownProps) => {
  const { children = '', imagesInContent = [] } = props;
  return (
    <ReactMarkdown
      children={children}
      components={{
        img(props) {
          const currentMedia = imagesInContent.find((item) => `//${item.url}` === props.src);
          return (
            <Image
              src={`https:${props.src!}`}
              alt={currentMedia?.name!}
              width={currentMedia?.width}
              height={currentMedia?.height}
            />
          );
        },
      }}
    />
  );
};

export default MarkDown;
