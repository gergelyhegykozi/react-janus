import Janus from '../utils/janus'

export const CREATE_SESSION = 'CREATE_SESSION'
export const CREATE_SESSION_SUCCESS = 'CREATE_SESSION_SUCCESS'
export const CREATE_SESSION_ERROR = 'CREATE_SESSION_ERROR'

export function createSession(config) {
  console.log('MODULE -> reducer -> mcu ', config)
  return (dispatch, getState) => {
    Janus.init({debug: !!config.debug})
    let janus = new Janus(Object.assign({}, config.janus, {
      success: () => {
        dispatch({
          type: CREATE_SESSION_SUCCESS,
          janus
        })     
      },
      error: (error) => {
        dispatch({
          type: CREATE_SESSION_ERROR,
          message: error
        })
      }
    }))
    dispatch({
      type: CREATE_SESSION,
      config
    })
  }
}
