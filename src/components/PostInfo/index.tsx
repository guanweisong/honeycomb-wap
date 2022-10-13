import { ClockCircleOutline, EyeOutline, MessageOutline, UserOutline } from 'antd-mobile-icons';
import Link from 'next/link';
import dayjs from 'dayjs';
import React from 'react';
import classNames from 'classnames';

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

  if (typeof author !== 'undefined') {
    data.push({
      icon: <UserOutline />,
      content: (
        <Link href={`/list/authors/${author}`}>
          <a>{author}</a>
        </Link>
      ),
    });
  }

  if (typeof date !== 'undefined') {
    data.push({
      icon: <ClockCircleOutline />,
      content: dayjs(date).format('YYYY-MM-DD'),
    });
  }

  if (typeof comments !== 'undefined') {
    data.push({
      icon: <MessageOutline />,
      content: `${comments}条留言`,
    });
  }

  if (typeof views !== 'undefined') {
    data.push({
      icon: <EyeOutline />,
      content: `${views}次浏览`,
    });
  }

  if (!data.length) {
    return null;
  }

  return (
    <ul
      className={classNames('flex justify-center text-sm py-2 border-dashed  text-gray-500', {
        'border-b': border === 'bottom',
        'border-t': border === 'top',
      })}
    >
      {data.map((item) => (
        <li className="flex items-center mx-1">
          {item.icon}&nbsp;{item.content}
        </li>
      ))}
    </ul>
  );
};

export default PostInfo;
