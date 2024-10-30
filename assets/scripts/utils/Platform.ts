import { sys } from "cc";

export function isWxPlatform() {
    let isWxPlatform = false;
    // 判断小游戏运行的平台
    switch (sys.platform) {
        case sys.Platform.WECHAT_GAME:
            isWxPlatform = true;
            break;
        case sys.Platform.BAIDU_MINI_GAME:
            console.log('游戏运行在百度小游戏平台上');
            break;
        default:
            console.log('游戏不是运行在小游戏平台上');
    }
    return isWxPlatform
}