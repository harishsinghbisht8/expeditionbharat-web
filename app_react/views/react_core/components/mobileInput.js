import { h, render, Component } from 'preact';
import DropdownList from './dropdownList';
import IxiUtils from '../../../common/js/ixiUtils';

export default class MobileInput extends Component {
    constructor(props) {
        super(props);
        this.changeHandler = this.changeHandler.bind(this);
        this.focusHandler = this.focusHandler.bind(this);
        this.blurHandler = this.blurHandler.bind(this);

        this.state = {
            isCountryCodeDDVisible: false
        }
        this.countryCodes = [];
        this.validateMobileRequest = false;
    }

    renderLabel(label) {
    	if(label){
        	return (
				<div className="input-label">{label}</div>
            );
        } else{
            return '';
        }
    }
    componentDidUpdate() {
        let $input = $(this.inputCntrEl).find('input');
        if(this.props.isFocus && !$input.is(":focus")){
            $input.focus();
        }
    }
    focusHandler() {
        $(this.inputCntrEl).addClass('focus');
        this.props.focusCallback();
    }
    blurHandler() {
        $(this.inputCntrEl).removeClass('focus');
        this.props.blurCallback();
    }
    changeHandler(e) {
        let value = e.target.value.replace(/\D/g,'');
        this.props.changeCallback(value);
        
        let countryCode = this.props.selectedOption ? this.props.selectedOption.split('-')[1] : null;
        this.validateMobile(value, countryCode);
    }
    countryCodeSelectHandler(selected) {
        if(!isNaN(parseInt(selected, 10)) && this.countryCodes[selected] && this.props.selectedOption != this.countryCodes[selected].value){
            this.props.countryCodeSelectHandler(this.countryCodes[selected].val);

            let countryCode = this.countryCodes[selected].val ? this.countryCodes[selected].val.split('-')[1] : null;
            this.validateMobile(this.props.val, countryCode);
        }
    }
    validateMobile(value, countryCode) {
        if(typeof this.props.mobileValidationCallback != 'function') {
            return;
        }
        let errorMsg = ["Please enter mobile number", "Please enter a valid mobile number"];
        if(!value) {
            this.props.mobileValidationCallback({isValid:false, msg: errorMsg[0]});
            return;
        }
        if(countryCode == "IN") {
            if(!value.match(/^\d{10}$/)) {
                this.props.mobileValidationCallback({isValid:false, msg: errorMsg[1]});
            }else{
                this.props.mobileValidationCallback({isValid:true});
            }
            return;
        }
        window.clearTimeout(this.validateMobileRequest);
        this.validateMobileRequest = window.setTimeout(() => {
            let paramData = {
                mobile : value,
                countryCode : countryCode,
            };
            ReactifyCore.Utils.AJAX.post("/api/v2/users/mobile/verify", $.param(paramData), 'application/x-www-form-urlencoded', (response) => {
                if(response && response.data && response.data.isValid){
                    this.props.mobileValidationCallback({isValid:true});
                }else{
                    this.props.mobileValidationCallback({isValid:false, msg: errorMsg[1]});
                }
            }, (error, errorMsg) => {
                this.props.mobileValidationCallback({isValid:false, msg: errorMsg[1]});
            });
        }, 300);
    }
    componentDidMount() {
        if(IxiUtils.isBrowser) {
            IxiUtils.ISDCODE.fetchList().then((response) => {
                this.countryCodes = [0,0,0,0];
                for(let i in response.countryISDCode) {
                    let country = response.countryISDCode[i];
                    let itemHtml = "+" + country.number + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                    if(country.number.length < 3) {
                        for(let count=country.number.length; count<3; ++count) {
                            itemHtml += "&nbsp;&nbsp;";
                        }
                    }
                    itemHtml = itemHtml + ' ('+ country.code.toUpperCase() +') ' + country.name;
                    let itemValue = "+" + country.number + "-" + country.code.toUpperCase();
                    
                    let itemObj = {
                        text: itemHtml, 
                        val: itemValue,
                        _prefix: "+" + country.number
                    }

                    if(country.code.toUpperCase() == "IN") {
                        this.countryCodes[0] = itemObj;
                    }
                    else if(country.code.toUpperCase() == "US") {
                        this.countryCodes[1] = itemObj
                    }
                    else if(country.code.toUpperCase() == "CN") {
                        this.countryCodes[2] = itemObj
                    }
                    else if(country.code.toUpperCase() == "GB") {
                        this.countryCodes[3] = itemObj
                    }
                    else if(!country.flag){
                        this.countryCodes.push(itemObj);
                    }
                }

                this.forceUpdate();
            });
        }

        $(document).on('click', (e) => {
            if(!$(e.target).closest('.c-input-country-code').length) {
                this.setState({isCountryCodeDDVisible: false});
            } 
        });
    }

    render() {
        let className = this.props.className ? this.props.className + ' c-input-cntr c-input-mobile' : 'c-input-cntr c-input-mobile';
        
        if(this.props.noBorder) {
            className = className + " no-border";
        }
        if(this.props.isError) {
            className = className + " error";
        }
        if(this.props.isFocus) {
            className = className + " focus";   
        }

        let rotateClass = '';
        if(this.state.isCountryCodeDDVisible) {
            rotateClass = 'turn';
        }

        return (
            <div className={className} ref={(ref) => this.inputCntrEl = ref}>
                { this.renderLabel(this.props.label) }
                <span className="c-country-code-wrapper">
                    <span className="c-input-country-code" onClick={() => this.setState({isCountryCodeDDVisible: !this.state.isCountryCodeDDVisible})}>
                        {this.props.phonePrefix} <i className="ixi-icon-caret dd-icon"></i>
                        <DropdownList className="list" items={this.countryCodes} isVisible={this.state.isCountryCodeDDVisible} itemClickCallback={this.countryCodeSelectHandler.bind(this)} selected={this.props.selectedOption} />
                    </span>
                </span>
                <span className="c-mobile-input-wrapper">
                    <input className="c-input u-v-align-bottom" value={this.props.val} readOnly={this.props.isReadOnly} disabled={this.props.isDisabled} onClick={this.props.clickCallback} onFocus={this.focusHandler} onBlur={this.blurHandler} onInput={this.changeHandler} onKeyDown={this.props.keyDownCallback} placeholder={this.props.placeholder} type="tel" name={this.props.name} maxLength={this.props.maxLength} />
                    <span className="material-underline"></span>
                </span>
                { this.props.errorMessage ? <div className="error-message">{this.props.errorMessage} <div className="ixi-icon-error"></div></div> : '' }
            </div>
        );
    }
}

/*MobileInput.propTypes = {
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
MobileInput.defaultProps = {
    changeCallback:() => {},
    focusCallback:() => {},
    blurCallback:() => {},
    keyDownCallback:() => {},
    val: '',
    label: '',
    placeholder: '',
    isDisabled : false,
    isReadOnly : false,
    clickCallback:() => {},
    noBorder : false,
    isError : false,
    errorMessage : '',
    type: 'text'
};