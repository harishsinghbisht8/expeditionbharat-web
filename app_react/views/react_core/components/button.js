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
	}

    clickHandler(e) {
		if(this.props.disabled) return;

        if(this.props.noRipple) {
            this.props.onClick(e);
        } else {
            let $ripple = $(this.ripple);
            let $offset = $ripple.parent().offset();
            let $circle = $ripple.find('.u-ripple-circle');

            let x = e.pageX - $offset.left;
            let y = e.pageY - $offset.top;

            $circle.css({
                top: y + 'px',
                left: x + 'px'
            });

            $ripple.addClass('is-active');
        }
    }

    componentDidMount() {
        if(this.props.noRipple) return;
        let $ripple = $(this.ripple);
        $ripple.on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', () => {
            $ripple.removeClass('is-active');
            this.props.onClick();
        });
    }

    componentWillUnmount() {
        let $ripple = $(this.ripple);
        $ripple.off('animationend webkitAnimationEnd oanimationend MSAnimationEnd');
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
            <button className={className + " " + (this.props.disabled ? 'disabled' : 'enabled')} onClick={this.clickHandler}>
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
