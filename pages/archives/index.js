import { Component } from 'react'
import { connect } from 'react-redux';
import moment from 'moment';
import classNames from 'classnames';
import { List, InputItem, TextareaItem, Button, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import { Link } from '../../routes';
import Header from '../../components/Header';
import Tags from '../../components/Tags';
import styles from './index.less';

@createForm()
@connect(state => state)
class Archives extends Component {
  constructor(props) {
    super(props);
  }
  static async getInitialProps(props) {
    await props.dvaStore.dispatch({
      type: 'archives/getDetailData',
      payload: {
        _id: props.query.id
      }
    });
    await props.dvaStore.dispatch({
      type: 'archives/indexRandomPostByCategoryId',
      payload: {
        post_category: props.dvaStore.getState().archives.detail.post_category._id,
        number: 10,
      },
    });
    await props.dvaStore.dispatch({
      type: 'comments/index',
      payload: props.query.id,
    });
    return {};
  }
  componentDidMount() {
    const thisCategory = this.props.menu.list.find(item => item._id === this.props.archives.detail.post_category._id);
    const parentCategory = this.props.menu.list.filter(item => item._id === thisCategory.category_parent);
    const categoryPath = parentCategory.length > 0 ? [parentCategory[0].category_title_en, thisCategory.category_title_en] : [thisCategory.category_title_en];
    this.props.dispatch({
      type: 'menu/setCurrentCategoryPath',
      payload: categoryPath,
    });
    this.captcha = new TencentCaptcha('2090829333', (res) => {
      if (res.ret === 0) {
        let data = this.props.form.getFieldsValue();
        data = { ...data, comment_post: this.props.archives.detail._id};
        if (this.props.comments.replyTo !== null) {
          data = { ...data, comment_parent: this.props.comments.replyTo._id };
        }
        console.log('handleSubmit', data);
        this.props.dispatch({
          type: 'comments/create',
          payload: {
            ...data,
            captcha: {
              ticket: res.ticket,
              randstr: res.randstr
            },
            callback: () => {
              this.props.form.resetFields();
              this.handleReply(null);
            }
          },
        });
      }
    });
  }
  handleReply = (item) => {
    if (item !== null) {
      window.scrollTo(0 ,99999);
    }
    this.props.dispatch({
      type: 'comments/setReplyTo',
      payload: item,
    });
  };
  handleSubmit = () => {
    this.props.form.validateFields((error, value) => {
      if (error) {
        Toast.info(Object.values(error)[0].errors[0].message, 2);
        return;
      }
      this.captcha.show();
    });
  };
  renderCommentList = (data) => {
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
                  <Otherwise>
                    该条评论已屏蔽
                  </Otherwise>
                </Choose>
              </div>
            </div>
            <ul className={styles["detail__comment-info"]}>
              <li className={styles["detail__comment-info-item"]}>{moment(item.created_at).format('YYYY-MM-DD')}</li>
              <li
                className={classNames({
                  [styles["detail__comment-info-item"]]: true,
                  [styles["detail__comment-info-item--reply"]]: true,
                })}
                onClick={() => this.handleReply(item)}
              >
                Reply
              </li>
            </ul>
          </div>
          <If condition={item.children.length > 0}>
            <ul className={styles["detail__comment-list"]}>
              {this.renderCommentList(item.children)}
            </ul>
          </If>
        </li>
      )
    })
  };
  render() {
    const { detail, randomPostsList } = this.props.archives;
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <Header title={
          <Choose>
            <When condition={detail.post_type === 1}>
              {detail.post_title} {detail.movie_name_en} ({moment(detail.movie_time).format('YYYY')})
            </When>
            <Otherwise>
              {detail.post_title}
            </Otherwise>
          </Choose>
        }/>
        <div className={styles["detail__content"]}>
          <ul className={styles["detail__info"]}>
            <li className={styles["detail__info-item"]}><i className="iconfont icon-user"/>&nbsp;
              <Link to={`/authors/${detail.post_author.user_name}`}><a className="link-light">{detail.post_author.user_name}</a></Link>
            </li>
            <li className={styles["detail__info-item"]}><i className="iconfont icon-clock"/>&nbsp;{moment(detail.created_at).format('YYYY-MM-DD')}</li>
            <li className={styles["detail__info-item"]}><i className="iconfont icon-chat"/>&nbsp;{this.props.comments.total} Comments</li>
            <li className={styles["detail__info-item"]}><i className="iconfont icon-eye"/>&nbsp;{detail.post_views}&nbsp;Views</li>
          </ul>
          <div
            className={classNames({
              [styles["detail__detail"]]: true,
              'markdown-body': true,
            })}
            dangerouslySetInnerHTML={{__html: detail.post_content}}
          />
          <ul className={styles["detail__extra"]}>
            <If condition={detail.post_type === 2}>
              <li className={styles["detail__extra-item"]}><i className="iconfont icon-camera"/>&nbsp;{moment(detail.gallery_time).format('YYYY-MM-DD')}&nbsp;拍摄于&nbsp;{detail.gallery_location}</li>
            </If>
            <If condition={detail.post_type === 1}>
              <li className={styles["detail__extra-item"]}><i className="iconfont icon-calendar"/>&nbsp;上映时间：{moment(detail.movie_time).format('YYYY-MM-DD')}</li>
            </If>
            <If condition={detail.post_type === 1 || detail.post_type === 2}>
              <li className={styles["detail__extra-item"]}><i className="iconfont icon-tag"/>&nbsp;<Tags data={detail}/></li>
            </If>
          </ul>
          <If condition={randomPostsList.length > 0}>
            <div className={styles["block"]}>
              <div className={styles["block__title"]}>猜你喜欢</div>
              <div className={styles["block__content"]}>
                <ul className={styles["detail__post-list"]}>
                  <For each="item" index="index" of={randomPostsList}>
                    <li key={index}><Link to={`/archives/${item._id}`}><a className="link-light">{item.post_title}</a></Link></li>
                  </For>
                </ul>
              </div>
            </div>
          </If>
          <div className={classNames({
            [styles["detail__comment"]]: true,
            [styles["block"]]: true,
          })}
          >
            <If condition={this.props.comments.total !== 0}>
              <div className={styles["block__title"]}>{this.props.comments.total} Comments</div>
              <div className={styles["block__content"]}>
                <ul className={styles["detail__comment-list"]}>
                  {this.renderCommentList(this.props.comments.list)}
                </ul>
              </div>
            </If>
            <div className={styles["block__title"]}>Leave A Comment</div>
            <div className={styles["block__content"]}>
              <If condition={this.props.comments.replyTo !== null}>
                <div className={styles["detail__comment-reply"]}>
                  <span className={styles["detail__comment-reply-label"]}>Reply to:</span>
                  <span className={styles["detail__comment-reply-name"]}>{this.props.comments.replyTo.comment_author}</span>
                  <span
                    className={styles["detail__comment-reply-cancel"]}
                    onClick={() => this.handleReply(null)}
                  >
                        [取消]
                      </span>
                </div>
              </If>
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
                onClick={this.handleSubmit}
              >
                提交
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Archives;
