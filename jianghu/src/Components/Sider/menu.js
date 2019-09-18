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
                name: '级别管理',
                icon: '',
                key: '/layout/power/role_manage',
            },
            {
                name: '技术人员管理',
                icon: '',
                key: '/layout/power/admin_manage',
            }
        ]
    },
    {
        name: '写文章',
        icon: 'form',
        key: '/layout/edit'
    },
    {
        name: '技术社区',
        icon: 'cluster',
        key: '/layout/technology'
    },
    {
        name: '软件社区',
        icon: 'appstore',
        key: '/layout/software'
    },
    {
        name: '作品集',
        icon: 'bulb',
        key: '/layout/project'
    },
    {
        name: '提议区',
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