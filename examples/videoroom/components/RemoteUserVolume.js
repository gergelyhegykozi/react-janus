import React, { Component, PropTypes } from 'react'

//Material
import {
  IconButton,
  Styles
} from 'material-ui'
const { Colors, Spacing } = Styles

//Icons
import VolumeUp from '../icons/av/volume-up'
import VolumeOff from '../icons/av/volume-off'

class RemoteUserVolume extends Component {
  constructor(props) {
    super(props)
    this.state = {
      volume: true
    }
  }

  getStyles() {
    return {
      icon: {
        fill: Colors.white
      }
    }
  }

  toggle() {
    let { volume } = this.state
    volume = !volume
    this.setState({
      volume
    })
    this.props.onToggle(volume)
  }

  render() {
    const styles = this.getStyles()
    const { volume } = this.state
    return (
      <IconButton onClick={this.toggle.bind(this)} iconStyle={styles.icon}>
        {volume ? (
          <VolumeUp/>
        ) : (
          <VolumeOff/>
        )}
      </IconButton>
    )
  }
}

RemoteUserVolume.propTypes = {
  onToggle: PropTypes.func.isRequired
}

export default RemoteUserVolume
