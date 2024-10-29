import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 虚拟摇杆的输入
 * 避免和 `input` 重名使用 VirtualInput
 */
@ccclass('VirtualInput')
export class VirtualInput {

    private static _horizontal: number = 0;
    private static _vertical: number = 0;
    static get horizontal(): number {
        return this._horizontal;
    }

    static set horizontal(val: number) {
        this._horizontal = val;
    }

    static get vertical(): number {
        return this._vertical;
    }
    static set vertical(val: number) {
        this._vertical = val;
    }
    static reset() {
        this._horizontal = 0
        this._vertical = 0
    }
}

