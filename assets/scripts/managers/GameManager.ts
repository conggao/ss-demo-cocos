import { _decorator, director, Component, log, Node, sys } from 'cc';
const { ccclass, property } = _decorator;
import 'minigame-api-typings'
import { EventTrans } from '../events/EventTrans';
import databus from './databus';
@ccclass('GameManager')
export class GameManager extends Component {
	start() {
		console.log('小游戏运行平台', sys.platform);
		// 判断小游戏运行的平台
		switch (sys.platform) {
			case sys.Platform.WECHAT_GAME:
				console.log('游戏运行在微信小游戏平台上');
				wx.cloud.init();
				//微信登录
				this.wxLogin();
				break;
			case sys.Platform.BAIDU_MINI_GAME:
				console.log('游戏运行在百度小游戏平台上');
				break;
			default:
				console.log('游戏不是运行在小游戏平台上');
		}
		// this.singin();
		// 游戏开始，跳转到游戏页面
		EventTrans.instance.on('onGameStart', () => {
			// director.loadScene('game')
			this.runScene('game')
		})
	}
	async wxLogin() {
		console.log('开始微信登陆');

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
					})
				}
			}
		})
	}

	runScene(sceneName: string) {
		director.loadScene(sceneName)
	}
	update(deltaTime: number) {
	}
}
