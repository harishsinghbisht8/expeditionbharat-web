/**
 * @param count {Number} Initial count Default: 0  
 * @param ulimit {Number} Upper limit Default: 100  
 * @param llimit {Number} Lower limit Default: 0  
 * @param onChange {Function}
 */

import { h, render, Component } from 'preact';

export default class Counter extends Component {
	
	constructor(props) {
		super(props);
	}


	clickHandler(e) {
		let currentCount = this.props.count;
		if($(e.currentTarget).hasClass('counter-positive') && currentCount < this.props.ulimit) {
			currentCount ++;
		} else if($(e.currentTarget).hasClass('counter-negative') && currentCount > this.props.llimit) {
			currentCount --;
		}

		if(this.props.count !== currentCount) {
			this.props.onChange({count : currentCount});			
		}
	}

	componentWillMount() {
    	let currentCount = this.props.count;

    	if(currentCount > this.props.ulimit){
			currentCount = this.props.ulimit;
			this.props.onChange({count : currentCount});
    	} 

		if(currentCount < this.props.llimit) {
			currentCount = this.props.llimit;
			this.props.onChange({count : currentCount});
		}
	}
	
	componentWillReceiveProps(newProps) {
    	let currentCount = newProps.count;

    	if(currentCount > newProps.ulimit){
			currentCount = newProps.ulimit;
			this.props.onChange({count : currentCount});
    	} 

		if(currentCount < newProps.llimit) {
			currentCount = newProps.llimit;
			this.props.onChange({count : currentCount});
		}
	}
    
    render() {
    	let currentCount = this.props.count;
  	
        return (
        	<span className={'counter-parent'}>
            	<span className={'counter-negative u-ib u-v-align-top ' + (currentCount == this.props.llimit ? 'counter-disabled' : '')} onClick={this.clickHandler.bind(this)}>-</span>
            	<span className={'u-ib u-v-align-top'}>{currentCount}</span>
            	<span className={'counter-positive u-ib u-v-align-top '  + (currentCount == this.props.ulimit ? 'counter-disabled' : '')} onClick={this.clickHandler.bind(this)}>+</span>
        	</span>
        );
    }
};


/*Counter.propTypes = {
	onChange : React.PropTypes.func.isRequired,
	count : React.PropTypes.number,
	ulimit : React.PropTypes.number,
	llimit : React.PropTypes.number
};*/


Counter.defaultProps = {
	count: 0,
	ulimit: 100,
	llimit: 0
};