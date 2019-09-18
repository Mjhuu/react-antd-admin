import React, {Component} from 'react';
import Editor from 'for-editor'
import {Button, message, Modal, Radio } from "antd";
import {uploadFile, publishApp, publishArticle} from "../../Api";
import Tool from './../../Common/js/FabLabTool'
import {trim} from "../../Common/js/FabLabFun";
import config from "./../../Config";
import './css/index.styl'

const myTool = new Tool();

class Edit extends Component {
    constructor(props){
        super(props);
        this.state = {
            tipText: '已保存至本地',
            articleInfo: {
                title: '',
                content: '',
                type: 1, //1-技术贴 2-软件分享
                icon: '', //软件logo
                isOpen: 1, //是否公开 0-私密 1-公开
                platform: 1, // 1-Windows 2- Mac OS 3-Android
                prevIconUrl: ''
            },
            showPublishModel: false,
            addArticleLoading: false,
        };
        this.$vm = React.createRef()
    }
    static timer = null;
    render() {
        let {tipText, articleInfo, showPublishModel, addArticleLoading} = this.state;
        return (
            <div className="edit-box">
                <Modal
                    title="发布文章"
                    visible={showPublishModel}
                    onCancel={e =>this.handleCancel(e, 'showPublishModel')}
                    footer={[
                        <Button key="back" onClick={e => this.handleCancel(e, 'showPublishModel')}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary" loading={addArticleLoading} onClick={this.handleOk}>
                            发布
                        </Button>
                    ]}
                >
                    <ul className="publish-article-box">
                        <li>
                            <div className="left">
                                类型：
                            </div>
                            <div className="right">
                                <Radio.Group onChange={e => this.infoChange(e, 'type')} value={articleInfo.type} buttonStyle="solid">
                                    <Radio.Button value={1}>技术贴</Radio.Button>
                                    <Radio.Button value={2}>软件分享</Radio.Button>
                                </Radio.Group>
                            </div>
                        </li>
                        {
                            articleInfo.type === 2 && <li style={{marginTop: '.5rem'}}>
                                <div className="left">
                                    软件Logo：
                                </div>
                                <div className="right">
                                    <div className="icon">
                                        {
                                            articleInfo.prevIconUrl ? <img alt="软件Logo" src={articleInfo.prevIconUrl}/> :
                                                <svg t="1567749885178" className="icon" viewBox="0 0 1024 1024"
                                                     version="1.1"
                                                     xmlns="http://www.w3.org/2000/svg" p-id="3227" width="200"
                                                     height="200">
                                                    <path
                                                        d="M798.1 840.3H224.6c-28.7 0-56.7-10-78.9-28.1-22.2-18.1-37.6-43.5-43.5-71.6L76 613.5c-2.8-13.5 5.9-26.7 19.4-29.5 13.5-2.8 26.7 5.9 29.5 19.4l26.3 127.2c7.2 34.6 38 59.7 73.4 59.7H798c35.4 0 66.2-25.1 73.4-59.7l26.3-127.2c2.8-13.5 16-22.2 29.5-19.4 13.5 2.8 22.2 16 19.4 29.5l-26.3 127.2c-5.8 28.1-21.2 53.5-43.5 71.6-22.1 18.1-50.1 28-78.7 28zM711.2 396c-6.4 0-12.8-2.4-17.7-7.3L535.4 230.5c-6.4-6.4-15-10-24.1-10-9.1 0-17.7 3.5-24.1 10L329.1 388.6c-9.8 9.8-25.6 9.8-35.4 0-9.8-9.8-9.8-25.6 0-35.4l158.1-158.1c15.9-15.9 37-24.6 59.4-24.6 22.5 0 43.6 8.7 59.4 24.6l158.1 158.1c9.8 9.8 9.8 25.6 0 35.4-4.7 4.9-11.1 7.4-17.5 7.4z"
                                                        p-id="3228" fill="#cccccc"></path>
                                                    <path
                                                        d="M711.2 614.2c-6.4 0-12.8-2.4-17.7-7.3L535.4 448.8c-6.4-6.4-15-10-24.1-10-9.1 0-17.7 3.5-24.1 10L329.1 606.9c-9.8 9.8-25.6 9.8-35.4 0-9.8-9.8-9.8-25.6 0-35.4l158.1-158.1c15.9-15.9 37-24.6 59.4-24.6 22.5 0 43.6 8.7 59.4 24.6l158.1 158.1c9.8 9.8 9.8 25.6 0 35.4-4.7 4.9-11.1 7.3-17.5 7.3z"
                                                        p-id="3229" fill="#cccccc"></path>
                                                </svg>
                                        }

                                    </div>
                                    <input type="file" onChange={this.selectIconImg}/>
                                </div>
                            </li>
                        }
                        {
                            articleInfo.type === 2 && <li>
                                <div className="left">
                                    平台：
                                </div>
                                <div className="right">
                                    <Radio.Group onChange={e => this.infoChange(e, 'platform')} value={articleInfo.platform} buttonStyle="solid">
                                        <Radio.Button value={1}>Windows</Radio.Button>
                                        <Radio.Button value={2}>Mac OS</Radio.Button>
                                        <Radio.Button value={3}>Android</Radio.Button>
                                    </Radio.Group>
                                </div>
                            </li>
                        }
                        <li>
                            <div className="left">
                                是否公开：
                            </div>
                            <div className="right">
                                <Radio.Group onChange={e => this.infoChange(e, 'isOpen')} value={articleInfo.isOpen} buttonStyle="solid">
                                    <Radio.Button value={0}>私密</Radio.Button>
                                    <Radio.Button value={1}>公开</Radio.Button>
                                </Radio.Group>
                            </div>
                        </li>
                    </ul>
                </Modal>
                <section onClick={this.showPublishModel} title="发布" className="publish">
                    <svg t="1568510893399" className="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="2023" width="200" height="200">
                        <path
                            d="M945.93 130.759c-7.638-15.276-26.279-21.619-41.684-13.981L92.312 520.027c-15.276 7.638-21.619 26.279-13.981 41.684 1.683 3.365 3.884 6.343 6.473 8.803 3.365 3.237 7.378 5.696 12.169 7.249l273.148 85.828 41.943-52.041-222.919-70.035 611.539-303.957-327.131 395.999a22.868 22.868 0 0 0-2.071 2.848l-37.801 46.991v194.957c0 17.218 13.852 31.069 31.069 31.069s31.069-13.852 31.069-31.069v-175.54l297.097 93.206c3.495 1.036 6.991 1.553 10.485 1.423 15.017 0.388 28.609-10.227 31.457-25.502l113.79-621.507c0.388-2.071 0.517-4.272 0.517-6.343-0.13-4.402-1.036-9.062-3.237-13.333zM779.969 726.893l-240.396-75.472L866.314 255.81l-86.346 471.082z"
                            fill="#ffffff" p-id="2024"></path>
                    </svg>
                </section>
                <div className="top">
                    <input value={articleInfo.title} type="text" onChange={this.inputChange} placeholder="请输入标题"/>
                    <div className="save">{tipText}</div>
                </div>
                <Editor ref={this.$vm} value={articleInfo.content} addImg={($file) => this.addImg($file)} onSave={this.onSave} onChange={(v) => this.changeContent(v)} />
            </div>
        );
    }

    componentDidMount() {
        this.initEditContent();
    }

    selectIconImg = e => {
        let {articleInfo} = this.state;
        let file = e.target.files[0];
        if (file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png') {
            return message.warning('您上传的文件：' + file.name + '格式不是png/jpg/jpeg格式！请重新选择！');
        }
        if (file.size > 2097152) {
            return message.warning('您上传的文件：' + file.name + '大小超过2M！请重新选择！');
        }
        myTool.srcToBase64Url(file, url => {
            articleInfo.prevIconUrl = url;
            articleInfo.icon = file;
            this.setState({
                articleInfo
            })
        });
    };
    showPublishModel = ()=>{
        let {articleInfo} = this.state;
        if(articleInfo.title.length === 0 || articleInfo.title.length > 40){
            return message.warning('标题字数限制为0-40字')
        }
        if(articleInfo.content.length < 20){
            return message.warning('内容字数不得小于20')
        }
        if(myTool.filterWords(articleInfo.title).offWords.length > 0){
            return message.warning('标题包含敏感词汇')
        }
        if(myTool.filterWords(articleInfo.content).offWords.length > 0){
            return message.warning('内容包含敏感词汇')
        }
        this.setState({
            showPublishModel: true,
        })
    };

    handleOk = async e => {
        let {articleInfo} = this.state;
        if(articleInfo.type === 2 && !articleInfo.icon){
            return message.warning('请选择分享软件的logo')
        }
        await this.setState({
            addArticleLoading: true
        });
        if(articleInfo.type === 1){//技术贴
            let {title, content, type, isOpen} = articleInfo;
            let data = await publishArticle({
                title, content, type, isOpen
            });
            if(data.code === 200){
                message.success(data.data);
                this.clearArticleInfo();
            }else {
                message.warning(data.data)
            }
            this.setState({
                addArticleLoading: false
            })
        }else if(articleInfo.type === 2){//软件分享
            let formData = new FormData();
            formData.append('icon', articleInfo.icon);
            formData.append('title', articleInfo.title);
            formData.append('content', articleInfo.content);
            formData.append('type', articleInfo.type);
            formData.append('isOpen', articleInfo.isOpen);
            formData.append('platform', articleInfo.platform);
            let data = await publishApp(formData);
            if(data.code === 200){
                message.success(data.data);
                this.clearArticleInfo();
            }else {
                message.warning(data.data)
            }
            this.setState({
                addArticleLoading: false
            })
        }
    };

    async clearArticleInfo(){
        await this.setState({
            showPublishModel: false,
            articleInfo: {
                title: '',
                content: '',
                type: 1, //1-技术贴 2-软件分享
                icon: '', //软件logo
                isOpen: 1, //是否公开 0-私密 1-公开
                prevIconUrl: ''
            },
        });
        config.delCache('articleInfo')
    }

    infoChange = (e, type) =>{
        let {articleInfo} = this.state;
        articleInfo[type] = e.target.value;
        this.setState({
            articleInfo
        });
    };

    handleCancel = (e, type) => {
        this.setState({
            [type]: false,
        });
    };

    initEditContent = ()=>{
      let articleInfo = config.getCache('articleInfo');
        articleInfo &&
      this.setState({
          articleInfo: JSON.parse(articleInfo)
      })
    };

    async addImg($file) {
        if ($file.type !== 'image/jpeg' && $file.type !== 'image/jpg' && $file.type !== 'image/png') {
            return message.warning('您上传的文件：' + $file.name + '格式不是png/jpg/jpeg格式！请重新选择！');
        }
        if ($file.size > 2097152) {
            return message.warning('您上传的文件：' + $file.name + '大小超过2M！请重新选择！');
        }
        const formData = new FormData();
        formData.append('file', $file);
        const res = await uploadFile(formData);
        if (res.code === 200) {
            this.$vm.current.$img2Url($file.name, res.result.url);
        } else {
            message.warning('上传失败')
        }
    }
    onSave = async v =>{
        let {articleInfo} = this.state;
        Edit.timer && clearTimeout(Edit.timer);
        this.saveToLocal(articleInfo);
        message.success('成功保存至本地')
    };
    saveToLocal = (articleInfo)=>{
        config.setCache('articleInfo', JSON.stringify(articleInfo));
        this.setState({
            tipText: '已保存至本地'
        })
    };
    inputChange = e =>{
        let {articleInfo} = this.state;
        articleInfo.title = trim(e.target.value);
        this.setState({
            articleInfo,
            tipText: '编辑中'
        });
        Edit.timer && clearTimeout(Edit.timer);
        Edit.timer = setTimeout( () =>{
            this.saveToLocal(articleInfo);
        }, 1000);
    };
    changeContent = async (value)=>{
        let {articleInfo} = this.state;
        articleInfo.content = value;
        await this.setState({
            articleInfo,
            tipText: '编辑中'
        });
        Edit.timer && clearTimeout(Edit.timer);
        Edit.timer = setTimeout( () =>{
            this.saveToLocal(articleInfo);
        }, 1000);
    }
}


export default Edit;
