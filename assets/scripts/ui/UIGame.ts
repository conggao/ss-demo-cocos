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
@requireComponent(GameManager)
export class UIGame extends Component {
    gameServer: GameServer

    isPaused: boolean = false;

    labelPause: Label | null = null;
    @property(Component)
    gameManager: GameManager
    playerMap: Map<string, Node> = new Map()

    start() {

    }

    onDestroy() {

    }

    /**
     * 创建玩家
     * 
     */
    createPlayer(openId: string) {
        assetManager.loadBundle('resources', (err, bundle) => {
            bundle.loadDir('prefab/actor/Player', (dirErr, prefabs) => {
                (DynamicResourceDefine.ui.player.Path, Prefab, () => {
                    const player: Prefab = resources.get(DynamicResourceDefine.ui.player.User, Prefab)
                    if (!player) {
                        console.log('加载用户失败，用户组件路径：', DynamicResourceDefine.ui.player.User);
                    }
                    let node: Node = instantiate(player!)
                    director.getScene().getChildByName('Room').addChild(node);
                    this.playerMap.set(openId, node)
                })
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

}

