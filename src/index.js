import React from 'react'
import { render } from 'react-dom'
import Mcu from './providers/Mcu'
import VideoRoom from './containers/VideoRoom'
import adapter from './utils/adapter'

Object.assign(window, adapter);

export default {
  Mcu,
  VideoRoom
}
