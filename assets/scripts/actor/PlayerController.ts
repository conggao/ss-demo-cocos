import { _decorator, Component, Node, sys } from 'cc';
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
    isWxPlatform: boolean = false
    start() {
        // 判断小游戏运行的平台
        switch (sys.platform) {
            case sys.Platform.WECHAT_GAME:
                this.isWxPlatform = true;
                break;
            case sys.Platform.BAIDU_MINI_GAME:
                console.log('游戏运行在百度小游戏平台上');
                break;
            default:
                console.log('游戏不是运行在小游戏平台上');
        }
    }

    update(deltaTime: number) {
        if (this.isOwner && !databus.gameover) {
            // 摇杆偏移量
            let x = VirtualInput.horizontal
            let actor: Actor = this.node.getComponent('Actor') as Actor
            actor.destForward = x
            let evt = (x === 0
                ? { e: config.msg.MOVE_STOP, n: databus.selfClientId }
                : { e: config.msg.MOVE_DIRECTION, n: databus.selfClientId, d: x });
            if (this.isWxPlatform) {
                gameServer.uploadFrame([
                    JSON.stringify(evt)
                ]);
            }

        }
    }
}


