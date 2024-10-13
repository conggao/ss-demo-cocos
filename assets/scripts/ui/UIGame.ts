import { _decorator, Component, ProgressBar, Label, Button, director, resources, Game } from 'cc';
import { GameManager } from '../managers/GameManager';
import { GameServer } from '../managers/gameserver';
const { ccclass, property, requireComponent } = _decorator;
import 'minigame-api-typings'
/**
 * 游戏主界面
 */
@ccclass('UIGame')
@requireComponent(GameManager)
export class UIGame extends Component {
    gameServer: GameServer

    isPaused: boolean = false;

    labelPause: Label | null = null;
    @property(Component)
    gameManager: GameManager

    start() {
    }

    onDestroy() {

    }

    onExitGame() {
        resources.releaseAll()
        director.loadScene("start")
    }
    onJoin() {
        this.gameManager.joinToRoom()
    }
    onCreateRoom() {
        this.gameServer = new GameServer;
        this.gameServer.login().then(
            ()=>{
                this.gameServer.createMatchRoom()
            }
        )
    }

    onPauseGame() {
        if (director.isPaused()) {
            director.resume();
        } else {
            director.pause();
        }
    }

}

