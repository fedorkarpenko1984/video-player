import { FC } from "react"
import { ITimeStamp } from "../../types/ITimeStamp"
import timeStampFormatHelper from "../../helpers/timeStampFormatHelper";
import classes from './TimeStamp.module.css'


interface Props {
  timeStamp: ITimeStamp;
  onClick: (timeStamp: ITimeStamp) => void
}

const TimeStamp: FC<Props> = ({timeStamp, onClick}) => {

  return (
    <button className={classes['time-stamp']} onClick={() => onClick(timeStamp)}>
      { timeStampFormatHelper(timeStamp) }
    </button>
  )
}

export default TimeStamp