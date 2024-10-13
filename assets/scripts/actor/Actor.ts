import { _decorator, Collider2D, Vec3, Component, RigidBody2D, math, v3, CCFloat, ICollisionEvent, Vec2, v2, Contact2DType, IPhysics2DContact, Node, Animation, AnimationState } from 'cc';
import { Events } from '../events/Events';
import { PhysicsGroup } from './PhysicsGroup';
import { StateDefine } from './StateDefine';
const { ccclass, property } = _decorator;
import doorConfig from '../config/SceneConfig'
import { Door } from './Door';

let tempVelocity: Vec2 = v2();

/**
 * 角色和怪物的移动、状态管理器、碰撞检测
 */
@ccclass('Actor')
export class Actor extends Component {

    currState: StateDefine | string = StateDefine.Idle;

    collider: Collider2D | null = null;

    destForward: number = 0

    @property(CCFloat)
    linearSpeed: number = 1.0;


    rigidbody: RigidBody2D | null = null;

    contactDoor: Node | null = null;

    get dead(): boolean {
        return this.currState == StateDefine.Die;
    }


    start() {
        Door.instance.on("DoorOpenEvent", this.onDoorOpen, this)
        this.rigidbody = this.node.getComponent(RigidBody2D);
        this.collider = this.node.getComponent(Collider2D);
        console.log(this.collider);

        this.collider?.on(Contact2DType.BEGIN_CONTACT, this.onTriggerEnter, this);
        this.collider?.on(Contact2DType.END_CONTACT, this.onTriggerEnd, this);
    }
    onTriggerEnd(END_CONTACT: string, onTriggerEnd: any, arg2: this) {
        console.log('碰撞完成');
        this.contactDoor = null;
    }

    onDestroy() {
        this.collider?.off("onTriggerEnter", this.onTriggerEnter, this);
    }
    openDoor() {
        console.log('开门', this.contactDoor)
        if (this.contactDoor) {
            let animation: Animation = this.contactDoor.getComponent(Animation)
            animation.play('openDoorAnim')
            console.log('播放开门动画');

            // animation.on(Animation.EventType.STOP, () => {
            //     let descPosition = this.contactDoor.getParent().getChildByName(doorConfig[doorName]).getPosition()
            //     this.node.setPosition(descPosition)
            // }, this)
        }
    }

    // 事件帧动画，开门结束触发，人物移动到目标门
    public onDoorOpen() {
        console.log('播放开门动画结束');
        let doorName = this.contactDoor.name
        console.log(doorName);
        let descDoor = this.contactDoor.getParent().getChildByName(doorConfig[doorName])
        let descPosition = descDoor.getPosition()
        this.node.setPosition(descPosition)
        this.contactDoor = descDoor
    }

    update(deltaTime: number) {
        if (this.currState == StateDefine.Die) {
            return;
        }
        this.doMove();

        // switch (this.currState) {
        //     case StateDefine.Run:
        //         this.doMove();
        //         break;
        // }
    }

    // 玩家移动
    doMove() {
        let speed = this.linearSpeed * this.destForward;
        tempVelocity.x = speed;
        this.rigidbody.linearVelocity = tempVelocity;
    }

    stopMove() {
        this.rigidbody.linearVelocity = Vec2.ZERO;
    }

    changeState(state: StateDefine | string) {
        this.currState = state;
    }


    onDie() {
        if (this.currState == StateDefine.Die) {
            return;
        }
        this.changeState(StateDefine.Die);
        this.node.emit(Events.onDead, this.node)
    }

    onTriggerEnter(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        console.log('发生碰撞', otherCollider);
        // 被碰撞的是门
        if (otherCollider.group === PhysicsGroup.Door) {
            this.contactDoor = otherCollider.node
        }
        // 判断两个物体是否可以碰撞
        if (!PhysicsGroup.isHurtable(otherCollider.group, this.collider.group)) {
            return;
        }
        this.changeState(StateDefine.Die);
    }

}


