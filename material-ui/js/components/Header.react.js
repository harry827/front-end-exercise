var React = require('react');
var AppBar = require('material-ui/lib/app-bar');
var Avatar = require('material-ui/lib/avatar');
var Popover = require('material-ui/lib/popover/popover');
var Menu = require('material-ui/lib/menus/menu');
var MenuItem = require('material-ui/lib/menus/menu-item');
var FlatButton = require('material-ui/lib/flat-button');
var RaisedButton = require('material-ui/lib/raised-button');

var SliderAction = require('../actions/SliderAction');
/**
 * 用户信息操作
 * @type {*|Function}
 */
var UserInfo = React.createClass({
    getInitialState: function () {
        return {
            openPopover: false,
            anchorOrigin: {"horizontal": "right", "vertical": "top"},
            targetOrigin: {"horizontal": "right", "vertical": "top"}
        }
    },
    openPopover(e) {
        this.setState({
            openPopover: true,
            anchorEl: e.currentTarget
        });
    },
    closePopover() {
        this.setState({
            openPopover: false
        });
    },
    render: function () {
        return (<div>
            <Avatar src="img/head.jpg"
                    onClick={this.openPopover}
                    style={{
                        width:'45px',
                        height:'45px',
                        cursor:'pointer'
                    }}/>
            <Popover open={this.state.openPopover}
                     anchorEl={this.state.anchorEl}
                     anchorOrigin={this.state.anchorOrigin}
                     targetOrigin={this.state.targetOrigin}
                     onRequestClose={this.closePopover}
                     zDepth={3}>
                <div>
                    <div style={{textAlign:'center',padding:'10px',paddingBottom:0}}>
                        <Avatar src="img/head.jpg"
                                style={{
                        width:'60px',
                        height:'60px'
                    }}/>
                    </div>
                    <Menu
                        style={{width:'160px',borderTop:'1px solid #ccc'}}
                        onClick={this.closePopover}
                        zDepth={0}>
                        <MenuItem primaryText="设置"/>
                        <MenuItem primaryText="退出"/>
                    </Menu>
                </div>

            </Popover>
        </div>);
    }
});

var Nav = React.createClass({
    render: function () {
        return (
            <div>
                <div style={{float:'left',marginRight:'20px',marginTop:'5px'}}>
                    <FlatButton label="操作2" style={{color:'#fff',textTransform:'inherit',fontSize:16,marginRight:10}}/>
                    <RaisedButton primary={true} label="操作1" labelStyle={{textTransform:'inherit'}}/>
                </div>
                <div style={{float:'left'}}>
                    <UserInfo/>
                </div>
            </div>
        );
    }
});

/**
 * header头
 * @type {*|Function}
 */
var Header = React.createClass({
    render: function () {
        return (
            <AppBar
                title='Dashboard001'
                //iconElementLeft={<span></span>}
                onLeftIconButtonTouchTap={SliderAction.toggle}
                iconElementRight={<Nav/>}
                />
        );
    }
});

module.exports = Header;
