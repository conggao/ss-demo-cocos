import 'minigame-api-typings'
/**
 * 获取当前设备信息
 */
interface DeviceInfo {
    devicePixelRatio: number
    windowWidth: number
    windowHeight: number
}
export function getDeviceInfo(): DeviceInfo {
    let defaultInfo = {
        devicePixelRatio: 2,
        windowWidth: 375,
        windowHeight: 667
    }
    let info = defaultInfo

    if (typeof wx !== 'undefined') {
        try {
            const windowInfo = wx.getWindowInfo();
            info.devicePixelRatio = windowInfo.pixelRatio
            info.windowHeight = windowInfo.windowHeight
            info.windowWidth = windowInfo.windowWidth
        } catch (e) {
            info = defaultInfo
        }
    } else {
        info = defaultInfo;
    }

    return info;
}

/**
 * 给定一个速度和方向，分解成X轴和Y轴方向分别的速度
 * @param { Number } velocity
 * @anle { Number } angle: in radians.
 */
export function velocityDecomposition(velocity, angle) {
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);

    return {
        x: cos * velocity,
        // Y轴坐标系与真实世界相反
        y: -sin * velocity,
    }
}

/**
 * 将弧度换算成角度
 */
export function convertDegree2Radian(deg) {
    return deg * Math.PI / 180;
}

/**
 * 将角度换算成弧度
 */
export function convertRadian2Degree(radian) {
    return radian * 180 / Math.PI;
}

export function getNumInRange(num, min, max) {
    if (num < min)
        return min;

    else if (num > max)
        return max;

    return num;
}

export function none() {
}

export function showTip(title = '', duration = 1500) {
    wx.showToast({
        title,
        icon: 'none',
        duration,
    });
}

export function getDistance(point1, point2) {
    const disX = point1.x - point2.x;
    const disY = point1.y - point2.y;

    return Math.sqrt(disX * disX + disY * disY);
}

export function checkCircleCollision(circle1, circle2) {
    return !!(getDistance(circle1.center, circle2.center) <= (circle1.radius + circle2.radius));
}

export function limitNumInRange(num, min, max) {
    if (num > max) {
        return num - max;
    } else if (num < min) {
        return num + max;
    } else {
        return num;
    }
}

export function getMove(from, to) {
    let dis = to - from;
    if (dis < -180) {
        dis += 360;
    } else if (dis > 180) {
        dis -= 360;
    }

    return dis;
}

