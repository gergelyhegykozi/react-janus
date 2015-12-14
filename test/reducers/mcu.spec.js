import expect from 'expect'
import {
  CREATE_SESSION,
  CREATE_SESSION_SUCCESS,
  CREATE_SESSION_ERROR
} from '../../src/actions/mcu'
import { config, mcu } from '../../src/reducers/mcu'

function dummyFunction() {}
let dummyInstance = new dummyFunction()

describe('config reducer', () => {
  it('should handle initial state', () => {
    expect(
      config(undefined, {})
    ).toEqual({})
  })
  it('should handle CREATE_SESSION', () => {
    let config1 = {
      janus: 'http://localhost:8080',
      publishers: 1,
      user: {
        id: 1234,
        name: 'Test1'
      },
      room: {
        room: 253,
        //If we want to create the room automatically
        request: 'create',
        fir_freq: 10,
        secret: 'test',
        description: 'Video room',
        bitrate: 128000
      }
    }
    expect(
      config({}, {
        type: CREATE_SESSION,
        config: config1
      })
    ).toEqual(config1)
  })
})
describe('mcu reducer', () => {
  it('should handle initial state', () => {
    expect(
      mcu(undefined, {})
    ).toEqual({})
  })
  it('should handle CREATE_SESSION_SUCCESS', () => {
    expect(
      mcu({}, {
        type: CREATE_SESSION_SUCCESS,
        janus: dummyInstance
      })
    ).toEqual({
      janus: dummyInstance,
      connected: true
    })
  })
  it('should handle CREATE_SESSION_ERROR', () => {
    const error = {
      type: CREATE_SESSION_ERROR,
      message: 'Error message'
    }
    expect(
      mcu({}, error)
    ).toEqual({
      error,
      connected: false
    })
  })
})
