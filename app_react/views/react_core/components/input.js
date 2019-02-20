import { h, render, Component } from 'preact';

export default class Input extends Component {
    constructor(props) {
        super(props);
        this.changeHandler = this.changeHandler.bind(this);
        this.clickCallback = this.clickCallback.bind(this);
        this.onClickLabel = this.onClickLabel.bind(this);
    }
    renderLabel(label) {
    	if(label){
        	return (
				<div className="input-label" onClick={this.onClickLabel} dangerouslySetInnerHTML={{__html:label}}></div>
            );
        } else{
            return('');
        }
    }
    onClickLabel() {
       let input = this.inputCntrEl.querySelector('input');
       input.focus();

       if(typeof this.props.labelClickCallback == 'function') this.props.labelClickCallback();
    }
    changeHandler(e) {
        this.props.changeCallback(e.target.value, e);
    }
    clickCallback() {
        this.props.clickCallback();
    }
    render() {
        let className = this.props.className ? this.props.className + ' c-input-cntr' : 'c-input-cntr';

        if(this.props.noBorder) {
            className = className + " no-border";
        }
        if(this.props.isError) {
            className = className + " error";
        }

        return (
            <div className={className} ref={(ref) => this.inputCntrEl = ref}>
            	{ this.renderLabel(this.props.label) }
                <input className="c-input u-v-align-middle" id={this.props.id} value={this.props.val} readOnly={this.props.isReadOnly} maxlength={this.props.maxLength ? this.props.maxLength : ''} disabled={this.props.isDisabled} onClick={this.clickCallback} onInput={this.changeHandler} onKeyDown={this.props.keyDownCallback} placeholder={this.props.placeholder} type={this.props.type} name={this.props.name} autocomplete={this.props.autocomplete} />
                { this.props.errorMessage ? <div className="error-message">{this.props.errorMessage} <div className="ixi-icon-error"></div></div> : '' }
            </div>
        );
    }
}

/*Input.propTypes = {
    changeCallback : React.PropTypes.func,
    focusCallback: React.PropTypes.func,
    blurCallback: React.PropTypes.func,
    keyDownCallback: React.PropTypes.func,
    val: React.PropTypes.string,
    label: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    isDisabled : React.PropTypes.bool,
    isReadOnly : React.PropTypes.bool,
    clickCallback : React.PropTypes.func,
    noBorder : React.PropTypes.bool,
    isError : React.PropTypes.bool,
    errorMessage: React.PropTypes.string,
    type: React.PropTypes.string
};*/
Input.defaultProps = {
    changeCallback:() => {},
    keyDownCallback:() => {},
    val: '',
    label: '',
    placeholder: '',
    isDisabled : false,
    isReadOnly : false,
    clickCallback:() => {},
    labelClickCallback:()=>{},
    noBorder : false,
    isError : false,
    errorMessage : '',
    type: 'text'
};
