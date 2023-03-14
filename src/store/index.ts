import { applyMiddleware, combineReducers, createStore } from 'redux'
import { videoPlayerReducer } from './reducers/videoPlayerReducer'
import createSagaMiddleware from '@redux-saga/core'

const rootReducer = combineReducers({
  video: videoPlayerReducer
})

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
)

export default store
