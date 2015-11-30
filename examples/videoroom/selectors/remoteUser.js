import { createSelector } from 'reselect'

const streamFeedSelector = state => state.videoRoom.streamFeed

export default createSelector(
  streamFeedSelector,
  (streamFeed) => {
    return {
      streamFeed
    }
  }
)
