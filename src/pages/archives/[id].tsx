import { useEffect, useState} from 'react'
import dayjs from 'dayjs'
import classNames from 'classnames'
import { List, InputItem, TextareaItem, Button, Toast } from 'antd-mobile'
import Form, { Field, useForm } from 'rc-field-form'
import Link from 'next/link'
import Header from '@/src/components/Header'
import Tags from '@/src/components/Tags'
import styles from './index.less'
import { NextPage, GetStaticPaths, GetStaticProps } from "next"
import { PostType } from "@/src/types/post"
import {CommentType} from "@/src/types/comment"
import PostServer from "@/src/services/post"
import CommentServer from "@/src/services/comment"
import { MenuType } from "@/src/types/menu"
import MenuServer from "@/src/services/menu"
import { SettingType } from "@/src/types/setting"
import SettingServer from "@/src/services/setting"

// @ts-ignore
import { If, When, Otherwise, Choose } from 'babel-plugin-jsx-control-statements'
import Footer from "@/src/components/Footer";

export interface ArchivesProps {
  postDetail: PostType
  randomPostsList: PostType[]
  menu: MenuType []
  setting: SettingType
  id: string
}

export interface commentProps {
  total: number
  list: CommentType[]
}

const Archives: NextPage<ArchivesProps> = (props) => {
  const { postDetail, randomPostsList, id, setting, menu } = props
  const [form] = useForm()

  const [comment, setComment] = useState<commentProps>({total: 0, list: []})
  const [replyTo, setReplyTo] = useState<CommentType | null>(null)

  useEffect(() => {
    getComment()
  }, [])

  /**
   * 获取评论数据
   */
  const getComment = async () => {
    const comment = await CommentServer.index(id)
    if (comment.status === 200) {
      setComment(comment.data)
    }
  }

  /**
   * 清空评论状态
   */
  useEffect(() => {
    form.resetFields();
    handleReply();
  }, [comment.total]);

  /**
   * 评论回复事件
   * @param item
   */
  const handleReply = (item?: CommentType | null) => {
    if (item !== null) {
      window.scrollTo(0 ,99999)
    }
    setReplyTo(item || null)
  };

  /**
   * 评论提交事件
   */
  const handleSubmit = () => {
    form.validateFields().then(data => {
      // @ts-ignore
      let captcha = new TencentCaptcha('2090829333', async (res: any) => {
        if (res.ret === 0) {
          data = {
            ...data,
            comment_post: postDetail._id,
            captcha: {
              ticket: res.ticket,
              randstr: res.randstr,
            },
          };
          if (replyTo !== null) {
            data = {...data, comment_parent: replyTo._id};
          }
          console.log('handleSubmit', data);
          // @ts-ignore
          const result = await CommentServer.create(data)
          if (result.status === 201) {
            Toast.success('发表成功')
            getComment()
          }
        }
      });
      captcha && captcha.show();
    }).catch(error => {
      Toast.info(error.errorFields[0].errors[0], 2);
    })
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
                <Choose>
                  <When condition={item.comment_status !== 3}>
                    {item.comment_content}
                  </When>
                  <Otherwise>该条评论已屏蔽</Otherwise>
                </Choose>
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
          <If condition={item.children.length > 0}>
            <ul className={styles["detail__comment-list"]}>{renderCommentList(item.children)}</ul>
          </If>
        </li>
      )
    })
  };

  if (!postDetail) {
    return null
  }

  return (
    <>
      <Header
        title={
          postDetail.post_type === 1 ?
            `${postDetail.post_title} ${postDetail.movie_name_en} (${dayjs(postDetail.movie_time).format('YYYY')})`
            :
            postDetail.post_title
        }
        setting={setting}
        menu={menu}
        currentMenu={postDetail.post_category._id}
      />
      <div className={styles["detail__content"]}>
        <ul className={styles["detail__info"]}>
          <li className={styles["detail__info-item"]}><i className="iconfont icon-user"/>&nbsp;
            <Link href={`/list/authors/${postDetail.post_author.user_name}`}>
              <a className="link-light">{postDetail.post_author.user_name}</a>
            </Link>
          </li>
          <li className={styles["detail__info-item"]}>
            <i className="iconfont icon-clock"/>&nbsp;{dayjs(postDetail.created_at).format('YYYY-MM-DD')}
          </li>
          <li className={styles["detail__info-item"]}>
            <i className="iconfont icon-chat"/>&nbsp;{comment.total} 条留言
          </li>
          <li className={styles["detail__info-item"]}>
            <i className="iconfont icon-eye"/>&nbsp;{postDetail.post_views}&nbsp;次浏览
          </li>
        </ul>
        <If condition={postDetail.post_type === 3}>
          <div
            className={classNames({
              [styles["detail__quote"]]: true,
            })}
          >
            {`"${postDetail.quote_content}"——${postDetail.quote_author}`}
          </div>
        </If>
        <If condition={[0, 1, 2].includes(postDetail.post_type)}>
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
              <If condition={postDetail.post_type === 2}>
                <li className={styles["detail__extra-item"]}>
                  <i className="iconfont icon-camera"/>&nbsp;
                  {dayjs(postDetail.gallery_time).format('YYYY-MM-DD')}&nbsp;
                  拍摄于&nbsp;
                  {postDetail.gallery_location}
                </li>
              </If>
              <If condition={postDetail.post_type === 1}>
                <li className={styles["detail__extra-item"]}>
                  <i className="iconfont icon-calendar"/>&nbsp;
                  上映时间：{dayjs(postDetail.movie_time).format('YYYY-MM-DD')}
                </li>
              </If>
              <If condition={postDetail.post_type === 1 || postDetail.post_type === 2}>
                <li className={styles["detail__extra-item"]}>
                  <i className="iconfont icon-tag"/>&nbsp;
                  <Tags {...postDetail} />
                </li>
              </If>
            </ul>
          </>
        </If>
        <If condition={randomPostsList.length > 0}>
          <div className={styles["block"]}>
            <div className={styles["block__title"]}>猜你喜欢</div>
            <div className={styles["block__content"]}>
              <ul className={styles["detail__post-list"]}>
                {
                  randomPostsList.map((item: any) =>
                    <li key={item._id}>
                      <Link href={`/archives/${item._id}`}>
                        <a className="link-light">{item.post_title || item.quote_content}</a>
                      </Link>
                    </li>
                  )
                }
              </ul>
            </div>
          </div>
        </If>
        <div
          className={classNames({
            [styles["detail__comment"]]: true,
            [styles["block"]]: true,
          })}
        >
          <If condition={comment.total !== 0}>
            <>
              <div className={styles["block__title"]}>{comment.total} 条留言</div>
              <div className={styles["block__content"]}>
                <ul className={styles["detail__comment-list"]}>
                  {renderCommentList(comment.list)}
                </ul>
              </div>
            </>
          </If>
          <div className={styles["block__title"]}>发表留言</div>
          <div className={styles["block__content"]}>
            <If condition={replyTo}>
              <div className={styles["detail__comment-reply"]}>
                <span className={styles["detail__comment-reply-label"]}>Reply to:</span>
                <span className={styles["detail__comment-reply-name"]}>{replyTo?.comment_author}</span>
                <span
                  className={styles["detail__comment-reply-cancel"]}
                  onClick={() => handleReply(null)}
                >
                  [取消]
                </span>
              </div>
            </If>
            <Form form={form}>
              <List>
                <Field
                  name="comment_author"
                  rules={[
                    { required: true, message: '请输入称呼' },
                    { max: 20, message: '字数不能大于20' },
                  ]}
                >
                  <InputItem
                    clear
                    placeholder="称呼"
                  />
                </Field>
                <Field
                  name="comment_email"
                  rules={[
                    { required: true, message: '请输入邮箱' },
                    { max: 30, message: '字数不能大于30' },
                    { type: 'email', message: '邮箱格式不正确'},
                  ]}
                >
                  <InputItem
                    clear
                    placeholder="邮箱"
                  />
                </Field>
                <Field
                  name="comment_content"
                  rules={[
                    { required: true, message: '请输入内容' },
                    { max: 200, message: '字数不能大于200' },
                  ]}
                >
                  <TextareaItem
                    rows={3}
                    clear
                    placeholder="评论"
                  />
                </Field>
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
            </Form>
          </div>
        </div>
      </div>
      <Footer setting={setting}/>
    </>
  )
}

Archives.defaultProps = {
  menu: [],
  setting: {
    _id: "",
    site_copyright: "",
    site_name: "",
    site_record_no: "",
    site_record_url: "",
    site_signature: ""
  },
  randomPostsList: [],
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // @ts-ignore
  const { id } = params
  const props = { id } as ArchivesProps

  // 获取文章详情
  const queryPostDetailResult = await PostServer.indexPostDetail(id)
  props.postDetail = queryPostDetailResult.data

  // 并发获取其他信息
  const promise = []
  // 获取菜单列表
  promise.push(MenuServer.indexMenu())
  // 获取随机文章列表
  promise.push(PostServer.indexRandomPostByCategoryId({
    post_category: props.postDetail.post_category._id,
    number: 10
  }))
  // 获取网站配置
  promise.push(SettingServer.indexSetting())

  const promiseAllResult = await Promise.all(promise)

  props.menu = promiseAllResult[0].data.list
  props.randomPostsList = promiseAllResult[1].data
  props.setting = promiseAllResult[2].data

  return {
    props,
    revalidate: 60 * 60 * 24,  // 详情页静态页面生命1天
  }
}

/**
 * 构建时无必要预生产静态页面，运行时生成即可
 */
// export const getStaticPaths: GetStaticPaths = async () => {
//   const allPosts = await PostServer.indexPostList({limit: 1})
//   const allPath = allPosts.data.list.map((post:PostType) => `/archives/${post._id}`) || []
//   return {
//     paths: allPath,
//     fallback: true,
//   }
// }

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  }
}

export default Archives
