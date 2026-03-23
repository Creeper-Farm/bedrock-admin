import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useUserStore = defineStore('user', () => {
    // 状态 (State)
    const accessToken = ref<string>('')
    const refreshToken = ref<string>('')

    const setToken = (newAccessToken: string, newRefreshToken: string) => {
        accessToken.value = newAccessToken
        refreshToken.value = newRefreshToken
    }

    const clearToken = () => {
        accessToken.value = ''
        refreshToken.value = ''
    }

    return {
        accessToken,
        refreshToken,
        setToken,
        clearToken
    }
}, {
    // 开启持久化：默认存入 localStorage
    persist: true
})