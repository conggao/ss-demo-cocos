/**
 * 全局事件定义
 */
export class Events {

    /**
     * Actor 死亡事件
     */
    static onDead: string = "onDead";

    /**
     * 杀死怪物
     */
    static onEnemyKilled: string = "onKilled";

    /**
     * 受伤
     */
    static onHurt: string = "onHurt";

    /**
     * 投射物销毁
     */
    static onProjectileDead: string = "onProjectileDead";

    /**
     * 玩家获取经验值
     */
    static onExpGain: string = "onExpGain";

    /**
     * 玩家升级
     */
    static onPlayerUpgrade: string = "onPlayerUpgrade";

    /**
     * 设置面板的背景音乐音量变化
     */
    static onBgmVolumeChanged: string = "onBgmVolumeChanged";

    /**
    * 房间创建
    */
    static createRoom: string = "createRoom";

    /**
     * 房间有人加入
     */
    static onRoomInfoChange: string = "onRoomInfoChange";

    /**
     * 游戏开始
     */
    static onGameStart: string = "onGameStart";
     /**
     * 游戏结束
     */
     static onGameEnd: string = "onGameEnd";

      /**
     * 游戏胜利
     */
      static onGameVectory: string = "onGameVectory";


}

