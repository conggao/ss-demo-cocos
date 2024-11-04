import { _decorator, Component, ProgressBar, Label, Button, director, resources, Game, log, assetManager, Prefab, instantiate, Node, EventHandler, sys, Vec2, Vec3 } from 'cc';
import { FrameData, gameServer } from '../managers/gameserver';
const { ccclass, property, requireComponent } = _decorator;
import 'minigame-api-typings'
import { DynamicResourceDefine } from '../resources/ResourceDefine';
import { Actor } from '../actor/Actor';
import config from '../config/config';
import databus from '../managers/databus';
import { PlayerController } from '../actor/PlayerController';
import { EventTrans } from '../events/EventTrans';
import { Events } from '../events/Events';
import { UIJoyStick } from './UIJoyStick';
import { VirtualInput } from '../input/VirtualInput';
import { MsgData, MsgTypeEnum } from '../managers/Msg';
import { genDoorConfig } from '../config/SceneConfig';
import { isWxPlatform } from '../utils/Platform';
/**
 * 游戏界面
 */
@ccclass('UIGame')
export class UIGame extends Component {

    isPaused: boolean = false;

    labelPause: Label | null = null;

    // key为selfClientId
    playerMap: Map<number, Node> = new Map()

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
        if (config.debug) {
            // TODO 非调试模式在加载场景时加载
            this.initPlayer()
            databus.doorConfig = genDoorConfig()
        }

        // 监听游戏胜利事件
        EventTrans.instance.on(Events.onGameVectory, () => {
            databus.gameover = true
            VirtualInput.reset()
            // 禁用摇杆
            director.getScene().getChildByName("UIGame").getChildByName('GameLayout').getChildByName('JoyStick').getComponent(UIJoyStick).onDestroy()
            // 发送结束游戏的消息（完成游戏的玩家）
            const msgStr = JSON.stringify({
                type: MsgTypeEnum.END,
                data: { clientId: databus.selfClientId, nickName: databus.userInfo.nickName }
            })
            if (this.isWxPlatform) {
                gameServer.server.broadcastInRoom({
                    msg: msgStr,
                    toPosNumList: []
                })
            }
            if (config.debug) {
                const msg = JSON.parse(msgStr) as MsgData
                director.getScene().getChildByName("UIGame").getChildByName('GameLayout').getChildByName('Layout').getChildByName('Msg').getComponent(Label).string = `${msg.data.nickName}获取胜利`
            }
        })
        EventTrans.instance.on("DoorOpenEvent", this.onDoorOpen, this)
    }


    /**
     * 初始化游戏玩家
     */
    initPlayer() {
        let memberList = []
        if (gameServer) {
            memberList = gameServer.roomInfo.memberList || [];
            console.log("房间人员列表：", memberList);
        }
        if (config.debug) {
            memberList = [
                { clientId: 1, headimg: "", nickname: "高聪" },
            ]
            databus.selfClientId = 1
        }

        memberList.forEach((member, index) => {
            let { role, clientId, nickname, isReady } = member;

            this.createPlayer(clientId, nickname, role);
            // player.setData(member);
            // this.addChild(player);

            // let hp = new Hp({
            //     width: 231,
            //     height: 22,
            //     hp: config.playerHp,
            // });
            // this.addChild(hp);
            // player.hpRender = hp;

            // player.y = config.GAME_HEIGHT / 2;
            // player.frameY = player.y;
            // if (role === config.roleMap.owner || (databus.matchPattern && index)) {
            //     player.x = player.width / 2;
            //     player.setDirection(0);
            //     hp.setPos(330, 56);

            //     this.createPlayerInformation(hp, nickname, isReady, (name, value) => {
            //         value.x = hp.graphics.x - value.width / 2;
            //         this.addChild(name, value);
            //     })

            // } else {
            //     player.x = config.GAME_WIDTH - player.width / 2;
            //     player.setDirection(180);
            //     hp.setPos(config.GAME_WIDTH - 231 - 253, 56);

            //     this.createPlayerInformation(hp, nickname, isReady, (name, value) => {
            //         value.x = hp.graphics.x - value.width / 2;
            //         name ? this.addChild(name, value) : this.addChild(value);
            //     })
            // }
            // player.frameX = player.x;
        });
    }
    /**
     * 创建玩家
     * 
     */
    createPlayer(selfClientId: number, nickName: string, role: number) {
        assetManager.loadBundle('resources', (err, bundle) => {
            bundle.loadDir(DynamicResourceDefine.Actor.Path, (err, prefabs) => {
                console.log(prefabs);

                const player = bundle.get(DynamicResourceDefine.Actor.Player.User, Prefab);
                if (!player) {
                    console.log('加载用户失败，用户组件路径：', DynamicResourceDefine.Actor.Player.User);
                }
                let node: Node = instantiate(player!);
                node.getChildByName('NickName').getComponent(Label).string = nickName
                // 如果节点是自己，只能摇杆控制，如果节点不是自己，通过帧同步控制
                if (databus.selfClientId === selfClientId) {
                    console.log('自身玩家:', databus.selfClientId, nickName);
                    node.getComponent(PlayerController).isOwner = true
                    node.getComponent(Actor).isOwner = true
                    // node.position = new Vec3(11.954, -328.759, 0);
                    // 绑定开门事件
                    const openDoorBtn = director.getScene().getChildByName("UIGame").getChildByName("GameLayout").getChildByName("openDoor")
                    const openDoorHandler = new EventHandler()
                    openDoorHandler.target = this.node
                    openDoorHandler.component = "UIGame"
                    openDoorHandler.handler = "uploadOpenDoorEvent"
                    openDoorBtn.getComponent(Button).clickEvents.push(openDoorHandler)
                }
                this.node.addChild(node);
                this.playerMap.set(selfClientId, node)
            })
        })
    }

    uploadOpenDoorEvent() {
        console.log('点击开门按钮');

        const contactDoor = this.playerMap.get(databus.selfClientId).getComponent(Actor).contactDoor
        if (contactDoor) {
            if (isWxPlatform()) {
                // 帧同步，开门事件
                const msgStr = JSON.stringify({
                    e: config.msg.OPEN_DOOR,
                    n: databus.selfClientId,
                    d: contactDoor.name
                } as FrameData)
                gameServer.server.uploadFrame({ actionList: [msgStr] })
            }
            this.playerMap.get(databus.selfClientId).getComponent(Actor).openDoor(databus.selfClientId, contactDoor.name)
        }
    }

    // 事件帧动画，开门结束触发，人物移动到目标门
    public onDoorOpen(clientId: number, doorName: string) {
        let actor: Actor = this.playerMap.get(clientId).getComponent('Actor') as Actor
        console.log('播放开门动画结束');
        if (actor.contactDoor) {
            let descDoor = actor.contactDoor.getParent().getChildByName(databus.doorConfig[doorName])
            if (descDoor) {
                // 可能是规则配置问题
                let descPosition = descDoor.getPosition()
                this.playerMap.get(clientId).setPosition(descPosition)
                actor.contactDoor = descDoor
            }
        }
    }

    public getDoor(doorName: string) {
        return director.getScene().getChildByName('UIGame').getChildByName('Door').getChildByName(doorName)
    }

    /**
     * 执行帧同步
     */
    executeFrame = (frameData) => {
        if (frameData.n === databus.selfClientId) {
            return
        }
        const node = this.playerMap.get(frameData.n);
        if (node) {
            const nodeActor = (node.getComponent("Actor") as Actor)
            switch (frameData.e) {
                case config.msg.OPEN_DOOR:
                    console.log('帧同步：clientId' + frameData.n + ',开门');
                    nodeActor.openDoor(frameData.n, frameData.d)
                    break;
                case config.msg.MOVE_DIRECTION:
                    nodeActor.destForward = frameData.d
                    break;
                case config.msg.MOVE_STOP:
                    nodeActor.destForward = 0
                    break;
                default:
                    break;
            }
        }
    }

    update(deltaTime: number) {
        if (databus.gameover) {
            return;
        }
        if (this.isWxPlatform) {
            gameServer.update(deltaTime, this.executeFrame)
        }
    }
    onExitGame() {
        resources.releaseAll()
        if (this.isWxPlatform) {
            gameServer.ownerLeaveRoom(() => {
                console.log('房主离开房间');
            })
        }
    }

    onPauseGame() {
        if (director.isPaused()) {
            director.resume();
        } else {
            director.pause();
        }
    }
    onDestroy() {

    }
}

