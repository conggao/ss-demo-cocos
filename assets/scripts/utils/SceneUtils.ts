import { director } from "cc";
import { UIGame } from "../ui/UIGame";

export class SceneUtils {
    static runScene(sceneName: string) {
        director.loadScene(sceneName, (err, scene) => {
            if (scene.name === 'game') {
                console.log('初始化玩家角色');
                scene.getChildByName('UIGame').getComponent(UIGame).initPlayer()
            }
        })
    }
    static loadHome() {
        this.runScene("home")
    }
    static loadRoom() {
        this.runScene("room")
    }
    static loadGame() {
        this.runScene("game")
    }
}
