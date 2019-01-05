import { h, render, Component } from "preact";
import NavItem from "./navItem";

export default class NavWithLabel extends Component {
    render() {
        let selectedItem = this.props.selected;
        let self = this;
        return (
            <div className="nav-with-label">
                <div className="nav-label u-ib">{this.props.label}</div>
                <nav className="nav-list u-ib">
                    {this.props.items.map((listItem, id) => {
                        id = listItem.id ? listItem.id : id;
                        return (
                            <NavItem
                                selected={selectedItem == id}
                                onClick={e => listItem.onClick(e, id)}
                                itemKey={id}
                                key={id}
                                href={listItem.href}
                                text={listItem.text}
                                showPostFix={listItem.showPostFix}
                                postFix={listItem.postFix}
                                showToolTip={listItem.showToolTip}
                                toolTipText={listItem.toolTipText}
                            />
                        );
                    })}
                </nav>
            </div>
        );
    }
}

/*NavWithLabel.propTypes = {
    items : React.PropTypes.array.isRequired,
    label : React.PropTypes.string.isRequired
};*/
