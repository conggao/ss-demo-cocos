import { _decorator, Component, Node, sys } from 'cc';
import { SceneUtils } from '../utils/SceneUtils';
import { EventTrans } from '../events/EventTrans';
import { Events } from '../events/Events';
import { gameServer } from '../managers/gameserver';
const { ccclass, property } = _decorator;

@ccclass('UIStart')
export class UIStart extends Component {
    isWxPlatform: boolean = false
    start() {
        // 判断小游戏运行的平台
        switch (sys.platform) {
            case sys.Platform.WECHAT_GAME:
                this.isWxPlatform = true;
                // const logManager = wx.getRealtimeLogManager()
                // const logger = wx.getLogManager({ level: 1 });
                // console.log = logger.log
                // console.error = logManager.error
                // wx.onError((error: WechatMinigame.Error) => {
                //     console.log(error.message)
                //     console.log(error.stack);
                // })
                break;
            case sys.Platform.BAIDU_MINI_GAME:
                console.log('游戏运行在百度小游戏平台上');
                break;
            default:
                console.log('游戏不是运行在小游戏平台上');
        }
        // 游戏开始，跳转到游戏页面
        EventTrans.instance.on(Events.onGameStart, () => {
            SceneUtils.loadGame()
        })
        // 监听游戏结束事件
        EventTrans.instance.on(Events.onGameEnd, () => {
            if (this.isWxPlatform) {
                gameServer.endGame()
            }
        })
        SceneUtils.loadStart()
    }

    update(deltaTime: number) {

    }
}


