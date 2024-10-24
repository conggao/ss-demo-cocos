import { _decorator, Component, ProgressBar, Label, Button, director, resources, Game, log, assetManager, Prefab, instantiate, Node } from 'cc';
import { GameManager } from '../managers/GameManager';
import { GameServer } from '../managers/gameserver';
const { ccclass, property, requireComponent } = _decorator;
import 'minigame-api-typings'
import { DynamicResourceDefine } from '../resources/ResourceDefine';
import { Actor } from '../actor/Actor';
import config from '../config/config';
/**
 * 游戏界面
 */
@ccclass('UIGame')
export class UIGame extends Component {
    gameServer: GameServer

    isPaused: boolean = false;

    labelPause: Label | null = null;
    @property(Component)
    gameManager: GameManager
    // key为selfClientId
    playerMap: Map<number, Node> = new Map()

    start() {
        this.initPlayer()
    }

    onDestroy() {

    }

    /**
     * 创建玩家
     * 
     */
    createPlayer(selfClientId: number) {
        assetManager.loadBundle('resources', (err, bundle) => {
            bundle.loadDir(DynamicResourceDefine.Actor.Path, (err, prefabs) => {
                console.log(prefabs);

                const player = bundle.get(DynamicResourceDefine.Actor.Player.User, Prefab);
                if (!player) {
                    console.log('加载用户失败，用户组件路径：', DynamicResourceDefine.Actor.Player.User);
                }
                let node: Node = instantiate(player!)
                this.node.addChild(node);
                this.playerMap.set(selfClientId, node)
            })
        })
    }

    /**
     * 执行帧同步
     */
    executeFrame(frameData) {
        switch (frameData.e) {
            case config.msg.MOVE_DIRECTION:
                (this.playerMap.get(frameData.n).getComponent("Actor") as Actor).destForward = frameData.d
                break;
            default:
                break;
        }
    }

    onExitGame() {
        resources.releaseAll()
        director.loadScene("start")
    }

    onPauseGame() {
        if (director.isPaused()) {
            director.resume();
        } else {
            director.pause();
        }
    }
    initPlayer() {
        let memberList = this.gameServer.roomInfo.memberList || [];
    
        memberList.forEach((member, index) => {
            let { role, clientId, nickname, isReady } = member;
    
            let player = this.createPlayer(clientId);
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
}

