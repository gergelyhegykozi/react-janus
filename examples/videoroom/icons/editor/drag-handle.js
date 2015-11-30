'use strict';

var React = require('react/addons');
var PureRenderMixin = React.addons.PureRenderMixin;
var SvgIcon = require('material-ui/lib/svg-icon');

var EditorDragHandle = React.createClass({
  displayName: 'EditorDragHandle',

  mixins: [PureRenderMixin],

  render: function render() {
    return React.createElement(
      SvgIcon,
      this.props,
      React.createElement('path', { d: 'M20 9H4v2h16V9zM4 15h16v-2H4v2z' })
    );
  }

});

module.exports = EditorDragHandle;