import { FC, useEffect, useState } from 'react'
import VideoPlayer from './modules/VideoPlayer/VideoPlayer'
import { ITimeStamp } from './types/ITimeStamp'

const videoUrl = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
const dataUrl = 'http://www.mocky.io/v2/5e60c5f53300005fcc97bbdd'

const App: FC = () => {

  return (
    <div className='container'>
      <VideoPlayer videoUrl={videoUrl} timeStampsDataUrl={dataUrl} />
    </div>
  )
}

export default App
