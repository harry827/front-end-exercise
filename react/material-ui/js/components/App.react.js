var React = require('react');
var Header = require('./Header.react');
var Slider = require('./LeftNav.react');
var Content = require('./Content.react');

var App = React.createClass({
    render: function () {
        return (
            <div>
                <Header />
                <Slider />
                <Content/>
            </div>
        );
    }
});

module.exports = App;
