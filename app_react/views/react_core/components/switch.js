import { h, render, Component } from 'preact';

export default class Switch extends Component{

    constructor(props){
        super(props);

        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler(){
        this.props.clickHandler(this.props.id,!this.props.switchState);
    }

    render(){
        return (
            <span className={"c-switch" + (this.props.switchState ? " switch-on" : " switch-off") + (this.props.disabled ? " disabled" : "") } onClick={this.clickHandler}>
                <span className="switch-handle"></span>
            </span>
        )
    }
}

/*Switch.propTypes = {
    id : React.PropTypes.string,
    clickHandler: React.PropTypes.func.isRequired
};*/

Switch.defaultProps = {
    clickHandler : function () {}
};
