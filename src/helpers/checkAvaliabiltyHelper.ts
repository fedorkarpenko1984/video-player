import { ITimeStamp } from "../types/ITimeStamp"

export default (array: ITimeStamp[], timeStamp: ITimeStamp): boolean => {
    return array.findIndex(item => item.id === timeStamp.id) > 0
  }