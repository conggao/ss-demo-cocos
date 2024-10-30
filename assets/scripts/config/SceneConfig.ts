import databus from "../managers/databus";

export default {
    "1-1": "1-2",
    "1-2": "1-1",
    "1-3": "2-1",
    "1-4": "1-1",
    "2-1": "1-3",
    "2-2": "3-3",
}

/**
 * 初始化门穿梭配置
 * 生成一个楼层和房间的门配置，其中每层楼只有一个门可以通往下一层，其余的门留在当前层。
 * 如果生成的to已经存在于配置中，代码会尝试重新生成
 * @param rowNum 层高
 * @param clomnNum 每层多少房间
 */
export const genDoorConfig = (floors: number = databus.floors, roomsPerFloor: number = databus.roomsPerFloor) => {
    let config = {};
    const roomConfig = []
    for (let room = 1; room <= roomsPerFloor; room++) {
        roomConfig.push(room)
    }

    let nextRoomIdxTmp
    for (let floor = 1; floor <= floors; floor++) {
        let hadPre = false
        let hadNext = false
        let roomTmp = JSON.parse(JSON.stringify(roomConfig))
        // 随机一个门是通往下一层的
        let nextRoomIdx = 0
        nextRoomIdx = Math.floor(Math.random() * (roomsPerFloor - 1)) + 1
        while (nextRoomIdx === nextRoomIdxTmp) {
            nextRoomIdx = Math.floor(Math.random() * (roomsPerFloor - 1)) + 1
        }
        console.log('层数:' + floor + ',随机房间:' + nextRoomIdx);
        var index = roomTmp.indexOf(nextRoomIdx);
        if (index !== -1) {
            roomTmp.splice(index, 1);
        }
        for (let room = 1; room <= roomsPerFloor; room++) {
            let from = `${floor}-${room}`;
            let to;
            var index = roomTmp.indexOf(room);
            if (index !== -1) {
                roomTmp.splice(index, 1);
            }
            if (config[from]) {
                continue
            }

            // 每层楼只有一个门可以通往下一层
            if (floor < floors && !hadNext && nextRoomIdx === room) {
                // 当前房间的门通往下一层的随机一个门
                to = genTo(floor, roomTmp, false);
                nextRoomIdxTmp = parseInt(to.split('-')[1])
                hadNext = true
            } else if (floor === floors && nextRoomIdx === room) {
                // 最后一层楼
                to = `${floor + 1}-1`;
            } else {
                // 当前房间的门留在当前层
                to = genTo(floor, roomTmp, true)
                let isGen = false
                while (roomTmp.length > 0) {
                    if (config[to]) {
                        // 删除已存在配置中的项
                        var index = roomTmp.indexOf(parseInt(to.split('-')[1]));
                        if (index !== -1) {
                            roomTmp.splice(index, 1);
                        }
                        to = genTo(floor, roomTmp, true)
                    } else {
                        isGen = true
                        break
                    }
                }
                if (!isGen) {
                    to = null
                }
            }

            // 确保两个方向的门都是互通的
            if (from) {
                config[from] = to;
            }
            if (to) {
                config[to] = from;
            }
        }
    }
    console.log('门配置:', config);
    return config;
}

const genTo = (floor, roomTmp, isSame) => {
    const roomRandom = Math.floor(Math.random() * (roomTmp.length - 1))
    const to = `${isSame ? floor : floor + 1}-${roomTmp[roomRandom]}`;
    return to
}