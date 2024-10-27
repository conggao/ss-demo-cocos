import { _decorator, Component, Node } from 'cc';
import { SceneUtils } from '../utils/SceneUtils';
const { ccclass, property } = _decorator;

@ccclass('UIStart')
export class UIStart extends Component {
    start() {
        SceneUtils.loadStart()
    }

    update(deltaTime: number) {
        
    }
}


