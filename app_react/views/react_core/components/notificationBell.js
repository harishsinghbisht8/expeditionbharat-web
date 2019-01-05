import { h, render, Component } from 'preact';

export default class NotificationBell extends Component { 
    render() {
    	let self = this;
    	let iconClassName = 'fa fa-bell';
    	let showDropdown = (self.props.isActive ? 'notification-dropdown' : 'u-hide');
    	return(
	    	<div>
	    		<div onClick={self.props.onClick}>
	    			<i className={iconClassName + ' notification-bell'}>bell</i>
	    			<span className="notification-count">{self.props.totalNotifications}</span>
	    		</div>
	    		<div className={showDropdown}>notofication details</div>
	    	</div>
	    );
    }
};