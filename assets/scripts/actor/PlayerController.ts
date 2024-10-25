import { _decorator, Component, Node } from 'cc';
const { ccclass, property, requireComponent } = _decorator;
import { VirtualInput } from '../input/VirtualInput'
import { Actor } from './Actor';
@ccclass('PlayerController')
@requireComponent(Actor)
export class PlayerController extends Component {
    isOwner:boolean = false
    start() {

    }

    update(deltaTime: number) {
        if (this.isOwner) {
            let x = VirtualInput.horizontal
            let actor: Actor = this.node.getComponent('Actor') as Actor
            actor.destForward = x
        }
    }
}


