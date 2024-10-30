
/**
 * 广播消息
 */
export interface MsgData {
    type: MsgTypeEnum
    data
}
export enum MsgTypeEnum {
    START,
    END,
    DOOR_CONFIG
}