var React = require('react');
var AppBar = require('material-ui/lib/app-bar');
var Avatar = require('material-ui/lib/avatar');
//var TodoActions = require('../actions/TodoActions');
//var TodoTextInput = require('./TodoTextInput.react');

var Header = React.createClass({
    _onSave: function (text) {
        if (text.trim()) {
            //TodoActions.create(text);
        }

    },
    render: function () {
        return (
            <AppBar
                title='DataView'
                //iconElementLeft={}
                iconElementRight={
                  <Avatar src="img/head.jpg" style={{width:'45px',height:'45px'}} />
                }
                />
        );
    }

});

module.exports = Header;
