import { FC } from 'react'
import classes from './Loader.module.css'

const Loader: FC = () => {
  return (
    <div className={classes['loader-wrapper']}>
      <div className={classes['loader']}>
        <div className={classes['loader-item']}></div>
        <div className={classes['loader-item']}></div>
        <div className={classes['loader-item']}></div>
      </div>
    </div>
  )
}

export default Loader