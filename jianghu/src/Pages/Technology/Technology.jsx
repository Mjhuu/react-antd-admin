import React, {Component} from 'react';
import marked from 'marked';
import hljs from 'highlight.js';
import './css/index.styl'
import {dealHtml} from "../../Common/js/FabLabFun";
import {getArticle, getArticleInfo, collectArticle, commentArticle, gradeArticle, delComment} from "../../Api";
import Typing from "../../Components/Typing/Typing";
import {
    Avatar,
    message,
    Pagination,
    Skeleton,
    Drawer,
    Rate,
    Comment,
    Icon,
    Tooltip,
    Tag,
    Empty,
    Input,
    Button, Modal
} from "antd";
import HeadImg from "../../Common/images/headImg.png";
import moment from "moment";
import {connect} from "react-redux";
import {inject_unount} from "../../Utils/decorator";
import Tool from './../../Common/js/FabLabTool'
import {trim} from "../../Common/js/FabLabFun";

const myTool = new Tool();
const TextArea = Input.TextArea;
const { confirm } = Modal;
const store = connect(
    state => ({
        adminInfo: state.adminInfo,
    }),
    null
);
const handleScore = (score) => {
    let res;
    score = Number(score);
    if(score === 0){
        res = 0
    }else {
        res = Math.floor(score - 0.5)
    }
    return res
};

@store @inject_unount
class Technology extends Component {
    state = {
        total: 0,
        page: 1,
        limit: 10,
        articleList: [],
        reqArticleLoading: false,
        selectArticleDrawer: false,
        selectArticleInfo: {},
        commentList: null, //评论列表
        expandIds: [],  //展开的id列表
        score: 0, //评分
        replyPId: '',
        replyComment: {},
        placeholder: '',
        replyContent: '',
        commentContent: '',
        desc: ['差劲', '一般般', '还可以', '有深度', '很不错']
    };

    render() {
        let {total, page, limit, articleList, reqArticleLoading, selectArticleDrawer, selectArticleInfo, commentList, expandIds, placeholder, replyPId, replyContent, desc, score, commentContent} = this.state;
        let skeleton = [];
        let averageGrade = selectArticleInfo.averageGrade || 0;
        for (let i = 0; i < limit; i++) {
            skeleton.push(i)
        }
        return (
            <div className="technology-box">
                {/*查看文章的模板*/}
                {
                    JSON.stringify(selectArticleInfo) !== '{}' &&
                    <Drawer
                        title={selectArticleInfo.articleInfo.title}
                        placement="right"
                        width={880}
                        closable={false}
                        onClose={this.onClose}
                        visible={selectArticleDrawer}
                    >
                        <section className="select-article-info">
                            <div className="top">
                                <div className="headImg">
                                    <Avatar style={{cursor: 'pointer'}}
                                            src={selectArticleInfo.adminInfo.headImg ? selectArticleInfo.adminInfo.headImg : HeadImg}
                                            size={40} icon="user"/>
                                    <div className="aside">
                                        <div className="name">
                                            {selectArticleInfo.adminInfo.username}
                                        </div>
                                        <div className="info">
                                            <span> 阅读 {selectArticleInfo.articleInfo.readCount} </span>
                                            <span> 字数 {selectArticleInfo.articleInfo.contentLength} </span>
                                            <span> {moment(selectArticleInfo.articleInfo.createdAt).format('YYYY/MM/DD HH:mm:ss')} </span>
                                        </div>
                                    </div>
                                    {/*评分*/}
                                    <div className="score">
                                        <Rate allowHalf disabled value={selectArticleInfo.averageGrade}/>
                                        <span style={{fontWeight: '500', padding: '0 1rem'}}>{desc[handleScore(averageGrade)]}</span>
                                    </div>
                                </div>
                            </div>
                            <div dangerouslySetInnerHTML={{__html: selectArticleInfo.articleInfo.htmlContent}}
                                 className="content"/>
                            <div className="bottom">
                                <div className="collect">
                                    <Tooltip title={selectArticleInfo.myCollect ? '取消收藏' : '收藏'}>
                                        <span onClick={this.collectArticle} className={selectArticleInfo.myCollect && 'current'}>藏</span>
                                    </Tooltip>
                                </div>
                                <div className="score">
                                    <div className="title">评分</div>
                                    <div className="grade">
                                        <Rate tooltips={desc} disabled={!!selectArticleInfo.myGrade} allowHalf onChange={v =>this.gradeArticle(v)} value={!!selectArticleInfo.myGrade ? Number(selectArticleInfo.myGrade.score) : score}/>
                                    </div>
                                </div>
                                {
                                    commentList &&
                                    <div className="comment-list">
                                        <div className="title">精彩评论</div>
                                        <div style={{textAlign: 'right'}}>
                                            <TextArea onChange={e => this.commentChange(e, 'commentContent')} rows={4} style={{marginBottom: 10}}
                                                      value={commentContent} placeholder={'留下你的精彩评论吧。'}/>
                                            <Button onClick={this.commentArticle} size='small' type='primary'>评论</Button>
                                        </div>
                                        {
                                            JSON.stringify(commentList) === '{}' ? <Empty
                                                description="暂无评论"/> : Object.keys(commentList).sort((a, b) => b - a).map((v, index, arr) => {
                                                return <Comment
                                                    key={v}
                                                    author={<span
                                                        style={{fontSize: 16}}>{commentList[v].adminInfo.username} {selectArticleInfo.adminInfo.uuid === commentList[v].adminInfo.uuid &&
                                                    <Tag color="#87d068">博主</Tag>}</span>}
                                                    avatar={<img className='avatar-img'
                                                                 src={commentList[v].adminInfo.headImg ? commentList[v].adminInfo.headImg : HeadImg}
                                                                 alt='avatar'/>}
                                                    content={<div className='info-box braft-output-content'
                                                                  dangerouslySetInnerHTML={{__html: commentList[v].commentInfo.content}}/>}
                                                    actions={this.renderActions(commentList[v], commentList[v].commentInfo.id, 1)}
                                                    datetime={`第${arr.length - index}楼`}
                                                >
                                                    {
                                                        commentList[v].children.slice(0, expandIds.includes(commentList[v].commentInfo.id) ? commentList[v].children.length : 1).map((vv, childrenIndex) =>
                                                            <Comment
                                                                key={vv.commentInfo.id}
                                                                author={<span
                                                                    style={{fontSize: 15}}>{vv.adminInfo.username} {vv.adminInfo.uuid === selectArticleInfo.adminInfo.uuid &&
                                                                <Tag color="#87d068">博主</Tag>} {
                                                                    vv.replyAdminInfo && <span style={{
                                                                        color: '#eb7350',
                                                                        cursor: 'pointer'
                                                                    }}>@{vv.replyAdminInfo.username} {vv.replyAdminInfo.uuid === selectArticleInfo.adminInfo.uuid &&
                                                                    <Tag color="#87d068">博主</Tag>}
                                                                    </span>}</span>}
                                                                avatar={<img className='avatar-img-small'
                                                                             src={vv.adminInfo.headImg ? vv.adminInfo.headImg : HeadImg}
                                                                             alt='avatar'/>}
                                                                content={<div className='info-box'
                                                                              dangerouslySetInnerHTML={{__html: vv.commentInfo.content}}/>}
                                                                actions={this.renderActions(vv, commentList[v].commentInfo.id, 2, childrenIndex)}
                                                            />)}
                                                    <div className='toggle-reply-box'
                                                         style={{display: commentList[v].children.length > 1 ? 'block' : 'none'}}>
                                                        {
                                                            expandIds.includes(commentList[v].commentInfo.id) ? (
                                                                <span
                                                                    onClick={() => this.foldReply(commentList[v])}>收起全部{commentList[v].children.length}条回复 <Icon
                                                                    type='up-circle'/></span>
                                                            ) : (
                                                                <span
                                                                    onClick={() => this.expandReply(commentList[v])}>展开全部{commentList[v].children.length}条回复 <Icon
                                                                    type="down-circle"/></span>
                                                            )
                                                        }
                                                    </div>
                                                    {replyPId === commentList[v].commentInfo.id && (
                                                        <div style={{width: '70%', textAlign: 'right'}}>
                                                            <TextArea onChange={e => this.commentChange(e, 'replyContent')} rows={4} style={{marginBottom: 10}}
                                                                      value={replyContent} placeholder={placeholder}/>
                                                            <Button size='small'
                                                                    onClick={this.closeReply}>取消</Button>&emsp;
                                                            <Button size='small' type='primary' onClick={this.replyComment}>回复</Button>
                                                        </div>
                                                    )}
                                                </Comment>
                                            })
                                        }
                                    </div>
                                }
                            </div>
                        </section>
                    </Drawer>
                }
                <Typing>
                    <p className="ant-alert ant-alert-info ant-alert-no-icon">技术大牛为你答疑解惑，第一时间解决你的技术难题。也可以将自己总结的知识分享【点击左侧"写文章"】上来。</p>
                </Typing>
                <div className="content-list">
                    <div className="top">
                        {
                            reqArticleLoading ? skeleton.map(v => <Skeleton key={v} active/>) : <ul>
                                {
                                    articleList.map((v, key) => <li key={v.articleInfo.id}>
                                        <div className="left">
                                            <div onClick={() => this.getArticleInfo(v, key)} className="title">
                                                {v.articleInfo.title}
                                            </div>
                                            <div className="a-content">
                                                {v.articleInfo.dealHtml}
                                            </div>
                                            <div className="bottom">
                                                <span className="mjhu-uniE902"> 阅读（{v.articleInfo.readCount}） </span>
                                                <span className="mjhu-2"> 评论（{v.articleInfo.commentCount}） </span>
                                                <span> {moment(v.articleInfo.createdAt).format('YYYY/MM/DD HH:mm:ss')} </span>
                                            </div>
                                        </div>
                                        <div className="right">
                                            <Avatar style={{cursor: 'pointer'}}
                                                    src={v.adminInfo.headImg ? v.adminInfo.headImg : HeadImg} size={40}
                                                    icon="user"/>
                                            {v.adminInfo.username}
                                        </div>
                                    </li>)
                                }
                            </ul>
                        }
                    </div>
                    <div className="bottom">
                        <Pagination onChange={this.pageChange} simple current={page} total={total} pageSize={limit}/>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.initMarked();
        this.reqArticle();
    }

    commentChange = (e, type) =>{
        this.setState({
            [type]: trim(e.target.value)
        })
    };
    /**
     * 回复评论
     * @returns {Promise<MessageType>}
     */
    replyComment = async ()=>{
        let {replyContent, replyComment, replyPId, commentList, selectArticleInfo} = this.state;
        if(trim(replyContent).length === 0){
            return message.warning('评论内容不得为空')
        }
        if(myTool.filterWords(replyContent).offWords.length > 0){
            return message.warning('评论内容包含敏感词汇')
        }
        let data = await commentArticle({
            articleId: selectArticleInfo.articleInfo.id,
            type: 1,
            pId: replyComment.commentInfo.id,
            content: replyContent
        });
        if(data.code === 200){
            message.success(data.data);
            if(!commentList[replyComment.commentInfo.id]){
                commentList[replyPId]['children'].push({...data.result, replyAdminInfo: replyComment.adminInfo})
            }else {
                commentList[replyPId]['children'].push(data.result)
            }
            this.setState({
                commentList,
                replyContent: ''
            })
        }else {
            message.warning(data.data)
        }
    };
    /**
     * 评论
     */
    commentArticle = async ()=>{
        let {commentContent, selectArticleInfo, commentList} = this.state;
        if(trim(commentContent).length === 0){
            return message.warning('评论内容不得为空')
        }
        if(myTool.filterWords(commentContent).offWords.length > 0){
            return message.warning('评论内容包含敏感词汇')
        }
        let data = await commentArticle({
            articleId: selectArticleInfo.articleInfo.id,
            type: 0,
            content: commentContent
        });
        if(data.code === 200){
            message.success(data.data);
            commentList[data.result.commentInfo.id] = data.result;
            commentList[data.result.commentInfo.id]['children'] = [];
            this.setState({
                commentList,
                commentContent: ''
            })
        }else {
            message.warning(data.data)
        }
    };

    /**
     * 评分
     * @param v
     * @returns {Promise<void>}
     */
    gradeArticle = async (v) =>{
        let {selectArticleInfo, desc} = this.state;
        confirm({
            title: '评分?',
            content: `你确定评分 "${v}(${desc[handleScore(v)]})" 吗？`,
            style: {
                top: '200px'
            },
            onOk: () =>{
                return new Promise(async (resolve, reject) => {
                    let data = await gradeArticle({
                        score: v,
                        articleId: selectArticleInfo.articleInfo.id
                    });
                    if(data.code === 200){
                        message.success(data.data);
                        let newScore = data.result.score;
                        let {allGradeCount, allGrade} = selectArticleInfo;
                        let newAverageGrade = (allGrade + newScore) / (allGradeCount + 1);
                        selectArticleInfo.averageGrade = newAverageGrade;
                        selectArticleInfo.myGrade = data.result;
                        this.setState({
                            selectArticleInfo,
                            score: v
                        });
                        resolve()
                    }else {
                        reject(data.data)
                    }
                }).catch(err => message.warning(err));
            }
        });
    };

    /**
     * 收藏|取消收藏
     */
    collectArticle = async ()=>{
        let {selectArticleInfo} = this.state;
        let data = await collectArticle({
            articleId: selectArticleInfo.articleInfo.id,
            type: !!selectArticleInfo.myCollect ? 0 : 1
        });
        if(data.code === 200){
            message.warning(data.data);
            selectArticleInfo.myCollect = !!selectArticleInfo.myCollect ? null : data.result;
            this.setState({
                selectArticleInfo
            })
        }else {
            message.warning(data.data)
        }
    };

    /**
     * 折叠回复
     */
    foldReply = (item) => {
        const list = this.state.expandIds.slice();
        const index = list.findIndex(i => i === item.commentInfo.id);
        list.splice(index, 1);
        this.setState({
            expandIds: list
        })
    };
    /**
     * 展开回复
     */
    expandReply = (item) => {
        this.setState({
            expandIds: [...this.state.expandIds, item.commentInfo.id]
        })
    };
    renderActions = (item, pId, type, index) => {
        let {selectArticleInfo} = this.state;
        let actions = [
            <span>
                <Tooltip title="回复时间">
                    {moment(item.commentInfo.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </Tooltip>
            </span>,
            <span style={styles.actionItem}>
                <Tooltip title="赞">
                    <span>
                        <Icon type="like"/>&nbsp;赞 ({item.commentInfo.startCount})
                    </span>
                </Tooltip>
            </span>,
            <span style={styles.actionItem}>
                <Tooltip title="回复">
                    <span onClick={() => this.showReply(item, pId)}>
                        <span className='iconfont icon-commentoutline my-iconfont'/>&nbsp;回复
                   </span>
                </Tooltip>
            </span>
        ];
        //只有博主或者本人才可删除
        if (this.props.adminInfo.admin.uuid === item.adminInfo.uuid || this.props.adminInfo.admin.uuid === selectArticleInfo.adminInfo.uuid) {
            actions.splice(2, 0, (
                <span style={styles.actionItem}>
                    <Tooltip title="删除">
                        <span onClick={()=> this.delComment({type, index, pId})}>
                            <Icon type="delete"/>&nbsp;删除
                        </span>
                    </Tooltip>
                </span>
            ))
        }
        return actions
    };
    /**
     * 删除评论
     * @param type
     * @param index
     * @param pId
     * @returns {Promise<void>}
     */
    delComment = async ({type, index, pId}) =>{
        let {commentList} = this.state;
        confirm({
            title: type === 1 ? '删除评论?' : '删除回复?',
            content: type === 1 ? '删除此评论以及此评论下的所有回复' : '删除此回复',
            style: {
                top: '200px'
            },
            okText: '删除',
            onOk: () =>{
                return new Promise(async (resolve, reject) => {
                    let data = await delComment({
                        type,
                        articleId: type === 1 ? pId : commentList[pId]['children'][index]['commentInfo']['id']
                    });
                    console.log(data);
                    if(data.code === 200){
                        message.success(data.data);
                        if(type === 1){
                            delete commentList[pId];
                        }else {
                            commentList[pId]['children'].splice(index, 1);
                        }
                        this.setState({
                            commentList
                        });
                        resolve()
                    }else {
                        reject(data.data)
                    }
                }).catch(err => message.warning(err));
            }
        });
    };

    /**
     * 展开回复的id
     * @param item
     * @param pId
     */
    showReply = (item, pId) => {
        this.setState({
            replyPId: pId,
            replyComment: item,
            placeholder: `${this.props.adminInfo.admin.username} @ ${item.adminInfo.username}`,
            replyContent: ''
        })
    };
    /**
     * 关闭回复的texttarea
     */
    closeReply = () => {
        this.setState({
            replyPId: ''
        })
    };
    onClose = () => {
        this.setState({
            selectArticleDrawer: false
        })
    };
    getArticleInfo = async (v, key) => {
        let {articleList} = this.state;
        let id = v.articleInfo.id;
        await this.setState({
            selectArticleDrawer: true,
            selectArticleInfo: v,
            commentList: null,
            score: 0
        });
        let data = await getArticleInfo({id});
        if (data.code === 200) {
            /*改造评论列表*/
            let comments = data.result.commentList;
            let commentList = new Map();
            let belongTo = new Map();
            console.log(comments);
            for (let i = 0; i < comments.length; i++) {
                if (comments[i].commentInfo.type === 0) {
                    commentList.set(comments[i].commentInfo.id, comments[i]);
                    commentList.get(comments[i].commentInfo.id)['children'] = [];
                }
                for (let j = 0; j < comments.length; j++) {
                    if (comments[j].commentInfo.id === comments[i].commentInfo.pId) {
                        // 判断回复的id是否是二级回复
                        if (comments[j].commentInfo.type === 1) {
                            // 二级回复处理
                            //判断二级回复的祖评论
                            let key = belongTo.get(comments[i].commentInfo.pId);
                            belongTo.set(comments[i].commentInfo.id, key);
                            comments[i].replyAdminInfo = comments[j].adminInfo;
                            commentList.get(key)['children'].push(comments[i]);
                        } else {
                            if (!commentList.get(comments[j].commentInfo.id)['children']) {
                                commentList.get(comments[j].commentInfo.id)['children'] = [];
                            }
                            belongTo.set(comments[i].commentInfo.id, comments[i].commentInfo.pId);
                            commentList.get(comments[j].commentInfo.id)['children'].push(comments[i]);
                        }
                    }
                }
            }

            let commentInfo = {};
            commentList.forEach((value, key1) => {
                commentInfo[key1] = value;
            });

            let {selectArticleInfo} = this.state;
            //阅读数手动+1
            articleList[key].articleInfo.readCount += 1;
            this.setState({
                articleList,
                commentList: commentInfo,
                selectArticleInfo: {...selectArticleInfo, ...data.result}
            })
        } else {
            message.warning(data.data)
        }
    };

    initMarked() {
        marked.setOptions({
            renderer: new marked.Renderer(),
            gfm: true,
            tables: true,
            breaks: true,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: false,
            highlight: function (code) {
                return hljs.highlightAuto(code).value;
            },
        });
    }

    pageChange = async (page) => {
        await this.setState({
            page
        });
        this.reqArticle();
    };
    reqArticle = async () => {
        let {page, limit} = this.state;
        await this.setState({
            reqArticleLoading: true
        });
        let data = await getArticle({
            page,
            limit,
            type: 1
        });
        if (data.code === 200) {
            data.result.articleList.forEach(value => {
                let markedHtml = marked(value.articleInfo.content);
                let formatHtml = dealHtml(markedHtml);
                value.articleInfo.dealHtml = formatHtml.substr(0, 300);
                value.articleInfo.contentLength = formatHtml.length;
                value.articleInfo.htmlContent = markedHtml;
            });
            console.log(data.result.articleList);
            this.setState({
                total: data.result.count,
                articleList: data.result.articleList,
                reqArticleLoading: false
            })
        } else {
            message.warning(data.data);
        }
    };
}

const styles = {
    actionItem: {
        fontSize: 14
    }
}
export default Technology;
