import {
  ROOM_LOCAL_FEED,
  ROOM_LOCAL_STREAM,
  ROOM_REMOTE_FEED,
  ROOM_REMOTE_STREAM,
  ROOM_REMOVE_FEED,
  AUDIO_DISABLED,
  ATTACH_MCU_ERROR,
  ROOM_EXISTS_ERROR,
  CREATE_ROOM_ERROR,
  ROOM_LOCAL_FEED_ERROR,
  ROOM_REMOTE_FEED_ERROR,
  ROOM_ICE_ERROR
} from '../actions/videoRoom'

function videoRoom(state = {
  feeds: []
}, action) {
  switch(action.type) {
    case ROOM_LOCAL_FEED:
    case ROOM_REMOTE_FEED:
      var { feed, feeds } = action
      return Object.assign({}, state, {
        addedFeed: feed,
        feeds
      })
    case ROOM_LOCAL_STREAM:
    case ROOM_REMOTE_STREAM:
      var { feed, feeds } = action
      return Object.assign({}, state, {
        streamFeed: feed,
        feeds
      })
    case ROOM_REMOVE_FEED:
      var { feed, feeds } = action
      return Object.assign({}, state, {
        removedFeed: feed,
        feeds
      })
    case AUDIO_DISABLED:
      return Object.assign({}, state, {
        audioDisabled: true
      })
    case ATTACH_MCU_ERROR:
    case ROOM_EXISTS_ERROR:
    case CREATE_ROOM_ERROR:
    case ROOM_LOCAL_FEED_ERROR:
    case ROOM_REMOTE_FEED_ERROR:
    case ROOM_ICE_ERROR:
      return Object.assign({}, state, {
        error: action
      })
    default:
      return state
  }
}

export default {
  videoRoom
}
