const common = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/view/login/index'),
    },
    {
        path: '/',
        component: () => import('@/view/index'),
        children: [
            {
                path: '',
                name: 'welcome',
                component: () => import('@/view/welcome'),
            },
            {
                path: 'student',
                name: 'student',
                component: () => import('@/view/checkStudent'),
            },
            {
                path: 'subject',
                name: 'subject',
                component: () => import('@/view/subject'),
            },
            {
                path: 'teacher',
                name: 'teacher',
                component: () => import('@/view/teacher'),
            },
            {
                path: 'other',
                name: 'other-manage',
                component: () => import('@/view/othermanage'),
            },
        ],
    },
];

export const routes = [ ...common ];