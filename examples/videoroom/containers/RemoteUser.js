import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

//Material
import {
  IconButton,
  GridTile,
  Styles
} from 'material-ui'
const { Colors, Spacing } = Styles

//Selector
import selector from '../selectors/remoteUser'

//Components
import RemoteUserVolume from '../components/RemoteUserVolume'

class RemoteUser extends Component {
  constructor(props) {
    super(props)
  }

  getStyles() {
    return {
      tile: {
        backgroundColor: Colors.grey300
      },
      video: {
        display: 'inline-block',
        verticalAlign: 'top',
        width: '100%',
        height: `calc(100% - ${Spacing.desktopSubheaderHeight}px)`
      }
    }
  }

  shouldComponentUpdate(nextProps) {
    const { feed, streamFeed } = nextProps 
    return streamFeed.user.id === feed.user.id
  }

  componentDidUpdate() {
    const { feed } = this.props
    if(feed && feed.stream) {
      const { stream } = feed
      const video = ReactDOM.findDOMNode(this).querySelector('video')
      attachMediaStream(video, stream)
    }
  }

  toggleVolume(volume) {
    const video = ReactDOM.findDOMNode(this).querySelector('video')
    video.volume = volume ? 1 : 0
  }

  render() {
    const styles = this.getStyles()
    const { feed } = this.props
    let stream = null
    if(feed.stream) {
      stream = feed.stream
    }
    return (
      <GridTile
        style={styles.tile}
        title={feed.user.name}
        actionIcon={
          stream ? <RemoteUserVolume onToggle={this.toggleVolume.bind(this)}/> : null     
        }>
        <video style={styles.video} autoPlay="true"></video>
      </GridTile>
    )
  }
}

RemoteUser.propTypes = {
  feed: PropTypes.object.isRequired,
  streamFeed: PropTypes.object
}

export default connect(selector)(RemoteUser)
