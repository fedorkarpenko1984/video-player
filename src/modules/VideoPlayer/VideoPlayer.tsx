import { FC, useEffect, useRef, useState, MouseEvent, LegacyRef } from 'react'
import { ITimeStamp } from '../../types/ITimeStamp'
import { ISelectedArea } from '../../types/ISelectedArea'
import TimeStampList from '../../components/TimeStampList/TimeStampList'
import Loader from '../../ui/Loader/Loader'
import classes from './VideoPlayer.module.css'
import createSelectedAreaHelper from '../../helpers/createSelectedAreaHelper'
import checkAvaliabiltyHelper from '../../helpers/checkAvaliabiltyHelper'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import store from '../../store'
import { setTimeStampsDataActionCreator } from '../../store/actions/videoPlayerAction'

interface Props {
  timeStampsDataUrl: string;
  videoUrl: string;
}

const VideoPlayer: FC<Props> = ({ timeStampsDataUrl, videoUrl }) => {

  const dispatch = useDispatch()
  const timeStampsData = useSelector((state: ReturnType<typeof store.getState>) => state.video.timeStampsData)

  const [renderLoopId, setRenderLoopId] = useState<ReturnType<typeof setInterval> | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false)
  const [isReadyToRendering, setIsReadyToRendering] = useState<boolean>(false)
  const [videoHeight, setVideoHeight] = useState<number>(0)
  const [renderCurrentTimeStamps, setRenderCurrentTimeStamps] = useState<ITimeStamp[]>([])
  const [selectedAreas, setSelectedAreas] = useState<ISelectedArea[]>([])
  const [cursorHideHandlerDelay, setCursorHandlerDelay] = useState<ReturnType<typeof setTimeout>>(-1)

  const videoPlayer = useRef<HTMLDivElement | null>(null)
  const videoTag = useRef<HTMLVideoElement | null>(null)
  const progressBarWrapperTag = useRef<HTMLDivElement | null>(null)
  const progressBarTag = useRef<HTMLDivElement | null>(null)
  const timeStampListWrapperTag = useRef<HTMLDivElement | null>(null)
  const selectedAreasScreen = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const video = videoTag.current!
    video.addEventListener('loadedmetadata', () => {
      setIsVideoLoaded(true)
      const player = videoPlayer.current!
      const progressBarWrapper = progressBarWrapperTag.current!
      player.style.width = video.videoWidth + 'px'
      player.style.height = video.videoHeight + 'px'
      progressBarWrapper.style.width = video.videoWidth + 'px'
      setVideoHeight(video.videoHeight)
    })
  }, [])

  useEffect(() => {
    console.log('start')
    fetch(timeStampsDataUrl)
      .then(response => response.json())
      .then(result => {
        result.sort((current: ITimeStamp, next: ITimeStamp) => {
          return (current.timestamp - next.timestamp)
        })
        console.log(result)
        dispatch(setTimeStampsDataActionCreator(result))
      })
  }, [])


  // одна итерация рендера прогрессбара и выделенных областей 
  function renderIteration(): void {

    const video = videoTag.current!
    const progressBar = progressBarTag.current!

    const newTime = video.currentTime
    console.log('newTime', newTime)
    // анимация прогресс бара
    let newPoint = Math.floor(newTime / (video.duration / 1260))
    if (!newPoint) newPoint = 1
    if  (newPoint > 1260) newPoint = 1260
    progressBar.style.width = newPoint + 'px'

    // *****
    const newTimeStamps: ITimeStamp[] = timeStampsData!.filter(timeStamp => {
      
      const startTime = timeStamp.timestamp / 1000
      const finishTime = startTime + timeStamp.duration / 1000
      if (startTime <= newTime && finishTime >= newTime) return timeStamp 
    })
    // убираем неактуальные выделенные области
    if (newTimeStamps.length !== 0) {
      
      renderCurrentTimeStamps!.forEach(currentStamp => {
        if (!checkAvaliabiltyHelper(newTimeStamps, currentStamp)) {
          const areaForDeleteInd = selectedAreas.findIndex(area => area.id === currentStamp.id)
          if (areaForDeleteInd >= 0) {
            selectedAreas[areaForDeleteInd].area.remove()
            selectedAreas.splice(areaForDeleteInd, 1)
          }

          const stampForDeleteInd = renderCurrentTimeStamps.findIndex(stamp => stamp.id === currentStamp.id)
          if (stampForDeleteInd > 0) {
            setRenderCurrentTimeStamps(prev => [
                ...prev.slice(0, stampForDeleteInd),
                ...prev.slice(stampForDeleteInd + 1)
              ]
            )
          }
        }
      })
    } else {
      selectedAreas.forEach(area => area.area.remove())
      setSelectedAreas([])
      setRenderCurrentTimeStamps([])
    }

    // добавляем новые выделенные области
    if (newTimeStamps.length !== 0) {
      newTimeStamps.forEach(stamp => {
        if (!checkAvaliabiltyHelper(renderCurrentTimeStamps, stamp)) {
          const newArea = createSelectedAreaHelper(stamp)
          selectedAreasScreen.current!.append(newArea.area)
          selectedAreas.push(newArea)
          setRenderCurrentTimeStamps(p => [...p, stamp])
        }
      })
    }
  }


  useEffect(() => {
    if (timeStampsData.length > 0 && isVideoLoaded) setIsReadyToRendering(true)
  }, [timeStampsData, isVideoLoaded])

  useEffect(() => {
    return () => {
      clearInterval(renderLoopId!)
    }
  }, [])

  function progressBarToggleHandler(event: MouseEvent) {
    const bar = progressBarTag.current!
    let newBarWidth = event.pageX - bar.getBoundingClientRect().x
    if (newBarWidth < 0) newBarWidth = 1
    if (newBarWidth > 1260) newBarWidth = 1260
    const video = videoTag.current!
    const newTime = Math.round(video.duration / 1260 * newBarWidth * 1000) / 1000
    video.currentTime = newTime
    bar.style.width = newBarWidth + 'px'
    if (!isPlaying) renderIteration()
  }

  function playPauseVideoHandler() {
    const video = videoTag.current!
    if (!isPlaying) {
      video.play()
      setRenderLoopId(
        setInterval(() => renderIteration(), 20)
      )     
    } else {
      video.pause()
      renderIteration() 
      clearInterval(renderLoopId!)
      setRenderLoopId(null)
    }
    renderIteration()
    setIsPlaying(prev => !prev)
  }

  function newTimeStampHandler(timestamp: ITimeStamp): void {
    const video = videoTag.current!
    video.currentTime = timestamp.timestamp / 1000
    if (!isPlaying) renderIteration()
  }

  function cursorHideHandler() {
    const screen = selectedAreasScreen.current!
    const bar = progressBarWrapperTag.current!
    const list = timeStampListWrapperTag.current!

    screen.style.cursor = 'default'
    list.style.right = 0 + 'px'
    bar.style.bottom = 0 + 'px'
    
    if (cursorHideHandlerDelay !== -1) {
      clearTimeout(cursorHideHandlerDelay)
    }
    setCursorHandlerDelay(
      setTimeout(() => {
        screen.style.cursor = 'none'
        list.style.right = `-${list.clientWidth + 10}px`
        bar.style.bottom = '-20px'
      }, 3000)
    )
  }

  return (
    <div ref={videoPlayer} className={classes['video-player']}>
      {
        !isReadyToRendering && <Loader />
      }
      <video
        ref={videoTag}
        src={videoUrl} />
      <div
        ref={selectedAreasScreen}
        className={classes['selected-areas-screen']}
        onClick={() => playPauseVideoHandler()}
        onMouseMove={cursorHideHandler}
      ></div>
      <div
        ref={progressBarWrapperTag}
        className={classes['progress-bar-wrapper']}
        onClick={event => progressBarToggleHandler(event)}
      >
        <div ref={progressBarTag} className={classes['progress-bar']} />
      </div>
      <div ref={timeStampListWrapperTag} className={classes["time-stamp-list-wrapper"]}>
        <TimeStampList
          timeStampList={timeStampsData ? timeStampsData : []}
          newTimeStampHandler={newTimeStampHandler}
          videoHeight={videoHeight}
        />
      </div>
    </div>
  )
}

export default VideoPlayer