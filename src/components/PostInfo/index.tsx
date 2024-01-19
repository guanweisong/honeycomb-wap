import { ClockCircleOutline, EyeOutline, MessageOutline, UserOutline } from 'antd-mobile-icons';
import { Link } from '@/src/navigation';
import React from 'react';
import classNames from 'classnames';
import { utcFormat } from '@/src/utils/utcFormat';
import { useTranslations } from 'next-intl';

export interface PostInfoProps {
  author?: string;
  date?: string;
  comments?: number;
  views?: number;
  border?: 'top' | 'bottom';
}

const PostInfo = (props: PostInfoProps) => {
  const { author, date, views, comments, border } = props;
  const data = [];
  const t = useTranslations('PostInfo');

  if (typeof author !== 'undefined') {
    data.push({
      icon: <UserOutline />,
      content: (
        <Link
          // @ts-ignore
          href={`/list/authors/${author}`}
          className="link-light"
        >
          {author}
        </Link>
      ),
    });
  }

  if (typeof date !== 'undefined') {
    data.push({
      icon: <ClockCircleOutline />,
      content: utcFormat(date),
    });
  }

  if (typeof comments !== 'undefined') {
    data.push({
      icon: <MessageOutline />,
      content: t('messages', { count: comments }),
    });
  }

  if (typeof views !== 'undefined') {
    data.push({
      icon: <EyeOutline />,
      content: t('views', { count: views }),
    });
  }

  if (!data.length) {
    return null;
  }

  return (
    <ul
      className={classNames(
        'flex justify-center text-sm py-2 border-dashed border-auto-front-gray/30',
        {
          'border-b-0.5': border === 'bottom',
          'border-t-0.5': border === 'top',
        },
      )}
    >
      {data.map((item) => (
        <li className="flex items-center mx-1" key={item.content.toString()}>
          {item.icon}&nbsp;{item.content}
        </li>
      ))}
    </ul>
  );
};

export default PostInfo;
