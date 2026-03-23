import request from "@/utils/request.ts";
import type {UserInfo} from "@/types/user.ts";

/**
 * 获取用户信息
 */
export const queryUserInfo = () => {
    return request.get<UserInfo>('/api/user/profile');
}