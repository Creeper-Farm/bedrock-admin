/**
 * 通用返回参数
 */
export interface Result<T> {
    code: number;
    message: string;
    data: T,
    timestamp: string
}

/**
 * 用户登录
 */
export interface Auth {
    accessToken: string
    refreshToken: string
    accessTokenExpiresIn: number
    refreshTokenExpiresIn: number
}