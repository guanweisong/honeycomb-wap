import classNames from 'classnames';
import styles from './index.module.scss';
import React, { useEffect, useState, useRef, FormEvent } from 'react';
import { CommentType } from '@/src/types/comment';
import CommentServer from '@/src/services/comment';
import dayjs from 'dayjs';
import Card from '../Card';

export interface commentProps {
  total: number;
  list: CommentType[];
}

export interface CommentProps {
  id: string;
  getCount?: (total: number) => void;
}

const Comment = (props: CommentProps) => {
  const { id, getCount } = props;

  const [comment, setComment] = useState<commentProps>({ total: 0, list: [] });
  const [replyTo, setReplyTo] = useState<CommentType | null>(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (id) {
      getComment();
    }
  }, [id]);

  /**
   * 获取评论数据
   */
  const getComment = async () => {
    const queryCommentResult = await CommentServer.index(id);
    if (queryCommentResult.status === 200) {
      setComment(queryCommentResult.data);
      getCount && getCount(queryCommentResult.data.total);
    }
  };

  /**
   * 清空评论状态
   */
  useEffect(() => {
    if (formRef.current) {
      // @ts-ignore
      formRef.current.reset();
    }
    handleReply(null);
  }, [comment.total]);

  /**
   * 评论回复事件
   * @param item
   */
  const handleReply = (item?: CommentType | null) => {
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
          data = { ...data, comment_parent: replyTo._id };
        }
        console.log('handleSubmit', data);
        // @ts-ignore
        const result = await CommentServer.create(data);
        if (result.status === 201) {
          getComment();
        }
      }
    });
    captcha && captcha.show();
  };

  /**
   * 评论列表渲染
   * @param data
   */
  const renderCommentList = (data: CommentType[]) => {
    return data.map((item) => {
      return (
        <li className={styles['comment-item']} key={item._id}>
          <div className={styles['comment-wrap']}>
            <div className={styles['comment-photo']}>
              <img src={item.comment_avatar} />
            </div>
            <div className={styles['comment-content']}>
              <div className={styles['comment-name']}>{item.comment_author}</div>
              <div className={styles['comment-text']}>
                <Choose>
                  <When condition={item.comment_status !== 3}>{item.comment_content}</When>
                  <Otherwise>该条评论已屏蔽</Otherwise>
                </Choose>
              </div>
            </div>
            <ul className={styles['comment-info']}>
              <li className={styles['comment-info-item']}>
                {dayjs(item.created_at).format('YYYY-MM-DD')}
              </li>
              <li
                className={classNames({
                  [styles['comment-info-item']]: true,
                  [styles['comment-info-item--reply']]: true,
                })}
                onClick={() => handleReply(item)}
              >
                Reply
              </li>
            </ul>
          </div>
          <If condition={item.children.length > 0}>
            <ul className={styles['comment-list']}>{renderCommentList(item.children)}</ul>
          </If>
        </li>
      );
    });
  };

  return (
    <div
      className={classNames({
        [styles['comment']]: true,
        [styles['block']]: true,
      })}
    >
      <If condition={comment.total !== 0}>
        <Card title={`${comment.total} 条留言`}>
          <ul className={styles['comment-list']}>{renderCommentList(comment.list)}</ul>
        </Card>
      </If>
      <Card title={'发表留言'}>
        <>
          <If condition={!!replyTo}>
            <div className={styles['comment-reply']}>
              <span className={styles['comment-reply-label']}>Reply to:</span>
              <span className={styles['comment-reply-name']}>{replyTo?.comment_author}</span>
              <span className={styles['comment-reply-cancel']} onClick={() => handleReply(null)}>
                [取消]
              </span>
            </div>
          </If>
          <form className={styles.form} onSubmit={handleSubmit} ref={formRef}>
            <input
              type={'text'}
              placeholder={'请输入称呼'}
              name={'comment_author'}
              maxLength={20}
              required
            />
            <input
              type={'text'}
              placeholder={'请输入邮箱'}
              name={'comment_email'}
              required
              maxLength={30}
            />
            <textarea
              placeholder={'请输入留言'}
              name={'comment_content'}
              required
              maxLength={200}
              rows={4}
            />
            <button type={'submit'}>提交</button>
          </form>
        </>
      </Card>
    </div>
  );
};

export default Comment;
