import { useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { List, InputItem, TextareaItem, Button, Toast } from 'antd-mobile';
// @ts-ignore
import { createForm } from 'rc-form';
// @ts-ignore
import { Link } from '@/routes';
import Header from '@/components/Header';
import Tags from '@/components/Tags';
import styles from './index.less';
import { NextPage } from "next";
import { GlobalStoreType } from '@/types/globalStore';
import { MenuStateType } from '@/models/menu';
import { PostStateType } from '@/models/post';
import { CommentStateType } from '@/models/comment';
import { NextRouter, withRouter} from 'next/router';
import { PostType } from "@/types/post";
import {CommentType} from "@/types/comment";

interface ArchivesProps {
  form: any;
  router: NextRouter;
}
// @ts-ignore
const Archives: NextPage<ArchivesProps> = (props) => {

  const { menu } = useSelector<GlobalStoreType, MenuStateType>(state => state.menu);
  const post = useSelector<GlobalStoreType, PostStateType>(state => state.post);
  const comment = useSelector<GlobalStoreType, CommentStateType>(state => state.comment);
  const dispatch = useDispatch();

  const postId = props.router.query.id;
  // @ts-ignore
  const postDetail: PostType = post.detail[postId];
  // @ts-ignore
  const randomPostsList: PostType[] = post.randomPostsList[postId] || [];

  useEffect(() => {
    const thisCategory = menu.find(item => item._id === postDetail.post_category._id);
    // @ts-ignore
    const parentCategory = menu.filter(item => item._id === thisCategory.category_parent);
    // @ts-ignore
    const categoryPath = parentCategory.length > 0 ? [parentCategory[0].category_title_en, thisCategory.category_title_en] : [thisCategory.category_title_en];
    dispatch({
      type: 'menu/setCurrentCategoryPath',
      payload: categoryPath,
    });
  }, [postDetail]);

  /**
   * 清空评论状态
   */
  useEffect(() => {
    props.form.resetFields();
    handleReply();
  }, [comment.total]);

  /**
   * 评论回复事件
   * @param item
   */
  const handleReply = (item?: CommentType | null) => {
    if (item !== null) {
      window.scrollTo(0 ,99999);
    }
    dispatch({
      type: 'comment/setReplyTo',
      payload: item || null,
    });
  };

  /**
   * 评论提交事件
   */
  const handleSubmit = () => {
    props.form.validateFields((error: unknown) => {
      if (error) {
        // @ts-ignore
        Toast.info(Object.values(error)[0].errors[0].message, 2);
        return;
      }
      // @ts-ignore
      let captcha = new TencentCaptcha('2090829333', (res: any) => {
        if (res.ret === 0) {
          let data = props.form.getFieldsValue();
          data = {...data, comment_post: postDetail._id};
          if (comment.replyTo !== null) {
            data = {...data, comment_parent: comment.replyTo._id};
          }
          console.log('handleSubmit', data);
          dispatch({
            type: 'comment/create',
            payload: {
              ...data,
              captcha: {
                ticket: res.ticket,
                randstr: res.randstr,
              },
            },
          });
        }
      });
      captcha && captcha.show();
    });
  };

  /**
   * 评论列表渲染
   * @param data
   */
  const renderCommentList = (data: CommentType[]) => {
    return data.map(item => {
      return (
        <li className={styles["detail__comment-item"]} key={item._id}>
          <div className={styles["detail__comment-wrap"]}>
            <div className={styles["detail__comment-photo"]}>
              <img src={item.comment_avatar}/>
            </div>
            <div className={styles["detail__comment-content"]}>
              <div className={styles["detail__comment-name"]}>{item.comment_author}</div>
              <div className={styles["detail__comment-text"]}>
                {
                  item.comment_status !== 3 ? item.comment_content : '该条评论已屏蔽'

                }
              </div>
            </div>
            <ul className={styles["detail__comment-info"]}>
              <li className={styles["detail__comment-info-item"]}>{dayjs(item.created_at).format('YYYY-MM-DD')}</li>
              <li
                className={classNames({
                  [styles["detail__comment-info-item"]]: true,
                  [styles["detail__comment-info-item--reply"]]: true,
                })}
                onClick={() => handleReply(item)}
              >
                Reply
              </li>
            </ul>
          </div>
          {
            item.children.length > 0 && <ul className={styles["detail__comment-list"]}>{renderCommentList(item.children)}</ul>
          }
        </li>
      )
    })
  };

  const { getFieldProps } = props.form;
  return (
    <>
      <Header
        title={
          postDetail.post_type === 1 ?
            `${postDetail.post_title} ${postDetail.movie_name_en} (${dayjs(postDetail.movie_time).format('YYYY')})`
            :
            postDetail.post_title
        }
      />
      <div className={styles["detail__content"]}>
        <ul className={styles["detail__info"]}>
          <li className={styles["detail__info-item"]}><i className="iconfont icon-user"/>&nbsp;
            <Link to={`/authors/${postDetail.post_author.user_name}`}><a className="link-light">{postDetail.post_author.user_name}</a></Link>
          </li>
          <li className={styles["detail__info-item"]}><i className="iconfont icon-clock"/>&nbsp;{dayjs(postDetail.created_at).format('YYYY-MM-DD')}</li>
          <li className={styles["detail__info-item"]}><i className="iconfont icon-chat"/>&nbsp;{comment.total} Comments</li>
          <li className={styles["detail__info-item"]}><i className="iconfont icon-eye"/>&nbsp;{postDetail.post_views}&nbsp;Views</li>
        </ul>
        {
          postDetail.post_type === 3 ?
            <div
              className={classNames({
                [styles["detail__quote"]]: true,
              })}
            >
              {`"${postDetail.quote_content}"——${postDetail.quote_author}`}
            </div>
            : null
        }
        {
          [0, 1, 2].includes(postDetail.post_type) ? (
            <>
              <div
                className={classNames({
                  [styles["detail__detail"]]: true,
                  'markdown-body': true,
                })}
                // @ts-ignore
                dangerouslySetInnerHTML={{__html: postDetail.post_content}}
              />
              <ul className={styles["detail__extra"]}>
                {
                  postDetail.post_type === 2 ?
                    <li className={styles["detail__extra-item"]}><i className="iconfont icon-camera"/>&nbsp;{dayjs(postDetail.gallery_time).format('YYYY-MM-DD')}&nbsp;拍摄于&nbsp;{postDetail.gallery_location}</li>
                    :
                    null
                }
                {
                  postDetail.post_type === 1 ?
                    <li className={styles["detail__extra-item"]}><i className="iconfont icon-calendar"/>&nbsp;上映时间：{dayjs(postDetail.movie_time).format('YYYY-MM-DD')}</li>
                    :
                    null
                }
                {
                  (postDetail.post_type === 1 || postDetail.post_type === 2) ?
                    <li className={styles["detail__extra-item"]}><i className="iconfont icon-tag"/>&nbsp;<Tags {...postDetail} /></li>
                    :
                    null
                }
              </ul>
            </>
          ) : null
        }
        {
          randomPostsList.length > 0 ?
            <div className={styles["block"]}>
              <div className={styles["block__title"]}>猜你喜欢</div>
              <div className={styles["block__content"]}>
                <ul className={styles["detail__post-list"]}>
                  {
                    randomPostsList.map((item: any) =>
                      <li key={item._id}>
                        <Link to={`/archives/${item._id}`}>
                          <a className="link-light">{item.post_title || item.quote_content}</a>
                        </Link>
                      </li>
                    )
                  }
                </ul>
              </div>
            </div>
            : null
        }
        <div className={classNames({
          [styles["detail__comment"]]: true,
          [styles["block"]]: true,
        })}
        >
          {
            comment.total !== 0 ?
              <>
                <div className={styles["block__title"]}>{comment.total} Comments</div>
                <div className={styles["block__content"]}>
                  <ul className={styles["detail__comment-list"]}>
                    {renderCommentList(comment.list)}
                  </ul>
                </div>
              </>
              : null
          }
          <div className={styles["block__title"]}>Leave A Comment</div>
          <div className={styles["block__content"]}>
            {
              comment.replyTo !== null ?
                <div className={styles["detail__comment-reply"]}>
                  <span className={styles["detail__comment-reply-label"]}>Reply to:</span>
                  <span className={styles["detail__comment-reply-name"]}>{comment.replyTo.comment_author}</span>
                  <span
                    className={styles["detail__comment-reply-cancel"]}
                    onClick={() => handleReply(null)}
                  >
                      [取消]
                    </span>
                </div>
                :
                null
            }
            <List>
              <InputItem
                {...getFieldProps('comment_author', {
                  rules: [
                    { required: true, message: '请输入称呼' },
                    { max: 20, message: '字数不能大于20' }
                  ],
                })}
                clear
                placeholder="称呼"
              />
              <InputItem
                {...getFieldProps('comment_email', {
                  rules: [
                    { required: true, message: '请输入邮箱' },
                    { max: 30, message: '字数不能大于30' },
                    { type: 'email', message: '邮箱格式不正确'}
                  ],
                })}
                clear
                placeholder="邮箱"
              />
              <TextareaItem
                {...getFieldProps('comment_content', {
                  rules: [
                    { required: true, message: '请输入内容' },
                    { max: 200, message: '字数不能大于200' },
                  ],
                })}
                rows={3}
                clear
                placeholder="评论"
              />
            </List>
            <Button
              type="primary"
              size="small"
              inline={true}
              style={{marginTop: '0.5rem'}}
              onClick={handleSubmit}
            >
              提交
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

// @ts-ignore
Archives.getInitialProps = async(props) => {
  // @ts-ignore
  const { dvaStore } = props;
  const { post, comment } = dvaStore.getState();
  const postId = props.query.id;
  let postDetail = post.detail[postId];
  const randomPostsList =  post.randomPostsList[postId];
  const commentList = comment.list;

  /**
   * 获取文章数据
   */
  if (!postDetail) {
    await dvaStore.dispatch({
      type: 'post/indexPostDetail',
      payload: postId
    });
  }

  /**
   * 获取随机文章数据
   */
  if (!randomPostsList) {
    await dvaStore.dispatch({
      type: 'post/indexRandomPostByCategoryId',
      payload: {
        post_category: dvaStore.getState().post.detail[postId].post_category._id,
        post_id: postId,
        number: 10,
      },
    });
  }

  /**
   * 获取文章评论列表
   */
  if (commentList.length === 0) {
    await dvaStore.dispatch({
      type: 'comment/index',
      payload: postId,
    });
  }

  return {};
}

export default withRouter(createForm()(Archives));
