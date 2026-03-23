/**
 * 通用返回参数
 */
export interface Result<T> {
    code: number;
    message: string;
    data: T,
    timestamp: string
}
