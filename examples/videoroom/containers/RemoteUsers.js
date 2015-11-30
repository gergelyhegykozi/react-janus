import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

//Material
import {
  IconButton,
  GridList,
  GridTile,
  Styles
} from 'material-ui'
const { Colors, Spacing } = Styles

//Selector
import selector from '../selectors/remoteUsers'

//Containers
import RemoteUser from './RemoteUser'

class RemoteUsers extends Component {
  constructor(props) {
    super(props)
  }

  getStyles() {
    return {
      list: {
        overflowY: 'auto'
      }
    }
  }

  render() {
    const styles = this.getStyles()
    const { feeds } = this.props
    return (
      <GridList
        style={styles.list}
        cellHeight={200}>
        { feeds.map((feed, key) => <RemoteUser key={key} feed={feed} />) }
      </GridList>
    )
  }
}

RemoteUsers.propTypes = {
  feeds: PropTypes.array
}

export default connect(selector)(RemoteUsers)
