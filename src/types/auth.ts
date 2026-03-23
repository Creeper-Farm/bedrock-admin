/**
 * 用户登录
 */
export interface Auth {
    accessToken: string
    refreshToken: string
    accessTokenExpiresIn: number
    refreshTokenExpiresIn: number
}