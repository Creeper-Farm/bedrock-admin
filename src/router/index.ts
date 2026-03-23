import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'
import {useUserStore} from "@/store/user.ts";

// 定义路由记录
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Layout',
        component: () => import('@/layout/MainLayout.vue'), // 稍后创建这个布局组件
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/dashboard/index.vue'),
                meta: {title: '控制台'}
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/index.vue'),
        meta: {title: '登录'}
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