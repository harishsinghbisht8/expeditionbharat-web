/**
	@param text {string}
	@param href {string}
	@param onClick {function}
 */

import { h, render, Component } from "preact";
import Tooltip from "./tooltip";

export default class NavItem extends Component {
    render() {
        let className = "nav-list-item u-uppercase u-ib ";
        if (this.props.selected) {
            className = className + " selected";
        }
        let html = "";
        if (this.props.href) {
            html = (
                <a className={className + " u-nostyle-link"} onClick={this.props.onClick} data={this.props.itemKey} href={this.props.href}>
                    {this.props.showPostFix && this.props.postFix && this.props.postFix.type == "icon" ? (
                        <span className="text-display">
                            {this.props.text}
                            <span className={this.props.postFix.className} />
                        </span>
                    ) : (
                        this.props.text
                    )}
                </a>
            );
        } else {
            html = (
                <div className={className} onClick={this.props.onClick} data={this.props.itemKey}>
                    {this.props.showPostFix && this.props.postFix && this.props.postFix.type == "icon" ? (
                        <span className="text-display">
                            {this.props.text}
                            <span className={this.props.postFix.className} />
                        </span>
                    ) : (
                        this.props.text
                    )}
                </div>
            );
        }
        return (
            <span className={this.props.showToolTip ? "u-tooltip-wrapper" : ""}>
                {html}
                {this.props.showToolTip && <Tooltip placement="bottom" className="nav-item-tooltip" text={this.props.toolTipText} />}
            </span>
        );
    }
}

/*NavItem.propTypes = {
    className : React.PropTypes.string,
    text : React.PropTypes.string,
    href : React.PropTypes.string,
    selected : React.PropTypes.bool,
    onClick : React.PropTypes.func
};*/
