import { _decorator, Collider2D, Component, RigidBody2D, CCFloat, Vec2, v2, Contact2DType, IPhysics2DContact, Node, Animation, sp, director } from 'cc';
import { Events } from '../events/Events';
import { PhysicsGroup } from './PhysicsGroup';
import { StateDefine } from './StateDefine';
const { ccclass, property } = _decorator;
import { EventTrans } from '../events/EventTrans';
import databus from '../managers/databus';
import { gameServer, FrameData } from '../managers/gameserver';
import { MsgTypeEnum } from '../managers/Msg';
import config from '../config/config';
import { isWxPlatform } from '../utils/Platform';

let tempVelocity: Vec2 = v2();

/**
 * 角色和怪物的移动、状态管理器、碰撞检测
 */
@ccclass('Actor')
export class Actor extends Component {
    isOwner: boolean = false
    currState: StateDefine | string = StateDefine.Idle;

    collider: Collider2D | null = null;

    destForward: number = 0

    @property(CCFloat)
    linearSpeed: number = 1.0;


    rigidbody: RigidBody2D | null = null;

    contactDoor: Node | null;

    get dead(): boolean {
        return this.currState == StateDefine.Die;
    }

    start() {
        this.rigidbody = this.node.getComponent(RigidBody2D);
        this.collider = this.node.getComponent(Collider2D);

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
    
    public getDoor(doorName: string) {
        return director.getScene().getChildByName('UIGame').getChildByName('Door').getChildByName(doorName)
    }
    
    openDoor(clientId: number, doorName: string) {
        if (doorName) {
            const contactDoor = this.getDoor(doorName)
            console.log('开门', contactDoor)
            let animation: Animation = contactDoor.getComponent(Animation)
            if (animation && animation.defaultClip) {
                const { defaultClip } = animation;
                defaultClip.events = [
                    {
                        frame: 0.95, // 第 0.5 秒时触发事件
                        func: 'onDoorOpen', // 事件触发时调用的函数名称
                        params: [clientId.toString(), doorName], // 向 `func` 传递的参数
                    }
                ];
                animation.clips = animation.clips;
            }
            animation.play('openDoorAnim')
            console.log('播放开门动画');
        }
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
        // TODO 是否给 力 驱动会更自然
        // console.log('人物移动,速度：',speed);
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
            this.contactDoor = director.getScene().getChildByName('UIGame').getChildByName('Door').getChildByUuid(otherCollider.node.uuid)
        }
        // 被碰撞的是成功标志
        if (otherCollider.group === PhysicsGroup.Victory) {
            EventTrans.instance.emit(Events.onGameVectory)
            console.log('游戏结束，应发送消息判定该名玩家获胜');
        }
        // 判断两个物体是否可以碰撞
        if (!PhysicsGroup.isHurtable(otherCollider.group, this.collider.group)) {
            return;
        }
        // this.changeState(StateDefine.Die);
    }

}


