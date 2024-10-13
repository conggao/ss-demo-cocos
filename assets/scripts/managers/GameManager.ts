import { _decorator, director, Component, log, Node, sys } from 'cc';
const { ccclass, property } = _decorator;
import 'minigame-api-typings'
import { EventTrans } from '../events/EventTrans';
import databus from './databus';
import { GameServer } from './gameserver';
@ccclass('GameManager')
export class GameManager extends Component {
	gameServer: GameServer;
	start() {
		console.log('小游戏运行平台', sys.platform);
		switch (sys.platform) {
			case sys.Platform.WECHAT_GAME:
				console.log('游戏运行在微信小游戏平台上');
				this.gameServer = new GameServer()
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
	wxLogin() {
		console.log('开始微信登陆');

		// 获取openId
		wx.cloud.callContainer({
			"config": {
				"env": "prod-6g7pcu8aa3559172"
			},
			"path": "/api/wx_openid",
			"header": {
				"X-WX-SERVICE": "express-nhqd",
				"content-type": "application/json"
			},
			"method": "GET",
			"data": ""
		}).then(res => {
			console.log('用户openId', res);
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

					}
				}
			})
			// 加入房间
			this.joinToRoom()
		})
	}

	joinToRoom() {
		wx.showLoading({ title: '加入房间中' });
		this.gameServer.joinRoom(databus.currAccessInfo).then(res => {
			wx.hideLoading();
			let data = res.data || {};

			databus.selfClientId = data.clientId;
			this.gameServer.accessInfo = databus.currAccessInfo;
			// this.runScene(Room);
			console.log('join', data);
		}).catch(e => {
			console.log(e);
		});
	}
	runScene(sceneName: string) {
		director.loadScene(sceneName)
	}
	launch(gameServer) {
		this.gameServer = gameServer;
	}
	update(deltaTime: number) {
	}
}
