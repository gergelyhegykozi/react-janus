import React from 'react'
import adapter from 'webrtc-adapter'
import { render } from 'react-dom'
import Mcu from './providers/Mcu'
import VideoRoom from './containers/VideoRoom'
import * as videoRoomActions from './actions/videoRoom'
import mcuReducer from './reducers/mcu'
import videoRoomReducer from './reducers/videoRoom'
import Janus from './utils/janus'

if(window) {
  window.adapter = adapter;
}

export default {
  Mcu,
  VideoRoom,
  videoRoomActions,
  janusReducers: [
    mcuReducer,
    videoRoomReducer
  ],
  Janus,
}
