import 'minigame-api-typings'
import { genDoorConfig } from '../config/SceneConfig';
/**
 * 全局状态管理器
 */
class DataBus {
    // 用户信息
    userInfo = { avatarUrl: '', nickName: '' };
    // 游戏结束
    gameover: boolean;
    // 房间标识
    currAccessInfo: string;
    playerMap;
    playerList
    selfPosNum
    // 用户在房间中的id,用于发送消息和帧同步
    selfClientId
    selfMemberInfo
    debugMsg
    // 是否在匹配对局
    matchPattern
    gameInstance: any;
    doorConfig
    constructor() {
        this.reset();
    }

    reset() {
        this.gameover = false;
        this.currAccessInfo = '';
        this.playerMap = {};
        this.playerList = [];
        this.selfPosNum = 0;
        this.selfClientId = null;
        this.selfMemberInfo = {};
        this.debugMsg = [];
        this.matchPattern = void 0;
        this.doorConfig = genDoorConfig(6,6)
    }

}

export default new DataBus();

