import ajax from "./ajax";
const ALI_URL = '/api/ali';
const ADMIN_URL = '/api/admin';
const MSG_URL = '/api/msg';
const ROLE_URL = '/api/role';
const DEPARTMENT_URL = '/api/department';
const ROOM_URL = '/api/room';
const PROJECT_URL = '/api/project';
const COMMON_URL = '/api/common';
const ARTICLE_URL = '/api/article';

//获取文章
export const getArticle = data => ajax(ARTICLE_URL+'/getArticle', data);
//获取文章信息
export const getArticleInfo = data => ajax(ARTICLE_URL+'/getArticleInfo', data);
//发布技术文
export const publishArticle = data => ajax(ARTICLE_URL+'/publishArticle', data, 'post');
//收藏文章
export const collectArticle = data => ajax(ARTICLE_URL+'/collectArticle', data, 'post');
//评论文章
export const commentArticle = data => ajax(ARTICLE_URL+'/commentArticle', data, 'post');
//删除评论
export const delComment = data => ajax(ARTICLE_URL+'/delComment', data, 'post');
//评分文章
export const gradeArticle = data => ajax(ARTICLE_URL+'/gradeArticle', data, 'post');
//发布分享软件
export const publishApp = data => ajax(ARTICLE_URL+'/publishApp', data, 'post', 'file');

//上传文件
export const uploadFile = data => ajax(COMMON_URL + '/uploadFile', data, 'post', 'file');
//修改头像或背景图片
export const reviseImg = (data)=> ajax(ADMIN_URL+ '/reviseImg', data, 'post', 'file');
//修改信息
export const reviseInfo = (data)=> ajax(ADMIN_URL+ '/reviseInfo', data, 'post', 'json');
//技术人员登录
export const loginAdmin = (data)=> ajax(ADMIN_URL+ '/login', data, 'post');
//添加技术人员
export const addAdmin = (data)=> ajax(ADMIN_URL+ '/addAdmin', data, 'post');
//更新token
export const updateToken = (data)=> ajax(ADMIN_URL+ '/updateToken', data, 'post');
//获取技术人员信息
export const getAdminInfo = ()=> ajax(ADMIN_URL+ '/getAdminInfo');
//获取技术人员列表
export const getAdminList = (data)=> ajax(ADMIN_URL+ '/getAdminList', data);
//获取所有技术人员列表
export const getAllAdminList = (data)=> ajax(ADMIN_URL+ '/getAllAdminList', data);
//冻结、删除技术人员
export const freezeAdmin = (data)=> ajax(ADMIN_URL+'/freezeAdmin', data, 'post');
//更换岗位
export const updateJob = (data)=> ajax(ADMIN_URL+'/updateJob', data, 'post');
//获取部门职位
export const getAllDepartmentAndJob = ()=> ajax(DEPARTMENT_URL + '/getAllDepartmentAndJob');
//获取级别列表
export const getAllRoleList = ()=> ajax(ROLE_URL+'/getAllRoleList');
//系统信息
export const getSystemInfo = ()=> ajax(ALI_URL+ '/systemInfo');
export const getCpuData = (data)=> ajax(ALI_URL+ '/cpuData', data);

//创建聊天室
export const addRoom = (data)=> ajax(ROOM_URL + '/addRoom', data, 'post', 'file');
//加入聊天室
export const joinChatRoom = (data)=> ajax(ROOM_URL + '/joinChatRoom', data, 'post');
//获取所有的聊天室
export const getAllChatRooms = ()=> ajax(ROOM_URL + '/getAllChatRooms');
//获取加入的聊天室及未读消息个数
export const getJoinRoomAndNoReadMsgCount = ()=> ajax(ROOM_URL + '/getJoinRoomAndNoReadMsgCount');
//批量标记已读消息
export const flagReadMoreMsg = (data)=> ajax(MSG_URL+ '/flagReadMoreMsg', data, 'post');
//保存消息到数据库
export const insertChat = (data)=> ajax(MSG_URL+ '/addChat', data, 'post');

//新增作品
export const addProject = data => ajax(PROJECT_URL + '/addProject', data, 'post');
//删除作品
export const delProject = data => ajax(PROJECT_URL + '/delProject', data, 'post');
//获取作品列表
export const getProjectList = () => ajax(PROJECT_URL + '/getProjectList');

