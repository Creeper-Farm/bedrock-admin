/**
 * 用户状态常量对象
 */
export const UserStatus = {
    NORMAL: 'NORMAL',
    DISABLED: 'DISABLED',
    LOCKED: 'LOCKED',
    CANCELED: 'CANCELED'
} as const;

/**
 * 提取字面量类型: 'NORMAL' | 'DISABLED' | 'LOCKED' | 'CANCELED'
 */
export type UserStatusType = typeof UserStatus[keyof typeof UserStatus];

/**
 * 描述映射（用于界面显示）
 */
export const UserStatusDesc: Record<UserStatusType, string> = {
    [UserStatus.NORMAL]: '正常',
    [UserStatus.DISABLED]: '禁用',
    [UserStatus.LOCKED]: '锁定',
    [UserStatus.CANCELED]: '注销'
};