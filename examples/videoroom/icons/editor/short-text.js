'use strict';

var React = require('react/addons');
var PureRenderMixin = React.addons.PureRenderMixin;
var SvgIcon = require('material-ui/lib/svg-icon');

var EditorShortText = React.createClass({
  displayName: 'EditorShortText',

  mixins: [PureRenderMixin],

  render: function render() {
    return React.createElement(
      SvgIcon,
      this.props,
      React.createElement('path', { d: 'M4 9h16v2H4zm0 4h10v2H4z' })
    );
  }

});

module.exports = EditorShortText;