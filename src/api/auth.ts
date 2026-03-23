import request from "@/utils/request.ts";
import type {Auth} from "@/api/type.ts";

/**
 * 用户登录
 */
export function login(username: string, password: string) {
    return request.post<Auth>("/api/auth/login", {username: username, password: password});
}