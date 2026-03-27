import {createRouter, createWebHistory} from 'vue-router'
import {useUserStore} from "@/store/user.ts";

// 定义路由记录
export const routes = [
    {
        path: '/',
        component: () => import('@/layout/MainLayout.vue'), // 必须包裹在这里
        redirect: '/dashboard',
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: () => import('@/views/dashboard/index.vue'),
                meta: {title: '控制台', icon: 'DashboardOutlined'}
            },
            {
                path: '/system',
                name: 'System',
                meta: {title: '系统管理', icon: 'SettingOutlined'},
                children: [
                    {
                        path: '/system/user',
                        name: 'UserManage',
                        component: () => import('@/views/system/user/index.vue'),
                        meta: {title: '用户管理'}
                    },
                    {
                        path: '/system/role',
                        name: 'RoleManage',
                        component: () => import('@/views/system/role/index.vue'),
                        meta: {title: '角色管理'}
                    }
                ]
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/index.vue'),
        meta: {hidden: true} // 登录页不显示在菜单里
    }
]

// 创建路由器实例
const router = createRouter({
    history: createWebHistory(), // 使用 HTML5 模式
    routes
})

// 路由守卫（可选：用于处理页面标题或权限）
router.beforeEach((to, _from, next) => {
    document.title = (to.meta.title as string) || 'Bedrock Admin'

    const userStore = useUserStore()
    const isLogin = !!userStore.accessToken

    if (to.name !== 'Login' && !isLogin) {
        next({name: 'Login', query: {redirect: to.fullPath}})
    } else if (to.name === 'Login' && isLogin) {
        next({name: 'Dashboard'})
    } else {
        next()
    }
})

export default router