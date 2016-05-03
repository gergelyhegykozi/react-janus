# react-janus
React - Redux based wrapper for Janus
# Installation
```
npm install react-janus --save
```
# Providers
## Mcu
| Option | Type | Default | Description |
| --- | ---| --- | --- |
| reducers | array | `[]` | Additional reducers |
| middlewares | array | `[]` | Additional middlewares |
# Containers
## VideoRoom
| Option | Type | Default | Description |
| --- | ---| --- | --- |
| room | RoomConfig | *required* | Janus room config |
| user | JanusUser | *required* | Current user's object (id required) |
| janus | JanusConfig | *required* | Janus server config |
| publishers | number | *required* | Room size |
| retry | Retry | `{ countdown: 5000 }` | Reconnection config |
| autoPublish | boolean | false | Publish the current stream after the initialization |
| debug | boolean | false | Debug janus |
# Actions
## videoRoomActions
#### publishLocalFeed(audio[boolean | audioConstraint], video[boolean | videoConstraint])
#### ATTACH_MCU_ERROR
#### ROOM_EXISTS_ERROR
#### CREATE_ROOM_ERROR
#### AUDIO_DISABLED
#### ROOM_LOCAL_FEED
#### ROOM_LOCAL_FEED_ERROR
#### ROOM_LOCAL_STREAM
#### ROOM_REMOTE_FEED
#### ROOM_REMOTE_FEED_ERROR
#### ROOM_REMOTE_STREAM
#### ROOM_REMOVE_FEED
#### ROOM_DESTROYED
#### ROOM_ICE_ERROR
# Reducers
## janusReducers
