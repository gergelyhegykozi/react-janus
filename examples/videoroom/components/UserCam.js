import PropTypes from 'prop-types';
import React, { Component } from 'react'

//Material
import {
  IconButton,
  Styles
} from 'material-ui'
const { Colors, Spacing } = Styles

//Icons
import Videocam from '../icons/av/videocam'
import VideocamOff from '../icons/av/videocam-off'

class UserCam extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cam: false
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
    const { cam } = this.state
    if(nextProps.stream !== this.props.stream) {
      if(cam) {
        videoRoomLocal.unmuteVideo()
      } else {
        videoRoomLocal.muteVideo()
      }
    }
  }

  toggle() {
    let { cam } = this.state
    const { videoRoomLocal, stream } = this.props
    cam = !cam
    if(!cam) {
      videoRoomLocal.muteVideo()
    } else {
      videoRoomLocal.unmuteVideo()
    }
    this.setState({
      cam
    })
    this.props.onToggle(cam)
  }

  render() {
    const styles = this.getStyles()
    return (
      <IconButton onClick={this.toggle.bind(this)} style={styles.toolbarButton} iconStyle={styles.toolbarIcon}>
        { this.state.cam ? (
          <Videocam/>
        ) : (
          <VideocamOff/>
        ) }
      </IconButton>
    )
  }
}

UserCam.propTypes = {
  videoRoomLocal: PropTypes.object,
  stream: PropTypes.object
}

export default UserCam
