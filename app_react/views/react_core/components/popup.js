import { h, render, Component } from 'preact';
import IxiUtils from '../../../common/js/ixiUtils';

export default class Popup extends Component {
	
	componentDidMount(){
        document.addEventListener("keydown", (event)=>{
            if (!this.props.disableClose && event.type == 'keydown' && event.key && event.key.toLowerCase() == "escape"){
                this.props.closePopup(event);
            }
        });
    }

    render() {
    	let className = 'c-popup' + (this.props.closed ? ' u-hide' : '') + (this.props.backgroundClass ? ' ' + this.props.backgroundClass : '');
        let contentClassName = 'popup-content' + (this.props.contentPadding==false ? ' no-padding' : '')
        return (
            <div className={className}>
                <div className={contentClassName}>
                    {this.props.disableClose ? '' : <div className='close-popup ixi-icon-cross' onClick={this.props.closePopup}></div>}
                    {this.props.children}
                </div>
            </div>
        );
    }
};


/*Popup.propTypes = {
    
};*/

Popup.defaultProps = {
    closePopup: () => {},
    closed: null,
    disableClose: false
};