import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import React from 'react';
import { MediaEntity } from '@/src/types/media/media.entity';

export interface MarkDownProps {
  children?: string;
  imagesInContent?: MediaEntity[];
}

const Markdown = (props: MarkDownProps) => {
  const { children = '', imagesInContent = [] } = props;
  return (
    <ReactMarkdown
      children={children}
      components={{
        img(props) {
          const currentMedia = imagesInContent.find((item) => item.url === props.src);
          return (
            <Image
              src={props.src!}
              alt={currentMedia?.name!}
              width={currentMedia?.width}
              height={currentMedia?.height}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 100vw, 33vw"
            />
          );
        },
      }}
    />
  );
};

export default Markdown;
