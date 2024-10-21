import { _decorator, assetManager, Component, director, ImageAsset, instantiate, Label, Node, Prefab, resources, Sprite, SpriteFrame } from 'cc';
import { EventTrans } from '../events/EventTrans';
import { DynamicResourceDefine } from '../resources/ResourceDefine';
import databus from '../managers/databus';
import { gameServer } from '../managers/gameserver';
import { RoomEvents } from '../events/RoomEvents';
const { ccclass, property } = _decorator;

@ccclass('UIRoom')
export class UIRoom extends Component {
    start() {
        // this.singin();
        // 游戏开始，跳转到游戏页面
        EventTrans.instance.on('onGameStart', () => {
            // director.loadScene('game')
            this.runScene('game')
        })
        EventTrans.instance.on(RoomEvents.onRoomInfoChange, this.onRoomInfoChange)
        this.createOneUser({ headimg: databus.userInfo.avatarUrl, nickname: databus.userInfo.nickName })
    }
    // 房间队伍信息改变
    onRoomInfoChange(roomInfo) {
        const memberList = roomInfo.memberList || [];
        memberList.forEach(async (member, index) => {
            member.index = index;
            let user = await this.createOneUser(member)

            if (member.isEmpty) {
                user.on('pointerdown', () => {
                    wx.shareAppMessage({
                        title: '魔力任意门大逃杀',
                        query: 'accessInfo=' + gameServer.accessInfo,
                        imageUrl: 'https://res.wx.qq.com/wechatgame/product/luban/assets/img/sprites/bk.jpg',
                    });
                });
            }
        })

    }
    update(deltaTime: number) {

    }

    runScene(sceneName: string) {
        director.loadScene(sceneName)
    }

    createOneUser(options): Promise<Node> {
        return new Promise((resolve, reject) => {
            const { headimg, index, nickname, role, isReady } = options;
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
                    // TODO 通过index设置每个玩家的位置
                    // node.getComponent('')

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
        gameServer.createMatchRoom()
    }
}


