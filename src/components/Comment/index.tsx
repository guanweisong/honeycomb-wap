'use client';

import React, { FormEvent, useRef, useState } from 'react';
import { Button } from 'antd-mobile';
import { CommentEntity } from '@/src/types/comment/comment.entity';
import CommentServer from '@/src/services/comment';
import dayjs from 'dayjs';
import Card from '../Card';
import useQueryComment from '@/src/hooks/swr/comment/use.query.comment';
import { MenuType, MenuTypeName } from '@/src/types/menu/MenuType';
import useUpdateViews from '@/src/hooks/swr/views/use.update.post.views';
import { CommentStatus } from '@/src/types/comment/CommentStatus';

export interface CommentProps {
  id: string;
  type: MenuType;
}

const Comment = (props: CommentProps) => {
  const { id, type } = props;

  const [replyTo, setReplyTo] = useState<CommentEntity | null>(null);
  const formRef = useRef(null);
  useUpdateViews({ type: MenuTypeName[MenuType[type]], id });
  const { data: comment } = useQueryComment(id);

  /**
   * 评论回复事件
   * @param item
   */
  const handleReply = (item?: CommentEntity | null) => {
    if (item !== null) {
      window.scrollTo(0, 99999);
    }
    setReplyTo(item || null);
  };

  /**
   * 评论提交事件
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    let data: any = {
      // @ts-ignore
      comment_author: e.currentTarget.comment_author.value,
      // @ts-ignore
      comment_email: e.currentTarget.comment_email.value,
      // @ts-ignore
      comment_content: e.currentTarget.comment_content.value,
    };
    // @ts-ignore
    let captcha = new TencentCaptcha('2090829333', async (res: any) => {
      if (res.ret === 0) {
        data = {
          ...data,
          comment_post: id,
          captcha: {
            ticket: res.ticket,
            randstr: res.randstr,
          },
        };
        if (replyTo !== null) {
          data = { ...data, comment_parent: replyTo.id };
        }
        console.log('handleSubmit', data);
        // @ts-ignore
        const result = await CommentServer.create(data);

        if (result.id) {
          if (formRef.current) {
            // @ts-ignore
            formRef.current.reset();
          }
          handleReply(null);
        }
      }
    });
    captcha && captcha.show();
  };

  /**
   * 评论列表渲染
   * @param data
   */
  const renderCommentList = (data: CommentEntity[]) => {
    return data?.map((item) => {
      return (
        <li className="relative" key={item.id}>
          <div className="overflow-hidden py-4 border-b border-dashed dark:border-gray-900">
            <div className="float-left w-12 h-12 mr-5">
              <img src={item.avatar} className="w-full" />
            </div>
            <div className="overflow-hidden">
              <div className="text-pink-500">{item.author}</div>
              <div className="mt-1 text-gray-500">
                {item.status !== CommentStatus.BAN ? item.content : '该条评论已屏蔽'}
              </div>
            </div>
            <div className="absolute right-2 top-4">
              <span className="text-gray-400">{dayjs(item.createdAt).format('YYYY-MM-DD')}</span>
              <span className="text-gray-400 mx-1">/</span>
              <a className="text-pink-500" onClick={() => handleReply(item)}>
                Reply
              </a>
            </div>
          </div>
          {item.children.length > 0 && (
            <ul className="ml-10">{renderCommentList(item.children)}</ul>
          )}
        </li>
      );
    });
  };

  return (
    <div>
      {comment && comment.total !== 0 && (
        <Card title={`${comment.total} 条留言`}>
          <ul>{renderCommentList(comment.list)}</ul>
        </Card>
      )}
      <Card title={'发表留言'}>
        <>
          {!!replyTo && (
            <div className="leading-10">
              <span className="text-pink-500">Reply to:</span>
              <span className="mx-2">{replyTo?.author}</span>
              <a
                className="text-gray-400 transition-all hover:text-gray-500"
                onClick={() => handleReply(null)}
              >
                [取消]
              </a>
            </div>
          )}
          <form onSubmit={handleSubmit} ref={formRef}>
            <input
              className="block border-b w-full leading-10 outline-0 focus:border-pink-400 bg-transparent dark:border-gray-900"
              type={'text'}
              placeholder={'请输入称呼'}
              name={'comment_author'}
              maxLength={20}
              required
            />
            <input
              className="block border-b w-full leading-10 outline-0 focus:border-pink-400 bg-transparent dark:border-gray-900"
              type={'text'}
              placeholder={'请输入邮箱'}
              name={'comment_email'}
              required
              maxLength={30}
            />
            <textarea
              className="block border-b w-full leading-6 pt-2 outline-0 focus:border-pink-400 mb-2 bg-transparent dark:border-gray-900"
              placeholder={'请输入留言'}
              name={'comment_content'}
              required
              maxLength={200}
              rows={4}
            />
            <Button type={'submit'} color={'primary'} size={'small'}>
              提交
            </Button>
          </form>
        </>
      </Card>
    </div>
  );
};

export default Comment;
