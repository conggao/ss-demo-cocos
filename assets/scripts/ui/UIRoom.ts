import { _decorator, assetManager, Component, director, ImageAsset, instantiate, Label, Node, Prefab, resources, Sprite, SpriteFrame, Vec2, Vec3 } from 'cc';
import { EventTrans } from '../events/EventTrans';
import { DynamicResourceDefine } from '../resources/ResourceDefine';
import databus from '../managers/databus';
import { gameServer } from '../managers/gameserver';
import { SceneUtils } from '../utils/SceneUtils';
import { Events } from '../events/Events';
import { MsgData, MsgTypeEnum } from '../managers/Msg';
const { ccclass, property } = _decorator;

@ccclass('UIRoom')
export class UIRoom extends Component {
    onRoomInfoChangeHandler
    start() {
        director.preloadScene('game')
        // this.singin();
        // 游戏开始，跳转到游戏页面
        EventTrans.instance.on(Events.onGameStart, () => {
            SceneUtils.loadGame()
        })
        this.onRoomInfoChangeHandler = this.onRoomInfoChange.bind(this)
        EventTrans.instance.on(Events.onRoomInfoChange, this.onRoomInfoChangeHandler)
        // this.createOneUser({ headimg: databus.userInfo.avatarUrl, nickname: databus.userInfo.nickName })
    }
    // 房间队伍信息改变
    onRoomInfoChange(roomInfo: WechatMinigame.OnRoomInfoChangeListenerResult) {
        // 清空房间UI后重新创建
        const memberList = roomInfo.memberList || [];
        memberList.forEach(async (member, index) => {
            let user = await this.createOneUser(member)
        })
    }
    update(deltaTime: number) {

    }


    /**
     * 创建房间玩家UI
     * @param options 
     * @returns 
     */
    createOneUser(member: WechatMinigame.RoomMemberInfo): Promise<Node> {
        return new Promise((resolve, reject) => {
            const { headimg, posNum, nickname, role, isReady } = member;
            resources.loadDir(DynamicResourceDefine.ui.player.Path, Prefab, () => {
                const player: Prefab = resources.get(DynamicResourceDefine.ui.player.User, Prefab)
                if (!player) {
                    console.log('加载用户失败，用户组件路径：', DynamicResourceDefine.ui.player.User);
                }
                let node: Node = instantiate(player!)
                node.active = true;

                // 获取用户头像并设置到用户组件
                assetManager.loadRemote<ImageAsset>(headimg, { ext: '.jpeg' }, (err, img) => {
                    if (err) {
                        console.log('获取微信头像失败：', headimg, err);
                        return;
                    }

                    node.getChildByName('avatar')!.getComponent(Sprite).spriteFrame = SpriteFrame.createWithImage(img)
                    node.getChildByName('userName')!.getComponent(Label).string = nickname
                    // 通过index设置每个玩家的位置
                    node.position = new Vec3(node.position.x + 200 * (posNum - 1), node.position.y, 0)
                    director.getScene().getChildByName('Room').addChild(node);
                    resolve(node)
                });
            })
        })
    }

    /**
     * TODO 对局匹配
     */
    matchGame() {
        gameServer.updateReadyStatus(true);
        const msg = JSON.stringify({
            type: MsgTypeEnum.START,
            data: "游戏开始",
        } as MsgData)
        gameServer.server.broadcastInRoom({ msg: msg, toPosNumList: [] })
    }
}


