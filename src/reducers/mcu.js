import {
  CREATE_SESSION,
  CREATE_SESSION_SUCCESS,
  CREATE_SESSION_ERROR
} from '../actions/mcu'

function janusConfig(state = {}, action) {
  console.log('MODULE -> reducers -> JANUS CONFIG', action);
  switch(action.type) {
    case CREATE_SESSION:
      const { config } = action
      return Object.assign({}, state, config)
    default:
      return state
  }
}

function mcu(state = {}, action) {
  console.log('MODULE -> reducers -> MCU', action);
  switch(action.type) {
    case CREATE_SESSION_SUCCESS:
      const { janus } = action
      return Object.assign({}, state, {
        janus,
        connected: true
      })
    case CREATE_SESSION_ERROR:
      return Object.assign({}, state, {
        error: action,
        connected: false
      })
    default:
      return state
  }
}

export default {
  janusConfig,
  mcu
}
