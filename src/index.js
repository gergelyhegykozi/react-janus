import React from 'react'
import { render } from 'react-dom'
import Mcu from './providers/Mcu'
import VideoRoom from './containers/VideoRoom'
import * as videoRoomActions from './actions/videoRoom'
import adapter from './utils/adapter'
import mcuReducer from './reducers/mcu'
import videoRoomReducer from './reducers/videoRoom'

Object.assign(window, adapter);

export default {
  Mcu,
  VideoRoom,
  videoRoomActions,
  janusReducers: [
    mcuReducer,
    videoRoomReducer
  ]
}
