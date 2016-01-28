var React = require('react');
var Dialog = require('material-ui/lib/dialog');
var FlatButton = require('material-ui/lib/flat-button');
var RaisedButton = require('material-ui/lib/raised-button');
var FontIcon = require('material-ui/lib/font-icon');
var Paper = require('material-ui/lib/paper');
var GridList = require('material-ui/lib/grid-list/grid-list');
var GridTile = require('material-ui/lib/grid-list/grid-tile');

var Widget = React.createClass({
    getInitialState: function () {
        return {
            open: true,
            step: 'chart' // data/set
        };
    },
    handleOpen: function () {
        this.setState({open: true});
    },
    handleClose: function () {
        this.setState({open: false});
    },
    switchStep: function () {
        console.log(this.state);
        this.state.step = 'data';
        this.setState(this.state);
    },
    componentDidMount: function () {
    },
    componentWillUnmount: function () {
    },
    render: function () {
        var actions = [
            <FlatButton
                label="返回"
                secondary={true}
                onTouchTap={this.handleClose}
                />,
            <FlatButton
                label="提交"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.handleClose}
                />
        ];

        var charts = [
            {
                name: 'chart name',
                des: 'chart name',
                src: 'img/map.png'
            }, {
                name: 'chart name',
                des: 'chart name',
                src: 'img/map.png'
            }, {
                name: 'chart name',
                des: 'chart name',
                src: 'img/map.png'
            }, {
                name: 'chart name',
                des: 'chart name',
                src: 'img/map.png'
            }, {
                name: 'chart name',
                des: 'chart name',
                src: 'img/map.png'
            }, {
                name: 'chart name',
                des: 'chart name',
                src: 'img/map.png'
            }
        ];

        return (
            <Dialog
                title={
                <div className='clearfix' style={{padding:10}}>
                    <h2 style={{float:'left'}}>Title</h2>
                    <FontIcon className="muidocs-icon-custom-github"
                    onTouchTap={this.handleClose}
                    style={{float:'right',fontSize:20,cursor:'pointer'}}/>
                </div>
                }
                iconClassNameRight="muidocs-icon-navigation-expand-more"
                actions={actions}
                modal={false}
                open={this.state.open}
                onRequestClose={this.handleClose}
                contentStyle={{width:'80%',maxWidth:'atuo'}}
                bodyStyle={{height:'80%'}}>
                <div style={{display:(this.state.step == 'chart'?'block':'none')}}>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-around'
                    }}>
                        <GridList
                            cellHeight={180}
                            style={{
                            width: '100%',
                            height: 400,
                            overflowY: 'auto',
                            marginBottom: 10,
                            //cursor:'pointer'
                        }}
                            cols={5}
                            >
                            {charts.map(function (chart, index) {
                                return <GridTile
                                    key={'chart'+index}
                                    title={chart.name}
                                    subtitle={chart.des}
                                    onClick={this.switchStep}
                                    >
                                    <img src={chart.src} onTouchTap={this.switchStep}/>
                                </GridTile>
                            })}
                        </GridList>
                    </div>
                </div>
            </Dialog>
        );
    }
});

module.exports = Widget;
