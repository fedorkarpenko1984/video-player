import { ITimeStamp } from "../../types/ITimeStamp"
import { 
  TVideoPlayerActionTypes
} from "../types/videoPlayerTypes"

export const setTimeStampsDataActionCreator = (data: ITimeStamp[]) => {
  return {
    type: TVideoPlayerActionTypes.SET_TIMESTAMPS_DATA,
    payload: data
  }
}
