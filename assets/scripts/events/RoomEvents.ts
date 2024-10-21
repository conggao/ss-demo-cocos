import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export class RoomEvents {
    /**
    * 房间创建
    */
    static createRoom: string = "createRoom";

    /**
     * 房间有人加入
     */
    static onRoomInfoChange: string = "onRoomInfoChange";

    /**
     * 受伤
     */
    static onHurt: string = "onHurt";

}


