import { director } from "cc";

export class SceneUtils {
    static runScene(sceneName: string) {
        director.loadScene(sceneName)
    }
    static loadStart() {
        this.runScene("start")
    }
    static loadRoom() {
        this.runScene("room")
    }
    static loadGame() {
        this.runScene("game")
    }
}
