'use strict';

var React = require('react/addons');
var PureRenderMixin = React.addons.PureRenderMixin;
var SvgIcon = require('material-ui/lib/svg-icon');

var AvFiberManualRecord = React.createClass({
  displayName: 'AvFiberManualRecord',

  mixins: [PureRenderMixin],

  render: function render() {
    return React.createElement(
      SvgIcon,
      this.props,
      React.createElement('circle', { fill: '#010101', cx: '12', cy: '12', r: '8' })
    );
  }

});

module.exports = AvFiberManualRecord;