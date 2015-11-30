import expect from 'expect'
import {
  ROOM_LOCAL_FEED,
  ROOM_LOCAL_STREAM,
  ROOM_REMOTE_FEED,
  ROOM_REMOTE_STREAM,
  ROOM_REMOVE_FEED,
  AUDIO_DISABLED,
  ATTACH_MCU_ERROR,
  ROOM_EXISTS_ERROR,
  CREATE_ROOM_ERROR,
  ROOM_LOCAL_FEED_ERROR,
  ROOM_REMOTE_FEED_ERROR
} from '../../src/actions/videoRoom'
import { videoRoom } from '../../src/reducers/videoRoom'

const dummyFeed = {
  id: 1,
  plugin: {},
  remote: true,
  stream: {},
  user: {
    name: 'Test'
  }
}

const dummyFeeds = [
  dummyFeed
]

function testError(type) {
  it(`should handle ${type}`, () => {
    const error = {
      type: type,
      message: 'Error message'
    }
    expect(
      videoRoom({}, error)
    ).toEqual({
      error
    })
  })
}

describe('videoRoom reducer', () => {
  it('should handle initial state', () => {
    expect(
      videoRoom(undefined, {})
    ).toEqual({
      feeds: []
    })
  })
  it('should handle ROOM_LOCAL_FEED', () => {
    expect(
      videoRoom({}, {
        type: ROOM_LOCAL_FEED,
        feed: dummyFeed,
        feeds: dummyFeeds
      })
    ).toEqual({
      addedFeed: dummyFeed,
      feeds: dummyFeeds
    })
  })
  it('should handle ROOM_REMOTE_FEED', () => {
    expect(
      videoRoom({}, {
        type: ROOM_REMOTE_FEED,
        feed: dummyFeed,
        feeds: dummyFeeds
      })
    ).toEqual({
      addedFeed: dummyFeed,
      feeds: dummyFeeds
    })
  })
  it('should handle ROOM_LOCAL_STREAM', () => {
    expect(
      videoRoom({}, {
        type: ROOM_LOCAL_STREAM,
        feed: dummyFeed,
        feeds: dummyFeeds
      })
    ).toEqual({
      streamFeed: dummyFeed,
      feeds: dummyFeeds
    })
  })
  it('should handle ROOM_REMOTE_STREAM', () => {
    expect(
      videoRoom({}, {
        type: ROOM_REMOTE_STREAM,
        feed: dummyFeed,
        feeds: dummyFeeds
      })
    ).toEqual({
      streamFeed: dummyFeed,
      feeds: dummyFeeds
    })
  })
  it('should handle ROOM_REMOVE_FEED', () => {
    expect(
      videoRoom({}, {
        type: ROOM_REMOVE_FEED,
        feed: dummyFeed,
        feeds: dummyFeeds
      })
    ).toEqual({
      removedFeed: dummyFeed,
      feeds: dummyFeeds
    })
  })
  it('should handle AUDIO_DISABLED', () => {
    expect(
      videoRoom({}, {
        type: AUDIO_DISABLED
      })
    ).toEqual({
      audioDisabled: true
    })
  })
  testError(ATTACH_MCU_ERROR)
  testError(ROOM_EXISTS_ERROR)
  testError(CREATE_ROOM_ERROR)
  testError(ROOM_LOCAL_FEED_ERROR)
  testError(ROOM_REMOTE_FEED_ERROR)
})
