import Janus from '../utils/janus'

export const ATTACH_MCU_ERROR = 'ATTACH_MCU_ERROR'
export const ROOM_EXISTS_ERROR = 'ROOM_EXISTS_ERROR'
export const CREATE_ROOM_ERROR = 'CREATE_ROOM_ERROR'
export const AUDIO_DISABLED = 'AUDIO_DISABLED'
export const ROOM_LOCAL_FEED = 'ROOM_LOCAL_FEED'
export const ROOM_LOCAL_FEED_ERROR = 'ROOM_LOCAL_FEED_ERROR'
export const ROOM_LOCAL_STREAM = 'ROOM_LOCAL_STREAM'
export const ROOM_REMOTE_FEED = 'ROOM_REMOTE_FEED'
export const ROOM_REMOTE_FEED_ERROR = 'ROOM_REMOTE_FEED_ERROR'
export const ROOM_REMOTE_STREAM = 'ROOM_REMOTE_STREAM'
export const ROOM_REMOVE_FEED = 'ROOM_REMOVE_FEED'
export const ROOM_DESTROYED = 'ROOM_DESTROYED'
export const ROOM_ICE_ERROR = 'ROOM_ICE_ERROR'
export const ROOM_LOCAL_DATA = 'ROOM_LOCAL_DATA'
export const ROOM_LOCAL_DATA_ERROR = 'ROOM_LOCAL_DATA_ERROR'
export const ROOM_REMOTE_DATA = 'ROOM_REMOTE_DATA'
export const ROOM_DATA_OPEN = 'ROOM_DATA_OPEN'

let feeds = []
let dataSupport = false
let mypvtid = null
let opaqueId = 'videoroom-' + Janus.randomString(12)

export function setDataSupport(_dataSupport) {
  dataSupport = !!_dataSupport
}

export function reset() {
  feeds = []
}

function isRoomExists(dispatch, getState, videoRoomLocal) {
  const { room } = getState().janusConfig
  return new Promise((resolve, reject) => {
    videoRoomLocal.send({
      message: {
        request: 'exists',
        room: room.room
      },
      success: (result) => {
        // Backward compatibility
        if(result.exists && result.exists !== 'false') {
          resolve()   
        } else {
          reject()   
        }
      },
      error: (error) => {
        dispatch({
          type: ROOM_EXISTS_ERROR,
          message: error
        })
      }
    })
  })
}

function createRoom(dispatch, getState, videoRoomLocal) {
  const { room, publishers } = getState().janusConfig

  console.log('MODULE -> create room-> FEED', getState().janusConfig)
  console.log('MODULE -> create room -> VIDEOROOMLOCAL', videoRoomLocal)

  return new Promise((resolve, reject) => {
    videoRoomLocal.send({
      message: Object.assign(room, {
        publishers
      }),
      success: () => {
        resolve();   
      },
      error: (error) => {
        dispatch({
          type: CREATE_ROOM_ERROR,
          message: error
        })
      }
    })
  })
}

// Publisher/manager created, negotiate WebRTC and attach to existing feeds, if any
export function publishLocalFeed(audio, video) {
  return (dispatch, getState) => {
    const {feeds} = getState().videoRoom
    const videoRoomLocal = feeds.filter(feed => !feed.remote)[0].plugin


    console.log('MODULE -> publishLocalFeed -> FEED', feeds.filter(feed => !feed.remote)[0])
    console.log('MODULE -> publishLocalFeed -> VIDEOROOMLOCAL', videoRoomLocal)

    // Publish our stream
    return new Promise((resolve, reject) => {
      videoRoomLocal.createOffer({
        media: {audioRecv: false, videoRecv: false, audioSend: !!audio, videoSend: !!video, audio, video, data: dataSupport},	// Publishers are sendonly
        forced: true,
        success: (jsep) => {
          const publish = {request: 'configure', audio: !!audio, video: !!video}
          videoRoomLocal.send({
            message: publish,
            jsep: jsep,
            success: () => {
              resolve()
            },
            error: (error) => {
              reject(error)
            }
          })
          if (!audio) {
            dispatch({
              type: AUDIO_DISABLED
            })
          }
        },
        error: (message) => {
          // Webrtc error
          if (audio) {
            dispatch(publishLocalFeed(false, video));
          } else {
            reject(message)
            dispatch({
              type: ROOM_LOCAL_FEED_ERROR,
              message
            })
          }
        }
      })
    })
  }
}

export function sendData(data) {
  data = data || null;

  return (dispatch, getState) => {
    const {feeds} = getState().videoRoom
    const videoRoomLocal = feeds.filter(feed => !feed.remote)[0].plugin

    return new Promise((resolve, reject) => {
      videoRoomLocal.data({
        text: JSON.stringify(data),
        success: () => {
          resolve()
          dispatch({
            type: ROOM_LOCAL_DATA,
            data
          })
        },
        error: (message) => {
          reject(message)
          dispatch({
            type: ROOM_LOCAL_DATA_ERROR,
            message
          })
        }
      })
    })
  }
}

function join(videoRoomLocal) {
  return (dispatch, getState) => {
    console.log('MODULE -> JOIN in ', getState(), getState.janusConfig);
    const { room, user } = getState().janusConfig
    const joinToRoom = () => {
      const data = { request: 'join', room: room.room, ptype: 'publisher', display: JSON.stringify(user) }
      videoRoomLocal.send({message: data})
    }
    isRoomExists(dispatch, getState, videoRoomLocal)
    .then(joinToRoom)
    .catch(() => {
      // Create room automatically
      if(room.request && room.request === 'create') {
        createRoom(dispatch, getState, videoRoomLocal)
        .then(joinToRoom)
      }
    })
  }
}

// A new feed has been published, create a new plugin handle and attach to it as a listener
function attachRemoteFeed(id, user) {
  return (dispatch, getState) => {
    const { room, publishers } = getState().janusConfig
    const { janus } = getState().mcu
    let feed = {
      id,
      user,
      remote: true
    }
    janus.attach({
      plugin: "janus.plugin.videoroom",
      opaqueId: opaqueId,
      success: (pluginHandle) => {
        feed.plugin = pluginHandle
        // We wait for the plugin to send us an offer
        const listen = { request: 'join', room: room.room, ptype: 'listener', feed: feed.id, private_id: mypvtid }
        feed.plugin.send({message: listen})
      },
      error: (error) => {
        dispatch({
          type: ATTACH_MCU_ERROR,
          message: error
        })
      },
      onmessage: (msg, jsep) => {
        var event = msg.videoroom
        if(event) {
          if(event === 'attached') {
            // Subscriber created and attached
            // Don't rewrite with itself
            const existedFeed = feeds.filter(_feed => feed.user.id === _feed.user.id)[0]
            if(!existedFeed) {
              feeds.push(feed)
              dispatch({
                type: ROOM_REMOTE_FEED,
                feed,
                feeds: feeds.slice(0)
              })
            }
            // Successfully attached
          } else {
            // What has just happened?
          }
        }
        if(jsep) {
          // Answer and attach
          feed.plugin.createAnswer({
            jsep: jsep,
            // We want recvonly audio/video
            media: { audioSend: false, videoSend: false, data: dataSupport },
            success: (jsep) => {
              const body = { request: 'start', room: room.room }
              feed.plugin.send({message: body, jsep: jsep})
            },
            error: (error) => {
              // Webrtc error
              dispatch({
                type: ROOM_REMOTE_FEED_ERROR,
                message: error
              })
            }
          })
        }
      },
      webrtcState: (on) => {
        Janus.log("Janus says this WebRTC PeerConnection (feed #" + feed.user.id + ") is " + (on ? "up" : "down") + " now")
      },
      ondata: (data) => {
        dispatch({
          type: ROOM_REMOTE_DATA,
          data: JSON.parse(data)
        })
      },
      onlocalstream: (stream) => {
        // The subscriber stream is recvonly, we don't expect anything here
      },
      onremotestream: (stream) => {
        // Use the existed feed
        feeds.forEach((_feed, i) => {
          if(_feed.id === feed.id) {
            feed = Object.assign({}, feed, {
                stream
            })
            feeds[i] = feed;
            dispatch({
              type: ROOM_REMOTE_STREAM,
              feed,
              feeds: feeds.slice(0)
            })
          }
        })
      },
      oncleanup: () => {
      }
    });
  }
}

export function attachLocalFeed(janus) {
  return (dispatch, getState) => {
    const { publishers, user } = getState().janusConfig
    const { janus } = getState().mcu
    const addRemoteFeed = (publishers) => {
      let list = publishers
      for(let f in list) {
        dispatch(attachRemoteFeed(list[f].id, JSON.parse(list[f].display)))
      }
    }
    let feed = {
      user,
      remote: false
    }

    // Attach to video MCU test plugin
    janus.attach({
      plugin: "janus.plugin.videoroom",
      opaqueId: opaqueId,
      success: (pluginHandle) => {
        feed.plugin = pluginHandle
        dispatch(join(feed.plugin))
      },
      error: (error) => {
        dispatch({
          type: ATTACH_MCU_ERROR,
          message: error
        })
      },
      consentDialog: (on) => {
        Janus.debug("Consent dialog should be " + (on ? "on" : "off") + " now")
      },
      mediaState: (medium, on) => {
        Janus.log("Janus " + (on ? "started" : "stopped") + " receiving our " + medium)
      },
      webrtcState: (on) => {
        Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now")
      },
      ondataopen: () => {
        dispatch({
          type: ROOM_DATA_OPEN
        })
      },
      onmessage: (msg, jsep) => {
        let event = msg.videoroom;
        if(event) {
          if(event === 'joined') {
            const { publishers, id, private_id } = msg

            mypvtid = private_id
            feed.id = id
            feeds.push(feed)
              
            // Any new feed to attach to?
            if(publishers) {
              addRemoteFeed(publishers)
            }
            dispatch({
              type: ROOM_LOCAL_FEED,
              feed,
              feeds: feeds.slice(0)
            })
          } else if(event === 'destroyed') {
            // The room has been destroyed
            dispatch({
              type: ROOM_DESTROYED
            })
          } else if(event === 'event') {
            // Any new feed to attach to?
            if(msg.publishers) {
              addRemoteFeed(msg.publishers)
            } else if(msg.leaving) {
              // One of the publishers has gone away?
              let leaving = msg.leaving,
                  removeFeed = feeds.filter(feed => feed.id == leaving)

              //Remove feed
              if(removeFeed[0]) {
                removeFeed = removeFeed[0]
                removeFeed.plugin.detach()
                feeds.splice(feeds.indexOf(removeFeed), 1)
                dispatch({
                  type: ROOM_REMOVE_FEED,
                  feed: removeFeed,
                  feeds: feeds.slice(0)
                })
              }
            } else if(msg.error) {
              //Some other error
            }
          }
        }
        if(jsep) {
          feed.plugin.handleRemoteJsep({jsep: jsep})
        }
      },
      onlocalstream: (stream) => {
        //Local video / audio
        const index = feeds.indexOf(feed);
        feed = Object.assign({}, feed, {
            stream
        })
        feeds[index] = feed;
        dispatch({
          type: ROOM_LOCAL_STREAM,
          feed,
          feeds: feeds.slice(0)
        })
        //Ice state checker
        const { pc } = feed.plugin.webrtcStuff
        if(pc) {
          pc.oniceconnectionstatechange = () => {
            if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
              dispatch({
                type: ROOM_ICE_ERROR,
                message: pc.iceConnectionState
              })
            }
          }
        }
      },
      onremotestream: (stream) => {
        //The publisher stream is sendonly, we don't expect anything here
      },
      oncleanup: () => {
        //Unpublish
      }
    })
  }
}
