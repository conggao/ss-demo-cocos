import { PhysicsSystem, _decorator } from 'cc';

/**
 * 物理分组定义
 */
export class PhysicsGroup {

    static readonly Default = PhysicsSystem.PhysicsGroup.DEFAULT;

    static readonly Player = 1 << 1;

    static readonly Door = 1 << 2;

    static readonly Enemy = 1 << 3;

    static isHurtable(srcGroup: number, destGroup: number): boolean {

        // 敌人可以抓玩家
        if (srcGroup == this.Enemy) {
            return destGroup == this.Player;
        }

        return false;
    }
}

