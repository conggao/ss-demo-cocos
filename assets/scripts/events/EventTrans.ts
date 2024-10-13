import { EventTarget } from "cc";
export class EventTrans {
    private static _instance: EventTarget = new EventTarget();
    static get instance(): EventTarget {
        return this._instance;
    }
}