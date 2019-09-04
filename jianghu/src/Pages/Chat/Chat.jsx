import React, {Component} from 'react';
import {message, Avatar} from "antd";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from "moment";
import {replaceImg} from "../../Common/js/FabLabFun";
import {addChat, initChat} from "../../Store/actionCreators";
import headImg from './../../Common/images/headImg.png'
import home from './../../Common/images/home.png'
import {insertChat, getAllAdminList} from "../../Api";
// 引入编辑器组件
import {ContentUtils} from 'braft-utils'
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import './css/index.styl'

const store = connect(
    state => ({
        socket: state.socket,
        chatList: state.chatList,
        adminInfo: state.adminInfo,
        onlineUserList: state.onlineUserList
    }),
    dispatch => bindActionCreators({addChat, initChat}, dispatch)
);

@store
class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 创建一个空的editorState作为初始值
            editorState: BraftEditor.createEditorState(null),
            adminList: []
        };
        this.chatListDom = React.createRef();
    }

    render() {
        let {editorState, adminList} = this.state;
        let {chatList, adminInfo, onlineUserList} = this.props;
        const controls = ['emoji', 'italic', 'text-color', 'separator', 'link', 'separator', 'media'];
        // 禁止上传video、audio
        const media = {
            // uploadFn: this.myUploadFn,
            accepts: {
                image: 'image/png,image/jpeg,image/gif,image/webp,image/apng,image/svg',
                video: false,
                audio: false
            },
            externals: {
                image: 'image/png,image/jpeg,image/gif,image/webp,image/apng,image/svg',
                video: false,
                audio: false,
                embed: false
            }
        };
        const hooks = {
            'toggle-link': ({href, target}) => {
                const pattern = /^((ht|f)tps?):\/\/([\w-]+(\.[\w-]+)*\/?)+(\?([\w\-.,@?^=%&:/~+#]*)+)?$/
                if (pattern.test(href)) {
                    return {href, target}
                }
                message.warning('请输入正确的网址');
                return false
            }
        };
        const lastChat = chatList[chatList.length - 1] || {};
        return (
            <div className="chat-box">
                {/*头部*/}
                <div className="top">
                    <div className="left">
                        <ul>
                            <li className="red"/>
                            <li className="yellow"/>
                            <li className="green"/>
                        </ul>
                    </div>
                    <div className="middle">
                        <span>聊天室1</span>
                    </div>
                </div>
                {/*中间*/}
                <div className="middle">
                    <div className="left">
                        <div className='left-item'>
                            <div><Avatar size='large' src={home} icon="home"/></div>
                            <div className='left-item-text'>
                                <div className='group-name'>
                                    <span>聊天室</span>
                                    <span>{this.handleTime(lastChat.createTime, true).split(' ')[0]}</span>
                                </div>
                                <div className='group-message' style={{display: lastChat.uuid ? 'flex' : 'none'}}>
                                    <div style={{flexFlow: 1, flexShrink: 0}}>{lastChat.username}:&nbsp;</div>
                                    <div className='ellipsis'
                                         dangerouslySetInnerHTML={{__html: replaceImg(lastChat.msg)}}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="main">
                        <div className="content">
                            <div ref={this.chatListDom} className="chat-list">
                                {chatList && chatList.map((item, index) => (
                                    <div key={index} className='chat-item'>
                                        {/* 两条消息记录间隔超过3分钟就显示时间 */}
                                        {(index === 0 || item.createTime - chatList[index - 1].createTime > 3 * 60 * 1000) && (
                                            <div className='time'>{this.handleTime(item.createTime)}</div>
                                        )}
                                        <div
                                            className={`chat-item-info ${adminInfo.admin.uuid === item.uuid ? 'chat-right' : ''}`}>
                                            <div><Avatar src={item.headImg ? item.headImg : headImg} icon="user"/></div>
                                            <div className='chat-main'>
                                                <div className='username'>{item.username}</div>
                                                <div className='chat-content'
                                                     dangerouslySetInnerHTML={{__html: item.msg}}/>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="edit">
                            <BraftEditor
                                draftProps={{
                                    handleKeyCommand: this.handleKeyCommand
                                }}
                                media={media}
                                hooks={hooks}
                                placeholder={'按回车键 "enter" 发送消息'}
                                value={editorState}
                                controls={controls}
                                contentStyle={{height: 'calc(100% - 46px)', fontSize: '1.4rem'}}
                                controlBarStyle={{boxShadow: 'none'}}
                                onChange={this.handleEditorChange}
                            />
                        </div>
                    </div>
                    <div className="right">
                        <div className="title">
                            成员 {onlineUserList.length}/{adminList.length}
                        </div>
                        <div className="admin-list">
                            {
                                adminList.map(admin => (
                                    <div key={admin.uuid} className='user-item'>
                                        <div className={`avatar-box ${admin.online ? '' : 'mask'}`}>
                                            <img style={{width: '100%', height: '100%'}}
                                                 src={admin.headImg ? admin.headImg : headImg} alt="头像"/>
                                            <div/>
                                        </div>
                                        <div className='ellipsis'
                                             style={{flexGrow: 1, margin: '0 3px 0 5px'}}>{admin.username}</div>
                                        <div style={{display: admin.power === 0 ? 'block' : 'none'}}><img
                                            width={18} height={20} src={require('./img/administrator.png')} alt=""/>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.chatList.length !== this.props.chatList.length){
            this.chatListDom.current.scrollTop = this.chatListDom.current.scrollHeight;
        }
        if (this.props.onlineUserList !== prevProps.onlineUserList) {
            this.handleAdminList()
        }
    }

    componentDidMount() {
        this.chatListDom.current.scrollTop = this.chatListDom.current.scrollHeight;
        this.props.initChat();
        // 获取所有管理员列表
        this.getAllAdminList();
        // 2. 监听
        this.props.socket && this.props.socket.on('msg', async (data) => {
            data = JSON.parse(data);
            switch (data.type) {
                case 1://收到的是上线用户
                    // console.log(data);
                    break;
                case 2://收到的是消息
                    if (this.chatListDom.current) {
                        await this.props.addChat({
                            chatInfo: data.result
                        });
                    }
                    break;
                default:
                    break;
            }
        });
    }
    //处理管理员列表
    handleAdminList(){
        let {adminList} = this.state;
        let {onlineUserList} = this.props;
        let list1 = [];
        let list2 = [];
        let list3 = [];
        for(let admin of adminList){
            const isHave = onlineUserList.find(i => i.uuid === admin.uuid);
            if (admin.power === 0) {
                admin.online = true;
                list1.push(admin)
            } else if (!!isHave) {
                admin.online = true;
                list2.push(admin)
            } else {
                admin.online = false;
                list3.push(admin)
            }
        }
        this.setState({
            adminList: [...list1, ...list2, ...list3]
        })
    }
    //获取所有管理员列表
    async getAllAdminList(){
        let data = await getAllAdminList();
        if(data.code === 200){
            let adminList = [];
            data.result.adminList.forEach(value => {
                adminList.push({
                    uuid: value.adminInfo.uuid,
                    username: value.adminInfo.username,
                    headImg: value.adminInfo.headImg,
                    power: value.roleInfo.power,
                    online: false
                })
            });
            await this.setState({
                adminList
            });
            this.handleAdminList();
        }
    }

    //处理时间
    handleTime = (time, small) => {
        if (!time) {
            return ''
        }
        const HHmm = moment(time).format('HH:mm');
        //不在同一年，就算时间差一秒都要显示完整时间
        if (moment().format('YYYY') !== moment(time).format('YYYY')) {
            return moment(time).format('YYYY-MM-DD HH:mm:ss')
        }
        //判断时间是否在同一天
        if (moment().format('YYYY-MM-DD') === moment(time).format('YYYY-MM-DD')) {
            return HHmm
        }
        //判断时间是否是昨天。不在同一天又相差不超过24小时就是昨天
        if (moment().diff(time, 'days') === 0) {
            return `昨天 ${HHmm}`
        }
        //判断时间是否相隔一周
        if (moment().diff(time, 'days') < 7) {
            const weeks = ['日', '一', '二', '三', '四', '五', '六']
            return `星期${weeks[moment(time).weekday()]} ${HHmm}`
        }
        if (small) {
            return moment(time).format('MM-DD HH:mm')
        } else {
            return moment(time).format('M月D日 HH:mm')
        }

    };
    handleEditorChange = (editorState) => {
        this.setState({editorState})
    };
    //定制键盘命令
    handleKeyCommand = async (command) => {
        //如果是回车命名就发送信息
        if (command === 'split-block') {
            const editorState = this.state.editorState;
            const htmlContent = editorState.toHTML();
            if (editorState.toText().length > 0) {
                this.props.socket && this.props.socket.emit('msg', JSON.stringify({
                    msg: htmlContent
                }));
                let data = await insertChat({
                    msg: htmlContent
                });
                console.log(data);
                this.setState({
                    editorState: ContentUtils.clear(editorState)
                });
            } else {
                message.warning('不能发送空白内容哟')
            }
            return 'handled';
        }
        return 'not-handled';
    };
}

export default Chat;
