import { h, render, Component } from "preact";

export default class Tooltip extends Component {
    render() {
        let className = "c-tooltip " + (this.props.className ? this.props.className + " " : "") + (this.props.placement ? this.props.placement : "left");

        return (
            <div className={className}>
                <div className="tip" />
                {this.props.text}
            </div>
        );
    }
}
