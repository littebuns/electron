export interface ResponseResultType<T = any> {
    /** 返回结果 */
    data: T | null;
    /** 请求是否成功 */
    success: boolean;
    /** 返回信息 */
    msg?: string;
    /** 请求编码，code为0代表的是成功，其他都是失败！ */
    code: '999999' | '100000' | '401' | 401;
    /** 版本号 */
    version: string;
}