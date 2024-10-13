import 'minigame-api-typings'
/**
 * 全局状态管理器
 */
class DataBus {
    userInfo = { avatarUrl: '', nickName: '' };
    gameover: boolean;
    currAccessInfo: string;
    playerMap;
    playerList
    selfPosNum
    selfClientId
    selfMemberInfo
    debugMsg
    matchPattern
    gameInstance: any;
    constructor() {
        this.reset();
    }

    reset() {
        this.gameover = false;
        this.currAccessInfo = '';
        this.playerMap = {};
        this.playerList = [];
        this.selfPosNum = 0;
        this.selfClientId = 1;
        this.selfMemberInfo = {};
        this.debugMsg = [];
        this.matchPattern = void 0;
    }

}

export default new DataBus();

