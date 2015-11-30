import React, { Component, PropTypes } from 'react'

//Material
import {
  IconButton,
  Styles
} from 'material-ui'
const { Colors, Spacing } = Styles

//Icons
import Mic from '../icons/av/mic'
import MicOff from '../icons/av/mic-off'

class UserMic extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mic: false
    }
  }

  getStyles() {
    return {
      toolbarButton: {
        width: 72,
        height: 72
      },
      toolbarIcon: {
        fill: Colors.white,
        width: 36,
        height: 36
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { videoRoomLocal } = nextProps
    const { mic } = this.state
    if(nextProps.stream !== this.props.stream) {
      if(mic) {
        videoRoomLocal.unmuteAudio()
      } else {
        videoRoomLocal.muteAudio()
      }
    }
  }

  toggle() {
    let { mic } = this.state
    const { videoRoomLocal } = this.props
    mic = !mic
    if(!mic) {
      videoRoomLocal.muteAudio()
    } else {
      videoRoomLocal.unmuteAudio()
    }
    this.setState({
      mic
    })
  }

  render() {
    const styles = this.getStyles()
    return (
      <IconButton onClick={this.toggle.bind(this)} style={styles.toolbarButton} iconStyle={styles.toolbarIcon}>
        { this.state.mic ? (
          <Mic/>
        ) : (
          <MicOff/>
        ) }
      </IconButton>
    )
  }
}

UserMic.propTypes = {
  videoRoomLocal: PropTypes.object,
  stream: PropTypes.object
}

export default UserMic
