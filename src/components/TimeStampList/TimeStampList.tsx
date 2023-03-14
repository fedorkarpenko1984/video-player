import TimeStamp from "../../ui/TimeStamp/TimeStamp"
import { ITimeStamp } from "../../types/ITimeStamp"
import { FC, useEffect, useRef, useState } from "react"
import classes from './TimeStampList.module.css'

interface Props {
  timeStampList: ITimeStamp[];
  videoHeight: number;
  newTimeStampHandler: (timeStamp: ITimeStamp) => void;
}

const TimeStampList: FC<Props> = ({timeStampList, videoHeight, newTimeStampHandler}) => {

  const [newTimeStamp, setNewTimeStamp] = useState<ITimeStamp | null>(null)
  const stampList = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const list = stampList.current!
    list.style.height = videoHeight - 16 + 'px'
  }, [videoHeight])

  return (
    <div ref={stampList} className={classes['time-stamp-list']}>
      {
        timeStampList.map(timeStamp => {
          return (
            <TimeStamp
              key={timeStamp.timestamp    }
              timeStamp={timeStamp}
              onClick={newTimeStampHandler}
            /> 
          )
        })
      }
    </div>
  )
}

export default TimeStampList