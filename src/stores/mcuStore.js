import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import mcuReducer from '../reducers/mcu'
import videoRoomReducer from '../reducers/videoRoom'

export default function mcuStore(reducers = [], middlewares = []) {
  const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware,
    ...middlewares
  )(createStore)
  const reducer = combineReducers(Object.assign({},
    mcuReducer,
    videoRoomReducer,
    ...reducers
  ))
  return createStoreWithMiddleware(reducer)
}
