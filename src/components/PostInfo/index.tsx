import { Link } from '@/src/navigation';
import React from 'react';
import classNames from 'classnames';
import { utcFormat } from '@/src/utils/utcFormat';
import { useTranslations } from 'next-intl';

export enum Align {
  Left = 'left',
  Center = 'center',
}

export interface PostInfoProps {
  author?: string;
  date?: string;
  comments?: number;
  views?: number;
  align?: Align;
}

const PostInfo = (props: PostInfoProps) => {
  const { author, date, views, comments, align = Align.Center } = props;
  const data = [];
  const t = useTranslations('PostInfo');

  if (typeof author !== 'undefined') {
    data.push(
      <Link
        // @ts-ignore
        href={`/list/authors/${author}`}
        className="link-light"
      >
        {author}
      </Link>,
    );
  }

  if (typeof date !== 'undefined') {
    data.push(utcFormat(date));
  }

  if (typeof comments !== 'undefined') {
    data.push(t('messages', { count: comments }));
  }

  if (typeof views !== 'undefined') {
    data.push(t('views', { count: views }));
  }

  if (!data.length) {
    return null;
  }

  return (
    <div
      className={classNames('flex text-sm my-2 border-dashed border-auto-front-gray/30', {
        'justify-center': align === Align.Center,
        'justify-start': align === Align.Left,
      })}
    >
      {data.map((item, index) => (
        <span key={item.toString()}>
          {index > 0 && <span className="mx-1 text-gray-300">/</span>}
          <span>{item}</span>
        </span>
      ))}
    </div>
  );
};

export default PostInfo;
