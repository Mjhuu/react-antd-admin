import ajax from "./ajax";
const ALI_URL = '/api/ali';
const ADMIN_URL = '/api/admin';
const MSG_URL = '/api/msg';

//管理员登录
export const loginAdmin = (data)=> ajax(ADMIN_URL+ '/login', data, 'post');
//更新token
export const updateToken = (data)=> ajax(ADMIN_URL+ '/updateToken', data, 'post');
//获取管理员信息
export const getAdminInfo = ()=> ajax(ADMIN_URL+ '/getAdminInfo');
//获取管理员列表
export const getAdminList = (data)=> ajax(ADMIN_URL+ '/getAdminList', data);
//获取所有管理员列表
export const getAllAdminList = ()=> ajax(ADMIN_URL+ '/getAllAdminList');
//冻结管理员
export const freezeAdmin = (data)=> ajax(ADMIN_URL+'/freezeAdmin', data, 'post');
//删除管理员
export const delAdmin = (data)=> ajax(ADMIN_URL+'/delAdmin', data, 'post');
//系统信息
export const getSystemInfo = ()=> ajax(ALI_URL+ '/systemInfo');
export const getCpuData = (data)=> ajax(ALI_URL+ '/cpuData', data);

//获取聊天消息
export const getAllMessages = ()=> ajax(MSG_URL+ '/getAllMessages');
//保存消息到数据库
export const insertChat = (data)=> ajax(MSG_URL+ '/addChat', data, 'post');

