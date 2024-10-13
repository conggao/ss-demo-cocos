import { _decorator, Component, Node } from 'cc';
const { ccclass, property, requireComponent } = _decorator;
import { VirtualInput } from '../input/VirtualInput'
import { Actor } from './Actor';
@ccclass('PlayerController')
@requireComponent(Actor)
export class PlayerController extends Component {
    start() {

    }

    update(deltaTime: number) {
        let x = VirtualInput.horizontal
        let actor: Actor = this.node.getComponent('Actor') as Actor
        actor.destForward = x
    }
}


