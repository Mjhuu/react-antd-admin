export const menu = [
    {
        name: '数据分析',
        icon: 'ant-design',
        key: '/layout/data_analyse'
    },
    {
        name: '权限管理',
        icon: 'lock',
        key: '/layout/power',
        children: [
            {
                name: '角色管理',
                icon: '',
                key: '/layout/power/role_manage',
            },
            {
                name: '管理员管理',
                icon: '',
                key: '/layout/power/admin_manage',
            }
        ]
    },
    {
        name: '用户管理',
        icon: 'user',
        key: '/layout/user_manage'
    },
    {
        name: '作品集',
        icon: 'bulb',
        key: '/layout/project'
    },
    {
        name: '留言板',
        icon: 'message',
        key: '/layout/message'
    },
    {
        name: '聊天室',
        icon: 'qq',
        key: '/layout/chat'
    },
    {
        name: '关于',
        icon: 'info-circle',
        key: '/layout/about'
    }
];