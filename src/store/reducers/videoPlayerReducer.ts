import { 
  TVideoPlayerActions,
  IVideoPlayerState,
  TVideoPlayerActionTypes
} from "../types/videoPlayerTypes"

const initialState: IVideoPlayerState = {
  timeStampsData: [],
}

export const videoPlayerReducer = (state: IVideoPlayerState = initialState, action: TVideoPlayerActions) => {
  switch (action.type) {
    case TVideoPlayerActionTypes.SET_TIMESTAMPS_DATA:
      console.log(action.payload)
      return {...state, timeStampsData: [...action.payload]};
    default: return state;
  }
}