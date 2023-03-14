import { ITimeStamp } from "../types/ITimeStamp"
import addZeroHelper from "./addZeroHelper"

export default (timeStamp: ITimeStamp): string => {
  const time = timeStamp.timestamp
  const miliseconds = time - Math.floor(time / 1000) * 1000
  let seconds = (time - miliseconds) / 1000
  const minutes = Math.floor(seconds / 60)
  seconds = seconds - minutes * 60
  return `${addZeroHelper(minutes, 2)}:${addZeroHelper(seconds, 2)}:${addZeroHelper(miliseconds, 3)}`
}