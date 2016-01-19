import { createSelector } from 'reselect'

const feedsSelector = state => state.videoRoom.feeds
const connectedSelector = state => state.mcu.connected
const streamSelector = state => {
  const { streamFeed } = state.videoRoom
  return streamFeed && !streamFeed.remote ? streamFeed.stream : null
}

function getFeed(feeds) {
  let result = feeds.filter(feed => !feed.remote)
  return result[0] ? result[0] : null
}

export default createSelector(
  feedsSelector,
  connectedSelector,
  streamSelector,
  (feeds, connected) => {
    const feed = getFeed(feeds)
    const videoRoomLocal = feed ? feed.plugin : null
    const stream = feed ? feed.stream : null
    return {
      feed,
      videoRoomLocal,
      stream,
      connected
    }
  }
)
