var React = require('react');
var Paper = require('material-ui/lib/paper');

var Card = require('material-ui/lib/card/card');
var CardHeader = require('material-ui/lib/card/card-header');
var CardText = require('material-ui/lib/card/card-text');

var FontIcon = require('material-ui/lib/font-icon');

var ChartBox = React.createClass({
    getInitialState: function () {
        return {
            zDepth: 0
        };
    },
    mouseEnter: function () {
        this.setState({
            zDepth: 1
        });
    },
    mouseLeave: function () {
        this.setState({
            zDepth: 0
        });
    },
    render: function () {
        return (
            <div style={{width:'50%',padding: 10,float:'left'}}>
                <Card style={{border:'1px solid #eaeaea'}}
                      zDepth={this.state.zDepth}
                      onMouseEnter={this.mouseEnter}
                      onMouseLeave={this.mouseLeave}>
                    <CardHeader
                        style={{height:'auto',padding:'5px 10px'}}
                        title={this.props.data.title}>
                        <FontIcon className="muidocs-icon-custom-github"
                                  style={{float:'right',fontSize:20}}/>
                    </CardHeader>
                    <CardText style={{paddingTop:0,height:260}}>
                        Chart id is {this.props.data.title}
                    </CardText>
                </Card>
            </div>
        );
    }
});

var Content = React.createClass({
    getInitialState: function () {
        return {
            chartList: [{}]
        };
    },
    _onChange: function () {
    },
    componentDidMount: function () {
    },
    componentWillUnmount: function () {
    },
    render: function () {

        var chartList = [{
            title: 'Title',
            id: 1
        }, {
            title: 'Title',
            id: 2
        }, {
            title: 'Title',
            id: 3
        }, {
            title: 'Title',
            id: 4
        }];

        return (
            <div style={{padding:10}}>
                {chartList.map(function (data) {
                    return <ChartBox data={data} key={data.id}/>;
                })}

            </div>
        );
    }
});

module.exports = Content;
