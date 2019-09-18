import React, {Component} from 'react';
import {
    message,
    Avatar,
    Badge,
    Tooltip,
    Button,
    Modal,
    Input,
    Empty,
    Radio,
    Drawer,
    Skeleton,
    notification
} from "antd";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import moment from "moment";
import {replaceImg} from "../../Common/js/FabLabFun";
import headImg from './../../Common/images/headImg.png'
import home from './../../Common/images/home.png'
import {
    insertChat,
    getAllAdminList,
    addRoom,
    flagReadMoreMsg,
    getAllChatRooms,
    joinChatRoom,
    updateJob,
    uploadFile
} from "../../Api";
import {clearMsgCount, addChatRoom} from "../../Store/actionCreators";
import {Scrollbars} from 'react-custom-scrollbars';
import MyTool from './../../Common/js/FabLabTool'
import {check_name} from "../../Common/js/FabLabFun";
// 引入编辑器组件
import {ContentUtils} from 'braft-utils'
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import './css/index.styl'

const { confirm } = Modal;
const myTool = new MyTool();

const store = connect(
    state => ({
        socket: state.socket,
        adminInfo: state.adminInfo,
        onlineUsers: state.onlineUsers,
        joinChatRoomList: state.joinChatRoomList,
        color: state.color
    }),
    dispatch => bindActionCreators({clearMsgCount, addChatRoom}, dispatch)
);

@store
class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 创建一个空的editorState作为初始值
            editorState: BraftEditor.createEditorState(null),
            adminList: [],
            showAddRoomModel: false, //创建聊天室model
            addRoomLoading: false,
            showAllRoomModel: false, //所有聊天室model
            addRoomInfo: {
                roomName: '',
                type: 1,
                roomImg: '',
                prevImgUrl: '',
                allowJoin: 1
            },
            allChatRoomList: [], //所有的聊天室
            reqAllChatRoomLoading: false,
            selectChatRoomInfo: {
                index: 0,
                id: 5
            }
        };
        this.chatListDom = React.createRef();
    }

    render() {
        let {editorState, adminList, showAddRoomModel, showAllRoomModel, addRoomLoading, addRoomInfo, selectChatRoomInfo, reqAllChatRoomLoading, allChatRoomList} = this.state;
        let {adminInfo, onlineUsers, joinChatRoomList,color} = this.props;
        let chatList = joinChatRoomList.length !== 0 ? joinChatRoomList[selectChatRoomInfo.index].allMsgList : [];
        let currentOnlineUsersList = JSON.stringify(onlineUsers) !== '{}' ? onlineUsers[selectChatRoomInfo.id] : [];
        const controls = ['emoji', 'italic', 'text-color', 'separator', 'link', 'separator', 'media'];
        // 禁止上传video、audio
        const media = {
            uploadFn: this.uploadFile,
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
            <div className="chat-outbox">
                {/*创建聊天室窗口*/}
                <Modal
                    title={`创建聊天室`}
                    visible={showAddRoomModel}
                    onCancel={e => this.handleCancel(e, 'showAddRoomModel')}
                    footer={[
                        <Button key="back" onClick={e => this.handleCancel(e, 'showAddRoomModel')}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary" loading={addRoomLoading} onClick={this.handleAddRoomOk}>
                            创建
                        </Button>
                    ]}
                >
                    <ul className="add-room-box">
                        <li>
                            <div className="left">
                                聊天室头像：
                            </div>
                            <div className="right">
                                <div className="roomImg">
                                    {
                                        addRoomInfo.prevImgUrl ? <img alt="预览头像" src={addRoomInfo.prevImgUrl}/> :
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
                                <input type="file" onChange={this.selectRoomImg}/>
                            </div>
                        </li>
                        <li>
                            <div className="left">
                                聊天室名称：
                            </div>
                            <div className="right">
                                <Input onChange={(e) => this.inputChange(e, 'roomName')} value={addRoomInfo.roomName}
                                       placeholder="请输入聊天室名称"/>
                            </div>
                        </li>
                        <li>
                            <div className="left">
                                跨部门加入：
                            </div>
                            <div className="right">
                                <Radio.Group onChange={(e) => this.inputChange(e, 'allowJoin')} value={addRoomInfo.allowJoin} buttonStyle="solid">
                                    <Radio.Button value={1}>允许</Radio.Button>
                                    <Radio.Button value={0}>不允许</Radio.Button>
                                </Radio.Group>
                            </div>
                        </li>
                        <li>
                            <div className="left">
                                聊天室类型：
                            </div>
                            <div className="right">
                                <Radio.Group value={addRoomInfo.type} buttonStyle="solid">
                                    <Radio.Button value={1}>群聊</Radio.Button>
                                </Radio.Group>
                            </div>
                        </li>
                    </ul>
                </Modal>
                {/*查看全部聊天室窗口*/}
                <Drawer
                    title="全部聊天室"
                    placement={'bottom'}
                    closable={false}
                    onClose={e => this.handleCancel(e, 'showAllRoomModel')}
                    visible={showAllRoomModel}
                    height="500"
                >
                    {
                        reqAllChatRoomLoading ? <Skeleton active /> : <section className="all-chat-room-box">
                            {
                                allChatRoomList.length === 0 ?
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无聊天室" /> : (
                                        <ul>
                                            {
                                                allChatRoomList.map((chatRoom, index) => (
                                                    <li key={chatRoom.chatRoomInfo.id}>
                                                        <div className="top">
                                                            <div className="left">
                                                                <img src={chatRoom.chatRoomInfo.roomImg ? chatRoom.chatRoomInfo.roomImg : home} alt={chatRoom.chatRoomInfo.roomName}/>
                                                            </div>
                                                            <div className="right">
                                                                <h2>{chatRoom.chatRoomInfo.roomName}</h2>
                                                                <span style={{background: color[`id${chatRoom.departmentInfo.id}`]}}>{chatRoom.departmentInfo.departmentName}</span>
                                                                <p>
                                                                    <svg t="1567936942641" className="icon"
                                                                         viewBox="0 0 1024 1024" version="1.1"
                                                                         xmlns="http://www.w3.org/2000/svg" p-id="2633"
                                                                         width="200" height="200">
                                                                        <path
                                                                            d="M525.6 561.2l-0.4-1c80-4.3 149.7-46.9 191.2-109.9 62-13.1 108.5-68 108.5-133.9s-46.5-120.8-108.5-133.9C672.7 116 597.5 72 512 72s-160.7 44-204.4 110.5c-62 13.1-108.5 68-108.5 133.9s46.5 120.8 108.5 133.9c43.7 66.5 118.8 110.5 204.4 110.5 2.1 0 4.1-0.3 6.2-0.3l-0.2 0.5c-2 0-4-0.2-6.1-0.2-215.9 0.1-391 175.2-391 391.2H160c0-191.5 153-347.2 343.4-351.8l-89.3 238.9 107.7 103.2 107.7-103.2-88.9-237.9C721.6 615.8 864 767.2 864 952h39.1c0-211.5-167.8-383.6-377.5-390.8z m216.7-326.1c26.2 17.5 43.5 47.4 43.5 81.3s-17.3 63.8-43.5 81.3c9-25.5 14.2-52.8 14.2-81.3-0.1-28.5-5.2-55.8-14.2-81.3zM688 218.7c1.6 0 3.1 0.2 4.7 0.2 15.7 29 24.6 62.2 24.6 97.5s-8.9 68.5-24.6 97.5c-1.6 0.1-3.1 0.2-4.7 0.2-54 0-97.8-43.8-97.8-97.8 0-53.9 43.8-97.6 97.8-97.6zM512 111.1c61.6 0 116.8 27.3 154.4 70.3-56 8.9-100.6 51.6-112.2 106.6-11.1-5.2-26.5-10.6-42-10.6-15.6 0-31.1 5.5-42.4 10.7-11.6-55-56.3-97.7-112.2-106.6 37.6-43.1 92.8-70.4 154.4-70.4zM281.7 397.7c-26.2-17.5-43.5-47.4-43.5-81.3s17.3-63.8 43.5-81.3c-9 25.5-14.1 52.8-14.1 81.3 0 28.6 5.1 55.9 14.1 81.3z m54.3 16.5c-1.6 0-3.1-0.2-4.7-0.2-15.7-29-24.6-62.2-24.6-97.5s8.9-68.5 24.6-97.5c1.6-0.1 3.1-0.2 4.7-0.2 54 0 97.8 43.8 97.8 97.8 0 53.8-43.8 97.6-97.8 97.6z m176 107.6c-61.6 0-116.8-27.3-154.4-70.3 62.3-9.9 110.5-61.6 114.9-125.5 11-4.8 25.3-9.5 39.7-9.5 14.3 0 28.5 4.7 39.4 9.4 4.4 63.9 52.6 115.7 114.9 125.6-37.7 43-92.9 70.3-154.5 70.3z m78.2 303.1l-68.4 68.4-68.4-58.7 68.4-176 68.4 166.3z"
                                                                            p-id="2634" fill="#8a8a8a"></path>
                                                                    </svg>：{chatRoom.adminInfo.username}</p>
                                                                <p>
                                                                    <svg t="1567936708935" className="icon"
                                                                         viewBox="0 0 1024 1024" version="1.1"
                                                                         xmlns="http://www.w3.org/2000/svg" p-id="1461"
                                                                         width="200" height="200">
                                                                        <path
                                                                            d="M841.6 576c60.8-32 99.2-92.8 99.2-163.2 0-102.4-83.2-185.6-185.6-185.6-102.4 0-185.6 83.2-185.6 185.6 0 70.4 41.6 134.4 99.2 163.2-32 12.8-64 28.8-89.6 51.2-3.2-3.2-6.4-9.6-9.6-12.8-38.4-44.8-89.6-80-147.2-96 70.4-35.2 118.4-108.8 118.4-192a214.4 214.4 0 0 0-428.8 0c0 83.2 48 156.8 118.4 192-131.2 41.6-224 163.2-224 307.2v3.2h38.4v-3.2c0-156.8 128-281.6 281.6-281.6 86.4 0 166.4 38.4 217.6 102.4 9.6 9.6 16 22.4 22.4 35.2 25.6 41.6 41.6 92.8 41.6 147.2v3.2h38.4v-3.2c0-60.8-16-115.2-44.8-163.2 41.6-38.4 92.8-60.8 153.6-60.8 124.8 0 224 99.2 224 224v3.2h38.4v-3.2c0-118.4-73.6-217.6-176-252.8zM150.4 329.6c0-96 80-176 176-176s176 80 176 176-80 176-176 176c-96-3.2-176-80-176-176zM608 412.8c0-80 64-147.2 147.2-147.2 80 0 147.2 64 147.2 147.2 0 80-64 147.2-147.2 147.2-80 0-147.2-67.2-147.2-147.2z"
                                                                            fill="#666666" p-id="1462"></path>
                                                                    </svg>：{chatRoom.joinCount}人</p>
                                                            </div>
                                                        </div>
                                                        <div className="bottom">
                                                            {
                                                                !chatRoom.isJoin ? <Button onClick={e => this
                                                                    .joinChatRoom(e, chatRoom, index)} size={"small"} icon='plus'>
                                                                    加入
                                                                </Button> : <Button size={"small"} disabled>
                                                                    已加入
                                                                </Button>
                                                            }
                                                        </div>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    )
                            }
                        </section>
                    }
                </Drawer>
                <div className="top">
                    <div className="add-room-box">
                        <Button onClick={this.showAddRoomModel} icon='plus'>创建聊天室</Button>
                        <Button onClick={this.showAllRoomModel} style={{marginLeft: '2rem'}} icon='search'>全部聊天室</Button>
                    </div>
                    <Scrollbars
                        style={{width: '100%', height: '13rem'}}
                    >
                        <ul className="room-list">
                            {
                                joinChatRoomList.map((joinChat, index) =>(
                                    <li
                                        className={selectChatRoomInfo.index === index ? 'select' : ''}
                                        key={joinChat.chatRoomInfo.id}
                                        onClick={ e => this.selectChatRoom(e, joinChat.chatRoomInfo, index)}
                                    >
                                        <Tooltip title={joinChat.chatRoomInfo.roomName}>
                                            <div className="room-box">
                                                <Badge count={joinChat.noReadMsgCount} style={{backgroundColor: selectChatRoomInfo.index === index ? '#52c41a' : '#ff2916'}}/>
                                                <img src={joinChat.chatRoomInfo.roomImg ? joinChat.chatRoomInfo.roomImg : home } alt={joinChat.chatRoomInfo.roomName}/>
                                            </div>
                                        </Tooltip>
                                    </li>
                                ))
                            }
                        </ul>
                    </Scrollbars>
                </div>
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
                            <span>{selectChatRoomInfo.roomName ? selectChatRoomInfo.roomName : '技术总群'}</span>
                        </div>
                    </div>
                    {/*中间*/}
                    <div className="middle">
                        <div className="left">
                            <div className='left-item'>
                                <div><Avatar size='large' src={selectChatRoomInfo.roomImg ? selectChatRoomInfo.roomImg : home} icon="home"/></div>
                                <div className='left-item-text'>
                                    <div className='group-name'>
                                        <span>{selectChatRoomInfo.roomName ? selectChatRoomInfo.roomName : '技术总群'}</span>
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
                                    {chatList.length === 0 ? <Empty description={false}
                                                                    style={{marginTop: '9rem'}}/> : chatList.map((item, index) => (
                                        <div key={index} className='chat-item'>
                                            {/* 两条消息记录间隔超过3分钟就显示时间 */}
                                            {(index === 0 || item.createTime - chatList[index - 1].createTime > 3 * 60 * 1000) && (
                                                <div className='time'>{this.handleTime(item.createTime)}</div>
                                            )}
                                            <div
                                                className={`chat-item-info ${adminInfo.admin.uuid === item.uuid ? 'chat-right' : ''}`}>
                                                <div><Avatar src={item.headImg ? item.headImg : headImg} icon="user"/>
                                                </div>
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
                                成员 {Array.isArray(currentOnlineUsersList) && currentOnlineUsersList.length}/{adminList.length}
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
                                            <div style={{display: admin.adminType === 0 ? 'block' : 'none'}}><img
                                                width={18} height={20} src={require('./img/administrator.png')} alt=""/>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(JSON.stringify(prevProps.joinChatRoomList) !== JSON.stringify(this.props.joinChatRoomList)){
            this.chatListDom.current.scrollTop = this.chatListDom.current.scrollHeight;
        }
        if(JSON.stringify(prevProps.onlineUsers) !== JSON.stringify(this.props.onlineUsers)) {
            this.handleAdminList()
        }
        if (this.props.joinChatRoomList !== prevProps.joinChatRoomList) {
            this.initSelectChatRoomInfo();
        }
    }

    componentDidMount() {
        this.chatListDom.current.scrollTop = this.chatListDom.current.scrollHeight;
        // 获取所有技术人员列表
        this.getAllAdminList(5);
    }
    //上传图片
    uploadFile = async (param) => {
        const formData = new FormData();
        formData.append('file', param.file);
        const res = await uploadFile(formData);
        if (res.code === 200) {
            param.success(res.result)
        } else {
            param.error({
                msg: '上传错误'
            })
        }
    };
    /**
     * 加入房间
     * @returns {Promise<MessageType>}
     * @param e
     * @param chatRoom
     * @param index
     */
    joinChatRoom = async (e, chatRoom, index) =>{
        let currentAdminDepartmentId = this.props.adminInfo.departmentInfo.id;
        if(chatRoom.chatRoomInfo.allowJoin === 0){
            return message.warning('该聊天室不允许跨部门加入');
        }
        // console.log(chatRoom.departmentInfo.id);
        // console.log(currentAdminDepartmentId);
        confirm({
            title: '加入聊天室?',
            content: `你确定加入 "${chatRoom.chatRoomInfo.roomName}" 聊天室吗？`,
            style: {
                top: '200px'
            },
            onOk: () =>{
                return new Promise(async (resolve, reject) => {
                    let {allChatRoomList} = this.state;
                    let data = await joinChatRoom({
                        chatRoomId: chatRoom.chatRoomInfo.id
                    });
                    if(data.code === 200){
                        //将状态改为已加入
                        allChatRoomList[index].isJoin = true;
                        await this.setState({
                            allChatRoomList
                        });
                        let allMsgList = [];
                        data.result.allMsgList.forEach(v=>{
                            allMsgList.push({
                                uuid: v.adminInfo.adminInfo.uuid,
                                username: v.adminInfo.adminInfo.username,
                                headImg: v.adminInfo.adminInfo.headImg,
                                power: v.adminInfo.roleInfo.power,
                                createTime: new Date(v.msgInfo.createTime).getTime(),
                                msg: v.msgInfo.msg,
                            })
                        });
                        data.result.allMsgList = allMsgList;
                        /*将新增的房间放入redux*/
                        this.props.addChatRoom({
                            newChatRoom: data.result
                        });
                        // 派发给服务器 此房间有新人加入
                        this.props.socket && this.props.socket.emit('joinChatRoom', JSON.stringify({
                            chatRoomId: data.result.chatRoomInfo.id
                        }));
                        notification.info({
                            message: '系统消息：加入聊天室',
                            description: `你已经成功加入 "${chatRoom.chatRoomInfo.roomName}" 聊天室`,
                            duration: 3,
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
     * 选择聊天室
     * @param e
     * @param chatRoomInfo
     * @param index
     * @returns {Promise<void>}
     */
    selectChatRoom = async (e, chatRoomInfo, index)=>{
        await this.setState({
            selectChatRoomInfo: {
                index,
                ...chatRoomInfo
            }
        });
        // 将当前聊天室所有未读消息标记为已读，将未读消息清零
        let data = await flagReadMoreMsg({
            chatRoomId: chatRoomInfo.id
        });
        console.log(data);
        this.props.clearMsgCount({
           index
        });
        this.getAllAdminList(this.state.selectChatRoomInfo.id);
        this.chatListDom.current.scrollTop = this.chatListDom.current.scrollHeight;
    };
    // 将技术总群信息放置选择的聊天室上
    initSelectChatRoomInfo(){
        let {joinChatRoomList} = this.props;
        let index = this.state.selectChatRoomInfo.index;
        joinChatRoomList.length !== 0 &&
        this.setState({
            selectChatRoomInfo: {
                index,
                ...joinChatRoomList[index].chatRoomInfo
            }
        })
    }
    selectRoomImg = e => {
        let {addRoomInfo} = this.state;
        let file = e.target.files[0];
        if (file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png') {
            return message.warning('您上传的文件：' + file.name + '格式不是png/jpg/jpeg格式！请重新选择！');
        }
        if (file.size > 2097152) {
            return message.warning('您上传的文件：' + file.name + '大小超过2M！请重新选择！');
        }
        myTool.srcToBase64Url(file, url => {
            addRoomInfo.prevImgUrl = url;
            addRoomInfo.roomImg = file;
            this.setState({
                addRoomInfo
            })
        });
    };

    showAllRoomModel = async () => {
        await this.setState({
            reqAllChatRoomLoading: true,
            showAllRoomModel: true
        });
        let data = await getAllChatRooms();
        await this.setState({
            reqAllChatRoomLoading: false
        });
        if(data.code === 200){
            this.setState({
                allChatRoomList: data.result.allChatRoomList
            });
        }else {
            message.warning(data.data)
        }
    };

    showAddRoomModel = () => {
        if (this.props.adminInfo.roleInfo.power > 2) {
            return message.warning('抱歉，你的职称须达到P5及以上才可以创建！')
        }
        this.setState({
            showAddRoomModel: true
        })
    };
    inputChange = (e, type) => {
        let {addRoomInfo} = this.state;
        let value = e.target.value;
        addRoomInfo[type] = value;
        this.setState({
            addRoomInfo
        });
    };
    handleAddRoomOk = async e => {
        let {roomName, roomImg, type, allowJoin} = this.state.addRoomInfo;
        if (!roomImg) {
            return message.warning('请选择聊天室头像')
        }
        if (!check_name(roomName)) {
            return message.warning('聊天室名称格式错误')
        }
        if (myTool.filterWords(roomName).offWords.length > 0) {
            return message.warning('聊天室名称包含敏感词汇')
        }
        let formData = new FormData();
        formData.append('roomName', roomName);
        formData.append('roomImg', roomImg);
        formData.append('type', type);
        formData.append('allowJoin', allowJoin);
        this.setState({
            addRoomLoading: true
        });
        let data = await addRoom(formData);
        if (data.code === 200) {
            message.success(data.data);
            /*将新增的房间放入redux*/
            this.props.addChatRoom({
               newChatRoom: data.result
            });
            // 派发给服务器 有新房间创建
            this.props.socket && this.props.socket.emit('addChatRoom', JSON.stringify({
                chatRoomId: data.result.chatRoomInfo.id
            }));
            this.setState({
                showAddRoomModel: false,
                addRoomLoading: false,
                addRoomInfo: {
                    roomName: '',
                    type: 1,
                    roomImg: '',
                    prevImgUrl: '',
                    allowJoin: 1
                }
            })
        } else {
            message.warning(data.data)
        }
    };
    /*点击模板取消*/
    handleCancel = (e, key) => {
        this.setState({
            [key]: false,
        });
    };

    //处理技术人员列表
    handleAdminList() {
        let {adminList, selectChatRoomInfo} = this.state;
        let {onlineUsers} = this.props;
        let list1 = [];
        let list2 = [];
        let list3 = [];
        if(JSON.stringify(onlineUsers) !== '{}'){
            for (let admin of adminList) {
                const isHave = onlineUsers[selectChatRoomInfo.id].find(i => i.uuid === admin.uuid);
                if (admin.adminType === 0) {
                    admin.online = !!isHave;
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
    }

    //获取所有技术人员列表
    async getAllAdminList(chatRoomId) {
        let data = await getAllAdminList({
            chatRoomId
        });
        if (data.code === 200) {
            let adminList = [];
            data.result.adminList.forEach(value => {
                adminList.push({
                    uuid: value.adminInfo.uuid,
                    username: value.adminInfo.username,
                    headImg: value.adminInfo.headImg,
                    power: value.roleInfo.power,
                    online: false,
                    adminType: value.adminType
                });
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
            const textContent = editorState.toText();
            if (myTool.filterWords(textContent).offWords.length > 0) {
                return message.warning('聊天信息包含敏感词汇')
            }
            await this.setState({
                editorState: ContentUtils.clear(editorState)
            });
            if (editorState.toText().length > 0) {
                this.props.socket && this.props.socket.emit('msg', JSON.stringify({
                    msg: htmlContent,
                    chatRoomId: this.state.selectChatRoomInfo.id
                }));
                let data = await insertChat({
                    msg: htmlContent,
                    chatRoomId: this.state.selectChatRoomInfo.id
                });
                console.log(data);
            } else {
                message.warning('不能发送空白内容哟');
            }
            return 'handled';
        }
        return 'not-handled';
    };
}

export default Chat;
