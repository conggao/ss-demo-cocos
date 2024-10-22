import { _decorator, Component, Node } from 'cc';
import { gameServer } from '../managers/gameserver';
const { ccclass, property } = _decorator;

@ccclass('UIFrendList')
export class UIFrendList extends Component {
    start() {

    }

    update(deltaTime: number) {

    }

    /**
     * 邀请好友加入房间
     */
    inviteFrend() {
        wx.shareAppMessage({
            title: '魔力任意门大逃杀',
            query: 'accessInfo=' + gameServer.accessInfo,
            imageUrl: 'https://res.wx.qq.com/wechatgame/product/luban/assets/img/sprites/bk.jpg',
        });
    }
}


