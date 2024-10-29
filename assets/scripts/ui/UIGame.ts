import { _decorator, Component, ProgressBar, Label, Button, director, resources, Game, log, assetManager, Prefab, instantiate, Node, EventHandler, sys, Vec2, Vec3 } from 'cc';
import { GameServer, gameServer } from '../managers/gameserver';
const { ccclass, property, requireComponent } = _decorator;
import 'minigame-api-typings'
import { DynamicResourceDefine } from '../resources/ResourceDefine';
import { Actor } from '../actor/Actor';
import config from '../config/config';
import databus from '../managers/databus';
import { PlayerController } from '../actor/PlayerController';
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
            this.initPlayer()
        }
    }


    /**
     * 初始化游戏玩家
     */
    initPlayer() {
        let memberList = []
        if (this.isWxPlatform) {
            memberList = gameServer.roomInfo.memberList || [];
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
                    // node.position = new Vec3(11.954, -328.759, 0);
                    // 绑定开门事件
                    const openDoorBtn = director.getScene().getChildByName("UIGame").getChildByName("GameLayout").getChildByName("openDoor")
                    const openDoorHandler = new EventHandler()
                    openDoorHandler.target = node
                    openDoorHandler.component = "Actor"
                    openDoorHandler.handler = "openDoor"
                    openDoorBtn.getComponent(Button).clickEvents[0] = openDoorHandler
                }
                this.node.addChild(node);
                this.playerMap.set(selfClientId, node)
            })
        })
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
            gameServer.endGame()
        }
        director.loadScene("start")
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

