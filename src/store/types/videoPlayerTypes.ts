import { ITimeStamp } from "../../types/ITimeStamp"

export interface IVideoPlayerState {
  timeStampsData: ITimeStamp[]
}

export enum TVideoPlayerActionTypes {
  SET_TIMESTAMPS_DATA = 'SET_TIMESTAMPS_DATA'
}

export interface ISetTimeStampsDataAction {
  type: TVideoPlayerActionTypes.SET_TIMESTAMPS_DATA,
  payload: ITimeStamp[]
}

export type TVideoPlayerActions = ISetTimeStampsDataAction