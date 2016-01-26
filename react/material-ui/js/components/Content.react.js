var React = require('react');
var Paper = require('material-ui/lib/paper');

var Card = require('material-ui/lib/card/card');
var CardHeader = require('material-ui/lib/card/card-header');
var CardText = require('material-ui/lib/card/card-text');
var CardActions = require('material-ui/lib/card/card-actions');
var FlatButton = require('material-ui/lib/flat-button');

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
        var style = {
            height: 100,
            width: 100,
            margin: 20,
            textAlign: 'center',
            display: 'inline-block',
        };


        return (
            <div>
                <Paper style={style} zDepth={1} className="aaaaaaaa">Paper</Paper>
                <Card style={{width:500,marginLeft:30}}>
                    <CardHeader style={{height:'auto',padding:10}} title="Without Avatar">Title</CardHeader>
                    <CardText>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                        Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                        Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                    </CardText>
                </Card>
            </div>
        );
    }
});

module.exports = Content;
