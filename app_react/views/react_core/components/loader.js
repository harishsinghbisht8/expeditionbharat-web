import { h, render, Component } from 'preact';

export default class Loader extends Component {
	render() {
		if(this.props.type == "horizontal") {
			return(
				<div>
					<div className="c-loader-bg"></div>
				    <div className="c-loader-popup">
				    	{this.props.text ? (<div className="c-loding-text">{this.props.text}</div>) : ""}
					    <div className="c-loading-circles">
					        <div className="c-loading-item"></div>
					        <div className="c-loading-item"></div>
					        <div className="c-loading-item"></div>
					    </div>
					</div>
				</div>
			)
		} else {
			return(
				<div className="c-loader">
				    <div className="c-loader-inner">
				        <div className="loader"></div>
				    </div>
				</div>
			)
		}
	}
}
/*Loader.propTypes = {
    text : React.PropTypes.string,
    isLoading : React.PropTypes.bool,
    type : React.PropTypes.string
};*/
Loader.defaultProps = {
    text : "",
    isLoading : false,
    type : "circular"
};