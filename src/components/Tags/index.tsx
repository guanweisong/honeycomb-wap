import React from 'react';
import Link from 'next/link';
import { TagEntity } from '@/src/types/tag/tag.entity';
import { PostEntity } from '@/src/types/post/post.entity';
import { useTranslations } from 'next-intl';

const Tag = (props: PostEntity) => {
  const t = useTranslations('Tag');

  const getTags = (item: TagEntity[] | undefined, label: string) => {
    if (item && item.length > 0) {
      return (
        <li>
          <span>{label}：</span>
          {item.map((n, index) => {
            return (
              <span key={n.id}>
                {index !== 0 && '、'}
                <Link href={`/list/tags/${encodeURI(n.name)}`} className="link-light">
                  {n.name}
                </Link>
              </span>
            );
          })}
        </li>
      );
    }
  };

  return (
    <div className="list-none text-gray-400">
      {getTags(props.movieDirectors, t('directors'))}
      {getTags(props.movieActors, t('actors'))}
      {getTags(props.movieStyles, t('styles'))}
      {getTags(props.galleryStyles, t('styles'))}
    </div>
  );
};

export default Tag;
