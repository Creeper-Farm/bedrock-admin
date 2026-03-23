import type {UserStatusType} from "@/enums/user.ts";

/**
 * 用户信息
 */
export interface UserInfo {
    id: number
    username: string
    email: string
    avatar: string
    bio: string
    status: UserStatusType
    lastLoginTime: string
    createTime: string
}