import { _decorator, Component, Node } from 'cc';
const { ccclass, property, requireComponent } = _decorator;
import { VirtualInput } from '../input/VirtualInput'
import { Actor } from './Actor';
import config from '../config/config';
import databus from '../managers/databus';
import { gameServer } from '../managers/gameserver';
@ccclass('PlayerController')
@requireComponent(Actor)
export class PlayerController extends Component {
    isOwner: boolean = false
    start() {

    }

    update(deltaTime: number) {
        if (this.isOwner) {
            // 摇杆偏移量
            let x = VirtualInput.horizontal
            let actor: Actor = this.node.getComponent('Actor') as Actor
            actor.destForward = x
            let evt = (x === 0
                ? { e: config.msg.MOVE_STOP, n: databus.selfClientId }
                : { e: config.msg.MOVE_DIRECTION, n: databus.selfClientId, d: x });
            gameServer.uploadFrame([
                JSON.stringify(evt)
            ]);
        }
    }
}


