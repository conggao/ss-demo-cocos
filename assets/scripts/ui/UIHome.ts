import { _decorator, Component, Node, director, sys, resources, Prefab, instantiate, log, game, EventTarget } from 'cc';
import { gameServer } from '../managers/gameserver';
import databus from '../managers/databus';
import 'minigame-api-typings'
import { EventTrans } from '../events/EventTrans';
import { SceneUtils } from '../utils/SceneUtils';
import { Events } from '../events/Events';
const { ccclass, property } = _decorator;


/**
 * 游戏大厅
 */
@ccclass('UIStart')
export class UIStart extends Component {
    start() {
        // 游戏开始，跳转到游戏页面
        EventTrans.instance.on(Events.onGameStart, () => {
            console.log('游戏开始，跳转到游戏页面');
            
            SceneUtils.loadGame()
        })
        console.log('小游戏运行平台', sys.platform);
        EventTrans.instance.on(Events.createRoom, () => {
            SceneUtils.loadRoom()
        })
        // 判断小游戏运行的平台
        switch (sys.platform) {
            case sys.Platform.WECHAT_GAME:
                console.log('游戏运行在微信小游戏平台上');
                wx.cloud.init();
                //微信登录
                this.wxLogin();
                gameServer.login();
                break;
            case sys.Platform.BAIDU_MINI_GAME:
                console.log('游戏运行在百度小游戏平台上');
                break;
            default:
                console.log('游戏不是运行在小游戏平台上');
        }
    }

    async wxLogin() {
        console.log('开始微信登陆');

        // TODO 做游戏的个人中心
        // 获取openId 
        // let res = await wx.cloud.callContainer({
        // 	"config": {
        // 		"env": "prod-6g7pcu8aa3559172"
        // 	},
        // 	"path": "/api/wx_openid",
        // 	"header": {
        // 		"X-WX-SERVICE": "express-nhqd",
        // 		"content-type": "application/json"
        // 	},
        // 	"method": "GET",
        // 	"data": ""
        // })
        // console.log('用户openId', res);
        wx.getSetting({
            withSubscriptions: true,
            success(res) {
                console.log('微信设置', res);

                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.getUserInfo({
                        success: function (res) {
                            console.log('用户信息', res.userInfo)
                            databus.userInfo = {
                                avatarUrl: res.userInfo.avatarUrl,
                                nickName: res.userInfo.nickName
                            }
                        }
                    })
                } else {
                    // 否则，先通过 wx.createUserInfoButton 接口发起授权
                    let button = wx.createUserInfoButton({
                        type: 'text',
                        text: '获取用户信息',
                        style: {
                            left: 10,
                            top: 76,
                            width: 200,
                            height: 40,
                            lineHeight: 40,
                            backgroundColor: '#ff0000',
                            color: '#ffffff',
                            textAlign: 'center',
                            fontSize: 16,
                            borderRadius: 4
                        }
                    })
                    button.onTap((res) => {
                        // 用户同意授权后回调，通过回调可获取用户头像昵称信息
                        console.log(res)
                        databus.userInfo = {
                            avatarUrl: res.userInfo.avatarUrl,
                            nickName: res.userInfo.nickName
                        }
                    })
                }
            }
        })
    }

    update(deltaTime: number) {

    }

    onJoin() {
        this.joinToRoom()
    }

    onCreateRoom() {
        gameServer.login().then(
            () => {
                gameServer.createRoom({}, () => {
                    console.log('创建房间成功后回调');
                    director.loadScene("room")
                })
            }
        )
    }

    joinToRoom() {
        // 判断小游戏运行的平台
        switch (sys.platform) {
            case sys.Platform.WECHAT_GAME:
                // wx.showLoading({ title: '加入房间中' });
                // gameServer.joinRoom(databus.currAccessInfo).then(res => {
                //     wx.hideLoading();
                //     let data = res.data || {};

                //     databus.selfClientId = data.clientId;
                //     gameServer.accessInfo = databus.currAccessInfo;
                //     // this.runScene(Room);
                //     console.log('join', data);
                // }).catch(e => {
                //     console.log(e);
                // });
                gameServer.createMatchRoom();
                break;
            default:
                break
        }

    }
}


