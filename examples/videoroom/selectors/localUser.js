import { createSelector } from 'reselect'

const feedsSelector = state => state.videoRoom.feeds
const connectedSelector = state => state.mcu.connected

function getFeed(feeds) {
  let result = feeds.filter(feed => !feed.remote)
  return result[0] ? result[0] : null
}

export default createSelector(
  feedsSelector,
  connectedSelector,
  (feeds, connected) => {
    const feed = getFeed(feeds)
    const videoRoomLocal = feed ? feed.plugin : null
    const stream = feed ? feed.stream : null
    return {
      feed,
      videoRoomLocal,
      connected
    }
  }
)
