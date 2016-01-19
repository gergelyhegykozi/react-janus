import { createSelector } from 'reselect'

const streamFeedSelector = state => state.videoRoom.streamFeed
const streamSelector = state => {
  const { streamFeed } = state.videoRoom
  return streamFeed ? streamFeed.stream : null
}

export default createSelector(
  streamFeedSelector,
  streamSelector,
  (streamFeed, stream) => {
    return {
      streamFeed,
      stream  
    }
  }
)
