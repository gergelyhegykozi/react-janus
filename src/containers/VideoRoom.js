import PropTypes from 'prop-types';
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  CREATE_SESSION_ERROR,
  createSession
} from '../actions/mcu'
import {
  ROOM_ICE_ERROR,
  attachLocalFeed,
  publishLocalFeed,
  reset,
  setDataSupport
} from '../actions/videoRoom'

class VideoRoom extends Component {

  componentWillReceiveProps(nextProps) {
    console.log('inside VIDEO ROOM PROPS', nextProps)
    const { dispatch } = nextProps
    //Attach local plugin
    if(nextProps.janusInstance !== this.props.janusInstance) {
      dispatch(attachLocalFeed())
    }
    //Join to the room
    if(nextProps.addedFeed !== this.props.addedFeed) {
      //Publish local feed
      if(!nextProps.addedFeed.remote && !!nextProps.autoPublish) {
        var mediaAsExternalParam = !!nextProps.media;
        var audio = mediaAsExternalParam ? nextProps.media.audio : true;
        var video = mediaAsExternalParam ? nextProps.media.video : true;
        console.log('media from extenal: ', audio, video);
        dispatch(publishLocalFeed(audio, video))
      }
    }
    //Change dataSupport
    if(nextProps.dataSupport !== this.props.dataSupport) {
      setDataSupport(nextProps.dataSupport)
    }
    //Retry
    if(nextProps.error !== this.props.error) {
      if(
        nextProps.error.type === CREATE_SESSION_ERROR ||
        nextProps.error.type === ROOM_ICE_ERROR
      ) {
        if(nextProps.janusInstance) {
          nextProps.janusInstance.destroy({
            success: this.retry.bind(this)
          })
        } else {
          this.retry()
        }
      }
    }
  }

  retry() {
    reset()
    setTimeout(this.initMcu.bind(this), this.props.retry.countdown)
  }

  initMcu() {
    const {
      dispatch,
      room,
      user,
      media,
      janus,
      publishers,
      retry,
      debug
    } = this.props
    dispatch(createSession({
      room,
      user,
      media,
      janus,
      publishers,
      retry,
      debug
    }))
  }

  componentDidMount() {
    setDataSupport(this.props.dataSupport)
    reset()
    this.initMcu()
  }

  componentWillUnmount() {
    if (this.props.janusInstance) {
      this.props.janusInstance.destroy();
    }
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
  media: PropTypes.object,
  janus: PropTypes.object.isRequired,
  publishers: PropTypes.number.isRequired,
  retry: PropTypes.object,
  janusInstance: PropTypes.object,
  addedFeed: PropTypes.object,
  error: PropTypes.object,
  debug: PropTypes.bool,
  autoPublish: PropTypes.bool,
  dataSupport: PropTypes.bool
}

function selector(state) {
  const {
    janus: janusInstance
  } = state.mcu
  const {
    addedFeed
  } = state.videoRoom
  const { media, ...janusConfig } = state.janusConfig
  const error = state.mcu.error || state.videoRoom.error || null
  return Object.assign({
    janusInstance,
    addedFeed,
    retry: {
      countdown: 5000
    },
    error
  }, janusConfig)
}

export default connect(selector)(VideoRoom)
