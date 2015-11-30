import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

//Material
import {
  Styles
} from 'material-ui'
const { Colors, Spacing } = Styles

//Icons
import Portrait from '../icons/image/portrait'

//Selector
import selector from '../selectors/localUser'

//Components
import UserMic from '../components/UserMic'
import UserCam from '../components/UserCam'

class LocalUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cam: false
    }
  }

  getStyles() {
    return {
      videoWrapper: {
        display: 'inline-block',
        verticalAlign: 'top',
        position: 'relative',
        width: 72,
        height: 72
      },
      video: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 72,
        height: 72
      },
      portrait: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 72,
        height: 72,
        fill: Colors.white,
        backgroundColor: Colors.teal500
      }
    }
  }

  componentDidUpdate() {
    const { feed } = this.props
    if(feed && feed.stream) {
      const video = ReactDOM.findDOMNode(this).querySelector('video')
      attachMediaStream(video, feed.stream)
      video.muted = 'muted'
    }
  }

  updateCam(cam) {
    this.setState({
      cam
    })
  }

  render() {
    const styles = this.getStyles()
    const { feed, videoRoomLocal } = this.props
    let stream = null
    if(feed && feed.stream) {
      stream = feed.stream
    }
    return (
      <div>
        <UserMic
          stream={stream}
          videoRoomLocal={videoRoomLocal} />
        <div style={styles.videoWrapper}>
          { stream ? (
            <video style={styles.video} autoPlay="true" muted="muted"></video>
          ) : null }
          { !this.state.cam ? (
            <Portrait style={styles.portrait}/>
          ) : null }
        </div>
        <UserCam
          stream={stream}
          videoRoomLocal={videoRoomLocal}
          onToggle={this.updateCam.bind(this)} />
      </div>
    )
  }
}

LocalUser.propTypes = {
  videoRoomLocal: PropTypes.object,
  feed: PropTypes.object
}

export default connect(selector)(LocalUser)
