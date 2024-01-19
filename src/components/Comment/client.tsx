'use client';

import React, { useRef, useState, use, useTransition, useEffect } from 'react';
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
import { useTranslations } from 'next-intl';
import CommentServer from '@/src/services/comment';
import { MenuType } from '@/src/types/menu/MenuType';

export interface CommentClientProps extends CommentProps {
  queryCommentPromise: Promise<PaginationResponse<CommentEntity[]>>;
}

export interface User {
  author: string;
  site: string;
  email: string;
}

const CommentClient = (props: CommentClientProps) => {
  const { id, type, queryCommentPromise } = props;
  const [isPending, startTransition] = useTransition();
  const comment = use(queryCommentPromise);
  const [replyTo, setReplyTo] = useState<CommentEntity | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Comment');
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

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
    let userData = user;
    if (!userData) {
      userData = {
        author: e.currentTarget.author.value,
        email: e.currentTarget.email.value,
      } as User;
      const site = e.currentTarget.site.value;
      if (site) {
        userData.site = site;
      }
    }
    const data = { ...userData } as CommentCreate;
    data.content = e.currentTarget.content.value;
    switch (type) {
      case MenuType.CATEGORY:
        data.postId = id;
        break;
      case MenuType.PAGE:
        data.pageId = id;
        break;
      case MenuType.CUSTOM:
        data.customId = id;
        break;
    }

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
          const result = await CommentServer.create(data);
          if (result?.id) {
            startTransition(() => refreshPath(pathname));
            startTransition(router.refresh);
            handleReply(null);
            formRef.current?.reset();
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
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
          <div className="overflow-hidden py-4 border-b-0.5 border-dashed border-auto-front-gray/50">
            <div className="float-left w-12 h-12 mr-5">
              <img src={item.avatar} className="w-full" />
            </div>
            <div className="overflow-hidden">
              <div>
                {item.site ? (
                  <a className="text-pink-500" href={item.site}>
                    {item.author}
                  </a>
                ) : (
                  item.author
                )}
              </div>
              <div className="mt-1 whitespace-pre-wrap">
                {item.status !== CommentStatus.BAN ? item.content : t('banMessage')}
              </div>
            </div>
            <div className="absolute right-2 top-4 text-auto-front-gray/50">
              <span>{utcFormat(item.createdAt)}</span>
              <span className="mx-1">/</span>
              <a className="text-pink-500" onClick={() => handleReply(item)}>
                {t('form.reply')}
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
        <Card title={t('summary', { count: comment.total })}>
          <ul>{renderCommentList(comment.list)}</ul>
        </Card>
      )}
      <Card title={t('title')}>
        <>
          {!!replyTo && (
            <div className="leading-10">
              <span className="text-pink-500">Reply to:</span>
              <span className="mx-2">{replyTo?.author}</span>
              <a
                className="transition-all text-auto-front-gray/50"
                onClick={() => handleReply(null)}
              >
                [{t('form.cancel')}]
              </a>
            </div>
          )}
          <form onSubmit={handleSubmit} ref={formRef}>
            {user ? (
              <div className="my-2 flex justify-between">
                <span>
                  {t('welcomeBack')}: {user.author}
                </span>
                <span className="ml-2">
                  {t('notYou')}
                  <a
                    className="text-pink-500"
                    onClick={() => {
                      setUser(undefined);
                      localStorage.removeItem('user');
                    }}
                  >
                    [{t('quit')}]
                  </a>
                </span>
              </div>
            ) : (
              <>
                <input
                  className="block border-b-0.5 border-auto-front-gray/40 w-full leading-10 outline-0 focus:border-pink-400 bg-transparent"
                  type={'text'}
                  placeholder={t('form.name')}
                  name={'author'}
                  maxLength={20}
                  required
                />
                <input
                  className="block border-b-0.5 border-auto-front-gray/40 w-full leading-10 outline-0 focus:border-pink-400 bg-transparent"
                  type={'url'}
                  placeholder={t('form.site')}
                  name={'site'}
                  maxLength={30}
                />
                <input
                  className="block border-b-0.5 border-auto-front-gray/40 w-full leading-10 outline-0 focus:border-pink-400 bg-transparent"
                  type={'email'}
                  placeholder={t('form.email')}
                  name={'email'}
                  required
                  maxLength={30}
                />
              </>
            )}

            <textarea
              className="block border-b-0.5  border-auto-front-gray/40 w-full leading-6 pt-2 outline-0 focus:border-pink-400 mb-2 bg-transparent"
              placeholder={t('form.content')}
              name={'content'}
              required
              maxLength={200}
              rows={4}
            />
            <Button loading={isPending} type={'submit'} color={'primary'} size={'small'}>
              {t('form.submit')}
            </Button>
          </form>
        </>
      </Card>
    </div>
  );
};

export default CommentClient;
