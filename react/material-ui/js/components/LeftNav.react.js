var React = require('react');
var LeftNav = require('material-ui/lib/left-nav');
var MenuItem = require('material-ui/lib/menus/menu-item');
var Colors = require('material-ui/lib/styles/colors');

var SliderStore = require('../stores/SliderStore');
var SliderAction = require('../actions/SliderAction');

/**
 * 左侧菜单
 * @type {*|Function}
 */
var Slider = React.createClass({
    getInitialState: function () {
        return SliderStore.getState();
    },
    _onChange: function () {
        this.setState(SliderStore.getState());
    },
    componentDidMount: function () {
        SliderStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function () {
        SliderStore.removeChangeListener(this._onChange);
    },
    render: function () {
        return (
            <LeftNav
                docked={false}
                width={260}
                open={this.state.open}
                onRequestChange={SliderAction.close}
                >
                <div style={{
                    backgroundColor:Colors.cyanA700,
                    color:'#fff',
                    fontSize:30,
                    textAlign:'center',
                    padding:'40px 0'
                }}>
                    DataView
                </div>
                <MenuItem onTouchTap={SliderAction.close}>Dashboard列表</MenuItem>
                <MenuItem onTouchTap={SliderAction.close}>Widget列表</MenuItem>
            </LeftNav>
        );
    }
});

module.exports = Slider;
