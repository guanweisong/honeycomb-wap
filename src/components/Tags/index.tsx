import React from 'react';
import Link from 'next/link';
import { TagType } from '@/src/types/tag';
import { PostType } from '@/src/types/post';
import styles from './index.module.less';

const Tag = (props: PostType) => {
  const getTags = (item: TagType[] | undefined, label: string) => {
    if (item && item.length > 0) {
      return (
        <li>
          <span>{label}：</span>
          {item.map((n, index) => {
            return (
              <span key={n._id}>
                {index !== 0 && '、'}
                <Link href={`/list/tags/${encodeURI(n.tag_name)}`}>
                  <a className="link-light">{n.tag_name}</a>
                </Link>
              </span>
            );
          })}
        </li>
      );
    }
  };

  return (
    <div className={styles.tags}>
      {getTags(props.movie_director, '导演')}
      {getTags(props.movie_actor, '主演')}
      {getTags(props.movie_style, '风格')}
      {getTags(props.gallery_style, '风格')}
    </div>
  );
};

export default Tag;
