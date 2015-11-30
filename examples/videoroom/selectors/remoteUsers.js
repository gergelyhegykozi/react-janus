import { createSelector } from 'reselect'

const feedsSelector = state => state.videoRoom.feeds

export default createSelector(
  feedsSelector,
  (feeds) => {
    return {
      feeds: feeds.filter(feed => feed.remote)
    }
  }
)
