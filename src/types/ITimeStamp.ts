import { ISelectedAreaObject } from "./ISlectedAreaObject"

export interface ITimeStamp {
  id: number;
  timestamp: number;
  duration: number;
  zone: ISelectedAreaObject
}
