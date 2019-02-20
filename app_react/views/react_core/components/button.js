/**
 * @param disabled {Boolean} Default: false
 * @param text {String} Default: "Submit"
 * @param onClick {Function}
 */

import { h, render, Component } from 'preact';

export default class Button extends Component {

	constructor(props) {
		super(props);

        this.clickHandler = this.clickHandler.bind(this);
        this.animationHandler = this.animationHandler.bind(this);
	}

    clickHandler(e) {
		if(this.props.disabled) return;

        if(this.props.noRipple) {
            this.props.onClick(e);
        } else {
            let ripple = this.ripple;
            let parent = this.ripple.parentElement;
            let circle = ripple.querySelector('.u-ripple-circle');

            let x = e.pageX - parent.offsetLeft;
            let y = e.pageY - parent.offsetTop;

            circle.style.top = y + 'px';
            circle.style.left = x + 'px';

            ripple.classList.add('is-active');
        }
    }

    animationHandler() {
        this.ripple.classList.remove('is-active');
        this.props.onClick();
    }

    componentDidMount() {
        if(this.props.noRipple) return;

        ['animationend', 'webkitAnimationEnd', 'oanimationend', 'MSAnimationEnd'].forEach( evt => 
            this.ripple.addEventListener(evt, this.animationHandler, false)
        );
    }

    componentWillUnmount() {
        ['animationend', 'webkitAnimationEnd', 'oanimationend', 'MSAnimationEnd'].forEach( evt => 
            this.ripple.removeEventListener(evt, this.animationHandler, false)
        );
    }

    getButtonContent() {
        return (
            <span>
                <i className={this.props.iconClass + ' button-icon u-ib u-v-align-middle ' + this.props.iconPosition}></i>
                <span className='button-text u-ib u-v-align-middle'>{this.props.text}</span>
            </span>
        )
    }

    render() {
    	let className = 'c-btn u-link';
        if(this.props.isSecondary) className += ' secondary';

        return (
            <button className={className + " " + (this.props.disabled ? 'disabled' : 'enabled')} type={this.props.type} onClick={this.clickHandler}>
                {this.props.noRipple ? '' :
                    <div className="u-ripple" ref={ref=>this.ripple=ref}>
                        <span className="u-ripple-circle"></span>
                    </div>
                }
                {this.props.iconClass ? this.getButtonContent() : this.props.text}
            </button>
        );
    }
};

Button.defaultProps = {
    text: "Submit",
    disabled: false,
    onClick: () => {},
    iconPosition: "left"
};
