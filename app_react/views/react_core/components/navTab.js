/**
 * @param selected {String} Selected tab of the header navigation
 * @param items {Array} of Objects
 		{
 			@param text {string}
 			@param href {string}
 			@param onClick {function}
 		}
 */

import { h, render, Component } from "preact";
import NavItem from "./navItem";

export default class NavTab extends Component {
    render() {
        let selectedItem = this.props.selected;
        let self = this;
        return (
            <nav className="nav-list">
                {this.props.items.map((listItem, id) => {
                    id = listItem.id ? listItem.id : id;
                    return (
                        <NavItem
                            selected={selectedItem == id}
                            onClick={e => listItem.onClick && listItem.onClick(e, id)}
                            itemKey={id}
                            key={id}
                            href={listItem.href}
                            text={listItem.text}
                        />
                    );
                })}
            </nav>
        );
    }
}

/*NavTab.propTypes = {
    items : React.PropTypes.array.isRequired
};*/

// add search button
// add bell
// add login
