import { _decorator, assetManager, Component, director, ImageAsset, instantiate, Label, Node, Prefab, resources, Sprite, SpriteFrame } from 'cc';
import { EventTrans } from '../events/EventTrans';
import { DynamicResourceDefine } from '../resources/ResourceDefine';
import databus from '../managers/databus';
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
        const player = resources.get(DynamicResourceDefine.ui.player.Path, Prefab)
        let node = instantiate(player!)
        node.active = true;

        // 获取用户头像并设置到用户组件
        assetManager.loadRemote<ImageAsset>(databus.userInfo.avatarUrl, { ext: '.jpeg' }, (err, img) => {
            if (err) {
                console.log('获取微信头像失败：', databus.userInfo.avatarUrl, err);
                return;
            }

            node.getChildByName('avatar')!.getComponent(Sprite).spriteFrame = SpriteFrame.createWithImage(img)
            node.getChildByName('userName')!.getComponent(Label).string = databus.userInfo.nickName
            director.getScene().getChildByName('Room').addChild(node);
        });
    }

    update(deltaTime: number) {

    }

    runScene(sceneName: string) {
        director.loadScene(sceneName)
    }

    matchGame() { }
}


