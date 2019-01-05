/**
 * @param isVisible {boolean} if list is visible or not
 * @param itemClickCallback {Function} callback on click on any list item
 * @param items {Array} of Objects
 		{
 			@param text {string}
 			@param href {string}
 		}
 */

import { h, render, Component } from 'preact';


export default class DropdownList extends Component {
    constructor(props) {
        super(props);
    }

    itemClickHandler(e) {
        let $listItem = $(e.target).closest(".dropdown-list-item");
        if(!$listItem.length || !this.props.itemClickCallback) return;
        if(!$listItem.hasClass('disabled')) this.props.itemClickCallback(parseInt($listItem.attr("data-index"),10));
    }

    render() {
        return (
        	<ul className={"dropdown-list u-box u-nostyle-list " + (this.props.className ? this.props.className + " " : "") + ((this.props.isVisible && this.props.items.length) ? "" : "u-hide ")} onClick={this.itemClickHandler.bind(this)}>
        		{
        			this.props.items.map(
        				(listItem,id) => {
                            let isDisabledOption = ''
                            if( this.props.startIndex != undefined && this.props.startIndex > id){
                                isDisabledOption = true
                            }
                            if (this.props.lastIndex != undefined && this.props.lastIndex < id) {
                                isDisabledOption = true
                            }
        					return (
                                <li key={id} data-index={id} className={( (listItem.text && this.props.selected == listItem.text) || (listItem.val && this.props.selected == listItem.val) ? 'selected '  : ' ') + (listItem.href ? '' : 'dropdown-list-item' + (isDisabledOption ? ' disabled' : ''))}>
                                    {listItem.href ? <a className='dropdown-list-item' href={listItem.href} >{listItem.text}</a> : <span dangerouslySetInnerHTML={{__html: listItem.text}}></span>}
                                </li>
                            );
        				}
        			)
        		}
            </ul>
        );
    }
};


// DropdownList.propTypes = {
//     items: React.PropTypes.array.isRequired,
//     itemClickCallback: React.PropTypes.func
// };
DropdownList.defaultProps = {
    isVisible: false
};
