'use client';

import React, { useRef, useState, use, useTransition } from 'react';
import { Button } from 'antd-mobile';
import { CommentEntity } from '@/src/types/comment/comment.entity';
import Card from '../Card';
import { CommentStatus } from '@/src/types/comment/CommentStatus';
import { utcFormat } from '@/src/utils/utcFormat';
import { CommentProps } from './index';
import PaginationResponse from '@/src/types/pagination.response';
import { useRouter } from 'next/navigation';
import { CommentCreate } from '@/src/types/comment/comment.create';
import { refreshPath } from '@/src/utils/refreshPath';
import { usePathname } from 'next/navigation';

export interface CommentClientProps extends CommentProps {
  queryCommentPromise: Promise<PaginationResponse<CommentEntity[]>>;
  createCommentFn: (data: CommentCreate) => Promise<CommentEntity>;
}

const CommentClient = (props: CommentClientProps) => {
  const { id, queryCommentPromise, createCommentFn } = props;
  const [isPending, startTransition] = useTransition();
  const comment = use(queryCommentPromise);
  const [replyTo, setReplyTo] = useState<CommentEntity | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();

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
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const data = {
      author: e.currentTarget.author.value,
      email: e.currentTarget.email.value,
      content: e.currentTarget.content.value,
      postId: id,
    } as CommentCreate;
    const captcha = new TencentCaptcha('2090829333', async (res: any) => {
      if (res.ret === 0) {
        data.captcha = {
          ticket: res.ticket,
          randstr: res.randstr,
        };
        if (replyTo !== null) {
          data.parentId = replyTo.id;
        }
        console.log('handleSubmit', data);
        startTransition(async () => {
          const result = await createCommentFn(data);
          if (result.id) {
            startTransition(() => refreshPath(pathname));
            startTransition(router.refresh);
            handleReply(null);
            formRef.current?.reset();
          }
        });
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
              <div className="mt-1 text-gray-500 whitespace-pre-wrap">
                {item.status !== CommentStatus.BAN ? item.content : '该条评论已屏蔽'}
              </div>
            </div>
            <div className="absolute right-2 top-4">
              <span className="text-gray-400">{utcFormat(item.createdAt)}</span>
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
              name={'author'}
              maxLength={20}
              required
            />
            <input
              className="block border-b w-full leading-10 outline-0 focus:border-pink-400 bg-transparent dark:border-gray-900"
              type={'text'}
              placeholder={'请输入邮箱'}
              name={'email'}
              required
              maxLength={30}
            />
            <textarea
              className="block border-b w-full leading-6 pt-2 outline-0 focus:border-pink-400 mb-2 bg-transparent dark:border-gray-900"
              placeholder={'请输入留言'}
              name={'content'}
              required
              maxLength={200}
              rows={4}
            />
            <Button loading={isPending} type={'submit'} color={'primary'} size={'small'}>
              提交
            </Button>
          </form>
        </>
      </Card>
    </div>
  );
};

export default CommentClient;