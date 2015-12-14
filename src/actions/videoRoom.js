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

let feeds = []

export function reset() {
  feeds = []
}

function isRoomExists(dispatch, getState, videoRoomLocal) {
  const { room } = getState().config
  return new Promise((resolve, reject) => {
    videoRoomLocal.send({
      message: {
        request: 'exists',
        room: room.room
      },
      success: (result) => {
        if(result.exists === 'true') {
          resolve()   
        } else if(result.exists === 'false') {
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
  const { room, publishers } = getState().config
  return new Promise((resolve, reject) => {
    videoRoomLocal.send({
      message: Object.assign(room, {
        publishers
      }),
      success: function(result) {
        resolve();   
      },
      error: function(error) {
        dispatch({
          type: CREATE_ROOM_ERROR,
          message: error
        })
      }
    })
  })
}

// Publisher/manager created, negotiate WebRTC and attach to existing feeds, if any
export function publishLocalFeed(useAudio) {
  return (dispatch, getState) => {
    const { feeds } = getState().videoRoom
    const videoRoomLocal = feeds.filter(feed => !feed.remote)[0].plugin
    // Publish our stream
    videoRoomLocal.createOffer({
      media: { audioRecv: false, videoRecv: false, audioSend: useAudio, videoSend: true },	// Publishers are sendonly
      success: (jsep) => {
        const publish = { request: 'configure', audio: useAudio, video: true }
        videoRoomLocal.send({message: publish, jsep: jsep})
        if(!useAudio) {
          dispatch({
            type: AUDIO_DISABLED
          })
        }
      },
      error: (error) => {
        // Webrtc error
        if(useAudio) {
          dispatch(publishLocalFeed(false));
        } else {
          dispatch({
            type: ROOM_LOCAL_FEED_ERROR,
            message: error
          })
        }
      }
    })
  }
}

function join(videoRoomLocal) {
  return (dispatch, getState) => {
    const { room, user } = getState().config
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
    const { room, publishers } = getState().config
    const { janus } = getState().mcu
    let feed = {
      id,
      user,
      remote: true
    }
    janus.attach({
      plugin: "janus.plugin.videoroom",
      success: (pluginHandle) => {
        feed.plugin = pluginHandle
        // We wait for the plugin to send us an offer
        const listen = { request: 'join', room: room.room, ptype: 'listener', feed: feed.id }
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
            if(feeds.filter(_feed => feed.user.id === _feed.user.id && !_feed.remote)[0]) {
              return
            }
            // Remove the old feed
            const oldFeed = feeds.filter(_feed => feed.user.id === _feed.user.id && _feed.remote)[0]
            if(oldFeed) {
              feeds.splice(feeds.indexOf(oldFeed), 1)
            }
            feeds.push(feed)
            dispatch({
              type: ROOM_REMOTE_FEED,
              feed,
              feeds: feeds.slice(0)
            })
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
            media: { audioSend: false, videoSend: false },
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
      onlocalstream: function(stream) {
        // The subscriber stream is recvonly, we don't expect anything here
      },
      onremotestream: function(stream) {
        feed.stream = stream
        dispatch({
          type: ROOM_REMOTE_STREAM,
          feed,
          feeds: feeds.slice(0)
        })
      },
      oncleanup: function() {
      }
    });
  }
}

export function attachLocalFeed(janus) {
  return (dispatch, getState) => {
    const { publishers, user } = getState().config
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
      },
      onmessage: (msg, jsep) => {
        let event = msg.videoroom;
        if(event) {
          if(event === 'joined') {
            const { publishers, id } = msg
            // Any new feed to attach to?
            if(publishers) {
              addRemoteFeed(publishers)
            }
            feed.id = id
            feeds.push(feed)

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
            } else if(msg.unpublished) {
              // One of the publishers has unpublished?

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
        feed.stream = stream
        dispatch({
          type: ROOM_LOCAL_STREAM,
          feed,
          feeds: feeds.slice(0)
        })
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
