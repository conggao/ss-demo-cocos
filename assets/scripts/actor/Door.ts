import { _decorator, Component, EventTarget, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Door')
export class Door extends Component {
    private static _instance: EventTarget = new EventTarget();
    static get instance(): EventTarget {
        return this._instance;
    }
    
    start() {

    }

    update(deltaTime: number) {

    }
    // 事件帧动画，开门结束触发，人物移动到目标门
    public onDoorOpen() {
        console.log('播放开门动画结束');
        Door.instance.emit("DoorOpenEvent")
    }
}


