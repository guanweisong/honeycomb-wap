import React from 'react';
import { Link } from '@/src/navigation';
import { TagEntity } from '@/src/types/tag/tag.entity';
import { PostEntity } from '@/src/types/post/post.entity';
import { useLocale, useTranslations } from 'next-intl';

const Tag = (props: PostEntity) => {
  const t = useTranslations('Tag');
  const locale = useLocale();

  const getTags = (item: TagEntity[] | undefined, label: string) => {
    if (item && item.length > 0) {
      return (
        <li>
          <span>{label}：</span>
          {item.map((n, index) => {
            return (
              <span key={n.id}>
                {index !== 0 && '、'}
                <Link
                  // @ts-ignore
                  href={`/list/tags/${encodeURI(n.name[locale])}`}
                  className="link-light"
                >
                  {n.name[locale]}
                </Link>
              </span>
            );
          })}
        </li>
      );
    }
  };

  return (
    <div className="list-none">
      {getTags(props.movieDirectors, t('directors'))}
      {getTags(props.movieActors, t('actors'))}
      {getTags(props.movieStyles, t('styles'))}
      {getTags(props.galleryStyles, t('styles'))}
    </div>
  );
};

export default Tag;
