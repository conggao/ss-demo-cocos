import { _decorator, Component, ProgressBar, Label, Button, director, resources } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 游戏主界面
 */
@ccclass('UIGame')
export class UIGame extends Component {


    isPaused: boolean = false;

    labelPause: Label | null = null;


    start() {
    }

    onDestroy() {
    
    }

    onExitGame() {
        resources.releaseUnusedAssets()
        director.loadScene("startup")
    }

    onPauseGame() {
        if (director.isPaused()) {
            director.resume();
        } else {
            director.pause();
        }
    }

}

