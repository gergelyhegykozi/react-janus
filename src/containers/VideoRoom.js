import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
  CREATE_SESSION_ERROR,
  createSession
} from '../actions/mcu'
import {
  ROOM_ICE_ERROR,
  attachLocalFeed,
  publishLocalFeed,
  reset
} from '../actions/videoRoom'

class VideoRoom extends Component {
  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = nextProps
    //Attach local plugin
    if(nextProps.janusInstance !== this.props.janusInstance) {
      dispatch(attachLocalFeed())
    }
    //Join to the room
    if(nextProps.addedFeed !== this.props.addedFeed) {
      //Publish local feed
      if(!nextProps.addedFeed.remote) {
        dispatch(publishLocalFeed(true))
      }
    }
    //Retry
    if(nextProps.error !== this.props.error) {
      if(
        nextProps.error.type === CREATE_SESSION_ERROR ||
        nextProps.error.type === ROOM_ICE_ERROR
      ) {
        this.props.janusInstance.destroy({
          success: () => {
            reset()
            setTimeout(this.initMcu.bind(this), this.props.retry.countdown)
          }.bind(this)
        })
      }
    }
  }

  initMcu() {
    const {
      dispatch,
      room,
      user,
      janus,
      publishers,
      retry
    } = this.props
    dispatch(createSession({
      room,
      user,
      janus,
      publishers,
      retry
    }))
  }

  componentDidMount() {
    this.initMcu()
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

VideoRoom.propTypes = {
  room: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  janus: PropTypes.object.isRequired,
  publishers: PropTypes.number.isRequired,
  retry: PropTypes.object,
  janusInstance: PropTypes.object,
  addefFeed: PropTypes.object,
  error: PropTypes.object
}

function selector(state) {
  const {
    janus: janusInstance
  } = state.mcu
  const {
    addedFeed
  } = state.videoRoom
  const error = state.mcu.error || state.videoRoom.error || null
  return Object.assign({
    janusInstance,
    addedFeed,
    retry: {
      countdown: 5000
    },
    error
  }, state.config)
}

export default connect(selector)(VideoRoom)
