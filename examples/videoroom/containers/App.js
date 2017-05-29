import PropTypes from 'prop-types';
import React, { Component } from 'react'
import { VideoRoom, Mcu } from 'react-janus'

//Material
import {
  IconButton,
  Paper,
  Styles,
  Mixins,
  Tabs,
  Tab
} from 'material-ui'

const { StylePropable } = Mixins
const { Colors } = Styles
const ThemeManager = Styles.ThemeManager
import DefaultRawTheme from '../themes/default'

//Containers
import LocalUser from './LocalUser'
import RemoteUsers from './RemoteUsers'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      room: {
        room: 253,
        //If we want to create the room automatically
        request: 'create',
        fir_freq: 10,
        secret: 'test',
        description: 'Video room',
        bitrate: 128000
      },
      user: {
        id: new Date().getTime(),
        name: 'User' + new Date().getTime()
      },
      publishers: 6,
      janus: {
        server: 'https://play.lingoda.dev:8889/janus'
      }
    }
  }

  getChildContext() {
    return {
      muiTheme : ThemeManager.getMuiTheme(DefaultRawTheme)
    }
  }

  getStyles() {
    return {
      users: {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 72,
        width: 320
      },
      toolbar: {
        backgroundColor: Colors.teal500,
        textAlign: 'center',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0
      },
      toolbarButton: {
        width: 72,
        height: 72
      },
      toolbarIcon: {
        fill: Colors.white,
        width: 36,
        height: 36
      }
    }
  }

  render() {
    let styles = this.getStyles();
    return (
      <Mcu>
        <VideoRoom
         janus={this.state.janus}
         publishers={this.state.publishers}
         user={this.state.user}
         room={this.state.room}
         autoPublish={true}>

         <Paper style={styles.users} zDepth={1} rounded={false}>
          <Tabs>
            <Tab label="Users">
              <RemoteUsers/>
            </Tab>
          </Tabs>
         </Paper>

         <Paper style={styles.toolbar} zDepth={0} rounded={false}>
           <LocalUser/>
         </Paper>

        </VideoRoom>
      </Mcu>
    )
  }
}

App.childContextTypes = {
  muiTheme : PropTypes.object
}
