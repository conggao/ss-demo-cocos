import { _decorator, Component, log, Node, sys } from 'cc';
const { ccclass, property } = _decorator;
import Colyseus from 'db://colyseus-sdk/colyseus.js';
import 'minigame-api-typings'
@ccclass('GameManager')
export class GameManager extends Component {
	start() {
		switch (sys.platform) {
			case sys.Platform.WECHAT_GAME:
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
	}
	//调用微信接口
	// wxLogin() {
	// 	let sysInfo = wx.getSystemInfoSync();
	// 	// 获取微信界面大小
	// 	let screenWidth = sysInfo.screenWidth;
	// 	let screenHeight = sysInfo.screenHeight;
	// 	let self = this
	// 	wx.login(
	// 		{
	// 			success: (res) => {
	// 				if (res.code) {
	// 					let code = res.code;
	// 					console.log("登陆成功,获取到code:", code)
	// 					wx.request({
	// 						url: "https://express-nhqd-124293-8-1330282868.sh.run.tcloudbase.com/api/login",
	// 						data: {
	// 							"code": code
	// 						},
	// 						success(res) {
	// 							//res.data 就是返回的json 字符串解解析后的数据 res.data.account.sdkId
	// 							console.log("login result:" + res.data)
	// 							//let loginResult = JSON.parse(res);
	// 							// loginResult.get
	// 						}
	// 					});
	// 				}
	// 				var button = wx.createUserInfoButton(
	// 					{
	// 						type: 'text',
	// 						text: '',
	// 						style: {
	// 							left: 0,
	// 							top: 0,
	// 							width: screenWidth,
	// 							height: screenHeight,
	// 							lineHeight: 40,
	// 							backgroundColor: '#00000000',
	// 							color: '#ffffff',
	// 							textAlign: 'center'
	// 						}
	// 					})
	// 				button.onTap((res) => {
	// 					if (res.errMsg == "getUserInfo:ok") {
	// 						console.log("授权用户信息")
	// 						//获取到用户信息
	// 						// let userInfo = res.userInfo
	// 						// self.wxLogin(userInfo);
	// 						wx.getUserInfo({
	// 							lang: "zh_CN",
	// 							success: function (res) {
	// 								let userInfo = res.userInfo
	// 								let avatarUrl = userInfo.avatarUrl
	// 								assetManager.loadRemote(avatarUrl, { ext: '.png' }, (err, spriteFrame) => {
	// 									if (err) {
	// 										return;
	// 									}
	// 									DownloadResource.avartarSpriteFrame = SpriteFrame.createWithImage(spriteFrame as ImageAsset);
	// 								});
	// 								console.log(userInfo)
	// 							},
	// 							fail: function () {
	// 								console.log("获取失败");
	// 								return false;
	// 							}
	// 						})
	// 						//清除微信授权按钮
	// 						button.destroy()
	// 					}
	// 					else {
	// 						console.log("授权失败")
	// 					}
	// 				})
	// 			}
	// 		})
	// }
	wxLogin() {
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
			console.log(res);
		})
	}
	// singin() {
	// 	// Finally join the room by consuming the seat reservation
	// 	this.consumeSeatReservation(requestResponse.output.seatReservation.room, requestResponse.output.seatReservation.sessionId);
	// }
	// public async consumeSeatReservation(room: Colyseus.RoomAvailable, sessionId: string) {
	// 	try {
	// 		this.Room = await this._client.consumeSeatReservation<RoomState>({ room, sessionId });
	// 		this.onRoomChanged.invoke(this.Room);
	// 		this._currentRoomState = this.Room.state;
	// 		this.joinChatRoom();
	// 		this.registerHandlers();
	// 	} catch (error) {
	// 		console.error(`Error attempting to consume seat reservation - ${error}`);
	// 	}
	// }
	update(deltaTime: number) {
	}
}
