import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo } from '@/types/user.ts'

export const useUserStore = defineStore('user', () => {
    // --- 状态 (State) ---
    const accessToken = ref<string>('')
    const refreshToken = ref<string>('')
    const userInfo = ref<UserInfo | null>(null) // 初始为 null

    // --- 计算属性 (Getters) ---
    // 判断是否已登录
    const isLoggedIn = computed(() => !!accessToken.value)

    // --- 动作 (Actions) ---

    /**
     * 设置 Token
     */
    const setToken = (newAccessToken: string, newRefreshToken: string) => {
        accessToken.value = newAccessToken
        refreshToken.value = newRefreshToken
    }

    /**
     * 设置用户信息
     */
    const setUserInfo = (data: UserInfo) => {
        userInfo.value = data
    }

    /**
     * 清理所有状态（退出登录时调用）
     */
    const clearToken = () => {
        accessToken.value = ''
        refreshToken.value = ''
        userInfo.value = null
    }

    return {
        accessToken,
        refreshToken,
        userInfo,
        isLoggedIn,
        setToken,
        setUserInfo,
        clearToken
    }
}, {
    // 开启持久化：默认存入 localStorage
    persist: true
})