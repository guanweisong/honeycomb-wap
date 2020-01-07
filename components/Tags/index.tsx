import React from 'react';
// @ts-ignore
import { Link } from '@/routes';
import { TagType } from '@/types/tag';
import { PostType} from '@/types/post';

const Tag = (props: PostType) => {

  const getTags = (item: PostType) => {
    const arr = [];
    const result: TagType[] = [];
    if (item.post_type === 1) {
      arr.push(item.movie_director);
      arr.push(item.movie_actor);
      arr.push(item.movie_style);
    }
    if (item.post_type === 2) {
      arr.push(item.gallery_style);
    }
    arr.forEach((m) => {
      m && m.forEach((n) => {
        result.push(n);
      });
    });
    return result;
  }

  const tags = getTags(props);

  return (
    <span>
      {
        tags.map((item, index) => {
          return (
            <span key={item._id}>
              {index !== 0 && '、'}
              <Link to={`/tags/${encodeURI(item.tag_name)}`} key={index}><a className="link-light">{item.tag_name}</a></Link>
            </span>
          )
        })
      }
    </span>
  )
}

export default Tag;
