import { _decorator, Component, EventTarget, Node } from 'cc';
import { EventTrans } from '../events/EventTrans';
const { ccclass, property } = _decorator;

@ccclass('Door')
export class Door extends Component {
    start() {

    }

    update(deltaTime: number) {

    }
    // 事件帧动画，开门结束触发，人物移动到目标门
    public onDoorOpen(clientId: number) {
        console.log('播放开门动画结束，', arg);
        EventTrans.instance.emit("DoorOpenEvent")
    }
}


