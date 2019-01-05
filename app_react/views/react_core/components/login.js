import { h, render, Component } from 'preact';
import IxiUtils from '../../../common/js/ixiUtils';
import Input from './input';
import Button from './button';
import RadioButton from './radioButton';
import Dropdown from './dropdown';
import MobileInput from './mobileInput';
import Popup from './popup';
import Loader from './loader';
import Image from './image';
// error messages need to be verified

export default class LoginWidget extends Component {

	constructor(props) {
	    super(props);

	    this.state = {
	    	main: {
	    		headerText : "",
		    	email: "",
		    	password: "",
		    	errorEmail: false,
				errorPassword: false,
		    	errorMessageEmail: "",
		    	errorMessagePassword: "",
		    	errorMessageForm: false,
		    	isFocusEmail : false,
		    	isFocusPassword : false
	    	},
	    	forgot: {
	    		email: "",
	    		errorEmail: false,
	    		errorMessage: "",
	    		isFocusEmail: false,
		    	isFocusPassword : false,
		    	isFocusPasswordConfirm : false
	    	},
	    	signup: {
	    		prefix: "Mr",
		    	name: "",
		    	surname: "",
	    		email: "",
	    		phonePrefix: "+91",
				phone:"",
				countryCode: "IN",
				password: "",
				
		    	errorName: false,
		    	errorSurname: false,
		    	errorEmail: false,
				errorPhone: false,
				errorPassword: false,
		    	errorMessageName: "",
		    	errorMessageSurname: "",
		    	errorMessageEmail: "",
		    	errorMessagePhone: "",
				errorMessagePassword: "",
				
				errorMessageForm: "",
				isFocusEmail: false,
		    	isFocusPassword : false,
		    	isFocusMobile: false
	    	},
	    	verify: {
				otp: Array(...new Array(4)),
	    		value: "",
	    		signup: true,
	    		errorOTP: false,
	    		password: "",
	    		errorPassword: false,
	    		errorMessagePassword: "",
	    		errorMessageForm: false,
	    		sendingOTP: false,
	    		allowResendOTP: true,
	    		subHeading: "",
	    		isFocusEmail: false,
				isFocusPassword : false,
				isFocusOTP: 0
	    	},
			successScreen: {
	    		text: ""
			},
			postLoginVerify: {
				name: "",
				email: "",
				phonePrefix: "+91",
				phone: "",
				countryCode: "IN",
				errorEmail: false,
				errorPhone: false,
				errorMessageEmail: "",
				errorMessagePhone: "",
				isFocusEmail: false,
				isFocusMobile: false,
				userId: "",
				showEmail: false,
				submitEnabled: false,
				errorMessageForm: false
			},
	    	activeInterface : "main",
	    	isPrefixDDVisible: false,
	    	isCountryCodeDDVisible: false,
	    	isLoading: false
		};

		this.isQualifiedForSuccess = false;
		this.clientId = "ixiweb";
		this.forgotEmailSubmit = this.forgotEmailSubmit.bind(this);
		this.isValidEmail = this.isValidEmail.bind(this);
		this.forgotPassword = this.forgotPassword.bind(this);
		this.sendSignupRequest = this.sendSignupRequest.bind(this);
		this.closePopup = this.closePopup.bind(this);
		this.onPressEnter = this.onPressEnter.bind(this);
		
		["openPostLogin", "keyDownCallbackOTP","onBlurOTP", "onChangeOTP", "onFocusOTP", "updateUserInfoRequest", "facebookLoginHandler", "googleLoginHandler", "loginButtonHandler", "onChangeEmail", "onFocusEmail", "onBlurEmail", "onFocusPassword", "onBlurPassword", "onFocusMobile", "onBlurMobile", "onChangePassword"].forEach(fn => (this[fn] = this[fn].bind(this)));

		this.prefix = [{text: "Mr"}, {text: "Mstr"}, {text: "Ms"}, {text: "Miss"}, {text: "Mrs"}];
		this.intialState = Object.assign({}, this.state);
		if(IxiUtils.isBrowser && window){
			window.loginPopup = this;
		}
	}

	resetInterface(key){
		if (key) {
			this.state[key] = Object.assign({}, this.intialState[key]);
		} else {
			this.state = Object.assign({}, this.intialState);
		}
	}

	facebookLoginHandler(){
	    let self = this;
	    this.setState({
	    	isLoading : true
	    });
	    IXIGO.loginHandler.loginUserUsingFacebook(function(name, id, image) {
	    	self.setState({
		    	isLoading : false
			});
			self.openPostLogin.call(self);
	    }, function(){
	        console.log("login failed");
	        self.setState({
		    	isLoading : false
		    });
	        self.props.loginFailureCallback();
	    });
	}

	googleLoginHandler() {
		IXIGO.loginHandler.loginUserUsingGoogle((name, id, image) => {
			this.openPostLogin();
		}, () => {
			this.props.loginFailureCallback();
		});
	}

	loginButtonHandler(){
		if(this.validateSignIn()){
		    let self = this;
			let obj = Object.assign({}, this.state.main);
			let params = {
		        username : obj.email,
		        password : obj.password
		    };
		    obj.errorMessageForm = false;
		    this.setState({
		    	main: obj,
		    	isLoading: true
		    });
		    IXIGO.loginHandler.loginUsingIxigoCred(function(name, id, image) {
		        // self.props.loginCallBack(name, id, image);
		        self.setState({
		    		isLoading : false
				});
				self.openPostLogin.call(self);
		    }, function(){
		        let obj = Object.assign({}, self.state.main);
		        obj.errorMessageForm = "The email or password you entered is incorrect. Please re-enter and try again.";
		        self.setState({
		        	main : obj,
		        	isLoading : false
		        });
		        self.props.loginFailureCallback();
		    }, params);
		}
	}

	openPostLogin(autofill) {
		if (this.props.isEmbedded) {
			this.closePopup(null, "success");
		} else if (autofill) {
			this.changeInterface("postLoginVerify");
			let attributes = this.props.popupAttributes;
			let userData = attributes.userData;
			let obj = Object.assign({}, this.state.postLoginVerify);
			obj.verifyField = userData.verifyField;
			obj.userId = userData.id;
			obj.name = userData.name;

			if (!userData.verifyField || userData.verifyField == 'mobile') {
				obj.phonePrefix = userData.mobilePrefix;
				obj.phone = userData.mobile;
				if (userData.countryCode) {
					obj.countryCode = userData.countryCode;
				}
			} else if (userData.verifyField == 'email') {
				obj.email = userData.email;
			}
			this.setState({ postLoginVerify: obj });
		} else {
			this.isQualifiedForSuccess = true;
			let self = this;
			IXIGO.loginHandler.getUserInfo().done((userInfo) => {
				if (userInfo) {
					const split = userInfo.split("|");
					const isMobileVerified = split[9];
					if (isMobileVerified == 'true') {
						self.closePopup(null, "success");
					} else {
						self.changeInterface("postLoginVerify");
						let obj = Object.assign({}, this.state.postLoginVerify);
						obj.userId = split[0]; obj.name = split[2]; obj.phone = split[8]; obj.phonePrefix = split[10] ? "+" + split[10].replace("+", "") : '+91';
						if (split[11] == "false" && split[6] && split[6].indexOf("@facebook.com") != -1) {
							obj.showEmail = true;
						}
						self.setState({ postLoginVerify: obj });
					}
				}
			});
		}
	}

	updateUserInfoRequest() {
		const view = this.state.activeInterface;
		let self = this;
		let obj = Object.assign({}, this.state[view]);
		if (!(obj.email && obj.phone)) {
			if (this.validatePostLoginForm()) {
				this.updateInfoResendOTP("postLoginVerify", true);
			}
			return;
		}
		let params = {
			email: obj.email,
			phNo: obj.phone,
			prefix: obj.phonePrefix
		};
		if (view == "postLoginVerify" && this.validatePostLoginForm()) {
			this.setState({ isLoading: true });
			IXIGO.loginEventHandler.updateUserInfo(function (name, id, image) {
				self.changeInterface('verify');
				let obj = Object.assign({}, self.state.verify);
				obj.type = "reverify";
				if (params.phNo) {
					obj.subHeading = "An OTP has been sent on your phone: <br/>" + params.prefix + "-" + params.phNo;
				} else {
					obj.subHeading = "An OTP has been sent on your email: " + params.email;
				}
				self.setState({
					isLoading: false,
					verify: obj
				});
			}, function (error, msg) {
				let obj = Object.assign({}, self.state[view]);
				obj.errorMessageForm = (msg ? msg : "Something went wrong. Please try again later.");
				self.setState({
					[view]: obj,
					isLoading: false
				});
			}, params);
		}
	}

	validatePostLoginForm() {
		let obj = Object.assign({}, this.state.postLoginVerify);
		if (obj.showEmail && !IXIGO.HELPER.isValidEmail(obj.email)) {
			obj.errorMessageEmail = "Please enter a valid email address.";
			obj.errorEmail = true;
			this.setState({ postLoginVerify: obj });
			return false;
		}
		let checkMobile = obj.phone.trim().match('^[0-9]+$');
		if (checkMobile == null || checkMobile.length == 0 || (obj.countryCode == "IN" && checkMobile[0].length != 10)) {
			obj.errorMessagePhone = "Please enter a valid phone number.";
			obj.errorPhone = true;
			this.setState({ postLoginVerify: obj });
			return false;
		}
		return true;
	}

	onChangeEmail(value){
		let view =  this.state.activeInterface;
		let obj = Object.assign({}, this.state[view]);
		obj.email = value;
		obj.errorEmail = false;
		obj.errorMessageEmail = "";
		obj.errorMessageForm = "";
		this.setState({ [view]: obj });
	}
	onFocusPassword(){
		let view = this.state.activeInterface;
		let obj = Object.assign({}, this.state[view], {
			isFocusPassword: true
		});
		this.setState({ [view]: obj });
	}
	onBlurPassword(){
		let view = this.state.activeInterface;
		let obj = Object.assign({}, this.state[view], {
			isFocusPassword: false
		});
		this.setState({ [view]: obj });
	}
	onFocusMobile(){
		let view = this.state.activeInterface;
		let obj = Object.assign({}, this.state[view], {
			isFocusMobile: true
		});
		this.setState({ [view]: obj });
	}
	onBlurMobile(){
		let view = this.state.activeInterface;
		let obj = Object.assign({}, this.state[view], {
			isFocusMobile: false
		});
		this.setState({ [view]: obj });
	}
	onFocusEmail(){
		let view = this.state.activeInterface;
		let obj = Object.assign({}, this.state[view], {
			isFocusEmail: true
		});
		this.setState({ [view]: obj });
	}
	onBlurEmail(){
		let view = this.state.activeInterface;
		let obj = Object.assign({}, this.state[view], {
			isFocusEmail: false
		});
		this.setState({ [view]: obj });
	}
	onChangePassword(value){
		let view = this.state.activeInterface;
		let obj = Object.assign({}, this.state[view]);
		obj.password = value;
		obj.errorPassword = false;
		obj.errorMessagePassword = "";
		obj.errorMessageForm = "";
		this.setState({ [view]: obj });
	}
	onFocusOTP(e, id) {
		let view = this.state.activeInterface;
		let obj = Object.assign({}, this.state[view], {
			isFocusOTP: id
		});
		this.setState({ [view]: obj });
	}
	onBlurOTP() {
		let view = this.state.activeInterface;
		let obj = Object.assign({}, this.state[view], {
			isFocusOTP: null
		});
		this.setState({ [view]: obj });
	}
	keyDownCallbackOTP(event) {
		const view = this.state.activeInterface;
		if (event.key) {
			const newState = Object.assign({}, this.state[view]);
			if (event.key.toLowerCase() == 'backspace' && (!newState.otp[newState.isFocusOTP] || document.querySelector("#otp-" + newState.isFocusOTP).selectionStart == 0) ) {
				if (newState.isFocusOTP > 0) {
					newState.isFocusOTP--;
				}
				this.setState({ [view]: newState }, () => {
					setTimeout(() => {
						const elem = document.querySelector("#otp-" + newState.isFocusOTP);
						elem.selectionStart = 1;
						elem.selectionEnd = 1;
					}, 0);
				});
			}
		} 
	}
	onChangeOTP(input) {
		const view = this.state.activeInterface;
		const newState = Object.assign({}, this.state[view]);
		const inputValue = (!isNaN(input) || input == "") ? input : null;
		if (inputValue || inputValue == "") {
			newState.otp[newState.isFocusOTP] = inputValue;
			if (newState.isFocusOTP < 3 && inputValue != "") {
				newState.isFocusOTP++;
			}
			newState.errorMessageForm = "";
		} else {
			newState.otp[newState.isFocusOTP] = '';
		}
		this.setState({ [view]: newState });
	}
	forgotEmailSubmit(){
		if(this.isValidEmail(this.state.forgot.email)){
			this.setState({
				isLoading : true
			});
			if(IXIGO.loginEventHandler){
				this.forgotPassword();
			}
			else{
				IXIGO.HELPER.loadLoginLib(this.forgotPassword, function(){
					console.log("failure callback");
				}, this.props.staticPath);
			}
		}
		else{
			let obj = Object.assign({}, this.state.forgot);
			obj.errorEmail = true;
			obj.errorMessage = "Please enter a valid email address.";
			this.setState({forgot: obj});
		}
	}
	forgotPassword(source){
		let self = this;
		IXIGO.loginEventHandler.forgotPassword(
            (attr, channel) => {
            	self.resetInterface("verify");
                let obj = Object.assign({}, self.state.verify);
            	if(source == 'resend'){
            		obj.allowResendOTP = false;
            	}
                obj.type = "forgotPassword";
                if(channel == "EMAIL"){
                	obj.subHeading = "An OTP has been sent on your email: " + attr;
                }
                else{
                	obj.subHeading = "An OTP has been sent on your phone: " + attr;
                }
                self.setState({
                	activeInterface : "verify",
                	verify : obj,
                	isLoading : false
				}, () => {
					if (self.otpInput) {
						self.otpInput.onClickLabel();
					}
				});
                
                setTimeout(()=>{
		        	let obj = Object.assign({}, self.state.verify);
		        	obj.allowResendOTP = true;
		        	self.setState({
			        	verify : obj
			        });
		        }, 15000);
            },
            function(code, message) {
                let obj = Object.assign({}, self.state.forgot);
                obj.errorEmail = true;
                if(code == "1053" || code == "1054"){
                    obj.errorMessage = message;
                }else if(code == "40005"){
                    obj.errorMessage = 'We could not find a user matching this email address. Please re-enter and try again.';
                }else{
                    obj.errorMessage = 'Oops! Something went wrong. Please try again later.';
                }
                self.setState({
                	forgot : obj,
                	isLoading : false
                });
            },
            this.state.forgot.email
        );
	}
	isValidEmail(email){
		return IXIGO.HELPER.isValidEmail(email);
	}
	changeInterface(viewInterface, skipReset){
		if (!skipReset) {
			this.resetInterface(viewInterface);
		}
		this.setState({
			activeInterface : viewInterface
		}, () => {
			if (viewInterface == 'verify') {
				this.otpInput.onClickLabel();
			}
		})
		this.props.updatePopupStateCallback({
			activeInterface : viewInterface
		});
	}
	closePopup(e, status){
		const view = this.state.viewInterface;
		if (status == "success" || (e && this.isQualifiedForSuccess == true)) {
			this.loginSuccessCallback(this.props.loginCallBack);
		} else {
			this.props.loginFailureCallback();
		} 
		this.resetInterface();
		this.props.updatePopupStateCallback({
			activeInterface : "main"
		});
		this.props.onClose();
	}
	loginSuccessCallback(callback){
		$.when(IXIGO.loginHandler.getUserInfo()).then((userInfo) => {
			let infoArray = userInfo && userInfo.split('|');
			let name = infoArray && infoArray[2];
			let userId = infoArray && infoArray[0];
			let imageSrc =  IXIGO.loginHandler.getUserImage(userId);
			callback(name, userId, imageSrc);
			this.state.activeInterface = "main";
		});
	}
	updateInfoResendOTP(source, isFirstHit) {
		let self = this;
		const form = this.state[source];
		let deviceTime = new Date().getTime();
		let accessToken = window.sha512(form.phonePrefix + '~' + form.phone + '~' + this.clientId + '~' + IXIGO.COOKIE.read('ixiUID') + '~' + deviceTime);
		let data = {
			prefix: !form.email ? form.phonePrefix : "",
			phNo: !form.email ? form.phone : "",
			token: accessToken,
			email: form.email ? form.email : ""
		};
		if (isFirstHit) {
			this.setState({isLoading: true});
		}
		let screen = this.state.activeInterface;
		IXIGO.loginEventHandler.verifyUpdateByOtp(
			(response) => {
				if (isFirstHit) {
					self.changeInterface('verify');
					let obj = Object.assign({}, self.state.verify);
					obj.type = "reverify";
					if (data.phNo) {
						obj.subHeading = "An OTP has been sent on your phone: <br/>" + data.prefix + "-" + data.phNo;
					} else {
						obj.subHeading = "An OTP has been sent on your email: " + data.email;
					}
					self.setState({
						isLoading: false,
						verify: obj
					});
				} else {
					let obj = Object.assign({}, self.state[screen]);
					obj.sendingOTP = false; obj.allowResendOTP = false;

					self.setState({
						isLoading: false,
						[screen]: obj
					});

					setTimeout(() => {
						let obj = Object.assign({}, self.state[screen]);
						obj.allowResendOTP = true;
						self.setState({ [screen]: obj });
					}, 15000);
				}
			}, (code, message) => {
				let obj = Object.assign({}, self.state[screen]);
				//obj.errorOTP = true;
				obj.sendingOTP = false;
				obj.errorMessageForm = message ? message : "Oops! Something went wrong. Please try again later.";
				self.setState({
					[screen]: obj,
					isLoading: false
				});
			},
			data, deviceTime
		);
	}
	resendOTP(){
		let params = {};
		let self = this;
		if(this.state.verify.type == "signup"){
	   		let obj = Object.assign({}, this.state.verify);
	   		obj.sendingOTP = true;
	        this.setState({
	        	verify : obj
	        });
			params = {
	            prefix: this.state.signup.phonePrefix,
	            phNo: this.state.signup.phone
	        };
		}
		else if(this.state.verify.type == "forgotPassword"){
			let obj = Object.assign({}, this.state.verify);
			obj.sendingOTP = true;
			this.setState({
				verify : obj
			});
			this.forgotPassword('resend');
			return;
		}
		else if(this.state.verify.type == "reverify"){
			let obj = Object.assign({}, this.state.verify);
			obj.sendingOTP = true;
			this.setState({
				verify : obj
			});
			this.updateInfoResendOTP('postLoginVerify');
			return;
		}

        IXIGO.loginEventHandler.resendOTP(
            function(argument) {
                let obj = Object.assign({}, self.state.verify);
       	   		obj.sendingOTP = false; obj.allowResendOTP = false;
       	        self.setState({
       	        	verify : obj
       	        });

       	        setTimeout(()=>{
		        	let obj = Object.assign({}, self.state.verify);
		        	obj.allowResendOTP = true;
		        	self.setState({
			        	verify : obj
			        });
		        }, 15000);
            },
            function(code, message) {
	            let obj = Object.assign({}, self.state.verify);
    	   		//obj.errorOTP = true;
    	   		obj.sendingOTP = false;
                if(code == "1053" || code == "1054"){
                    obj.errorMessageForm = message;
                }else if(code == "1015"){
                    obj.errorMessageForm = message.toLowerCase();
                }else{
                    obj.errorMessageForm = 'Oops! Something went wrong. Please try again later.';
                }
    	        self.setState({
    	        	verify : obj
    	        });
            },
            params
        );
	}
	onSubmitOTP(){
		let otpInput = this.state.verify.otp.join('');
		if (this.validateOTPInput('verify', otpInput)) {
			let tempObj = Object.assign({}, this.state.verify);
			//tempObj.errorOTP = false;
			const erroMsg = "";
			this.setState({
				isLoading: true,
				verify: tempObj,
				erroMsg: erroMsg
			});
			if (this.state.verify.type == "signup") {
				this.verifyOTP_signup(otpInput);
			} else if (this.state.verify.type == "reverify") {
				this.verifyOTP_reverify(otpInput);
			}
		}
	}

	verifyOTP_signup(otpInput) {
		let self = this;
		IXIGO.loginEventHandler.verifyOTP(function () {
			self.isQualifiedForSuccess = true;
			self.changeInterface("successScreen");
			let obj = Object.assign({}, self.state.verify);
			//obj.errorOTP = false;
			let successObj = Object.assign({}, self.state.successScreen);
			successObj.text = "You have sucessfully signed up for ixigo. Logging you in...";
			self.setState({
				verify: obj,
				successScreen: successObj,
				isLoading: false
			});
			setTimeout(function () {
				self.closePopup(null, "success");
			}, 3000);
		}, function (code, message) {
			let obj = Object.assign({}, self.state.verify);
			obj.errorOTP = true;
			obj.errorMessageForm = (message ? message : "Oops! Something went wrong. Please try again later.");
			self.setState({
				verify: obj,
				isLoading: false
			});
		}, { otp: otpInput });
	}

	verifyOTP_reverify(otpInput) {
		let self = this;
		let params = {
			otp: otpInput
		};
		const form = this.state.postLoginVerify;
		if (form.phone) {
			params.prefix = form.phonePrefix;
			params.phNo = form.phone;
		} else if (form.email) {
			params.email = form.email;
		}
		IXIGO.loginEventHandler.verifyUpdateSentOtp(function (response) {
			self.isQualifiedForSuccess = true;
			let obj = Object.assign({}, self.state.verify);
			obj.errorOTP = false;
			self.changeInterface("successScreen");
			let successObj = Object.assign({}, self.state.successScreen);
			successObj.text = "You have sucessfully verified your " + (params.email ? "email" : "mobile number") + ".";
			self.setState({
				verify: obj,
				successScreen: successObj,
				isLoading: false
			});
			setTimeout(function () {
				self.closePopup(null, "success");
			}, 3000);
		}, function (code, msg) {
			let obj = Object.assign({}, self.state.verify);
			obj.errorOTP = true;
			obj.errorMessageForm = msg ? msg : "Oops! Something went wrong. Please try again later.";
			self.setState({
				verify: obj,
				isLoading: false
			});
		}, params);
	}

	validateOTPInput(source, otpInput) {
		let self = this;
		const view = this.state.activeInterface;
		let otpCheck = otpInput.trim().match('^[0-9]+$');
		if (!otpCheck || otpInput.trim().length != 4) {
			let obj = Object.assign({}, this.state[view]);
			//obj.errorOTP = true;
			obj.errorMessageForm = "Please enter a valid OTP and try again.";
			self.setState({
				[view]: obj
			});
			return false;
		}
		return true;
	}

	onResetPassword(){
		let self = this;
		let otpValue = this.state.verify.otp.join('').trim();
		let otpCheck = otpValue.match('^[0-9]+$');
		let passwordCheck = this.state.verify.password.trim();
        
		if (!otpCheck || otpCheck.input.length != 4){
            let obj = Object.assign({}, this.state.verify);
            obj.errorOTP = true;
            obj.errorMessageForm = "Please enter a valid OTP and try again.";
            self.setState({
            	verify : obj
            });
            return false;
		}
		if (!passwordCheck || passwordCheck.length < 8) {
			let obj = Object.assign({}, this.state.verify);
			obj.errorPassword = true;
			obj.errorMessagePassword = "Set a password with atleast 8 characters.";
			self.setState({
				verify: obj
			});
			return false;
		}
		
		let obj = Object.assign({}, this.state.verify);
		obj.errorOTP = false;
		obj.errorMessageForm = "";
		this.setState({
			verify: obj
		});

		let params = {
            email : this.state.forgot.email,
			otp: otpValue,
			pw: this.state.verify.password
        };

        this.setState({
        	isLoading : true
        });

        IXIGO.loginEventHandler.resetPassword(
            function(argument) {
				self.isQualifiedForSuccess = true;
				let obj = Object.assign({}, self.state.successScreen);
                obj.text = "password reset successfully";
                self.setState({
					activeInterface: "successScreen",
					successScreen : obj,
                	isLoading : false
                });
                self.props.updatePopupStateCallback({
                	activeInterface : self.state.activeInterface
                });
                setTimeout(function(){
					self.closePopup(null, "success");
                }, 5000);
            },
            function(code, message) {
                let obj = Object.assign({}, self.state.verify);
                obj.errorOTP = true;
                if(code == "1031" || code == "1071" || code == "1072" || code == "1073"){
                    obj.errorMessageForm = message;
                }else{
                    obj.errorMessageForm = 'Oops! Something went wrong. Please try again later.';
                }
                self.setState({
                	verify : obj,
                	isLoading : false
                });
            },
            params
        );

	}
	travellerPrefixChangeHandler(value){
		let obj = Object.assign({}, this.state.signup);
		obj.prefix = (!isNaN(parseInt(value, 10)) && this.prefix[value] && this.prefix[value].text) || null;
		obj.errorMessageForm = "";
		if(obj.prefix){
			this.setState({
				signup: obj
			})
		}
	}
	countryCodeChangeHandler(selected){
		let view = this.state.activeInterface;
		let obj = Object.assign({}, this.state[view]);
		let split = selected.split("-");
		obj.phonePrefix = split[0];
		obj.countryCode = split[1];
		obj.errorPhone = false;
		obj.errorMessageForm = "";
		this.setState({ [view] : obj });
	}
	registerClickHandler(){
		if(this.validateSignUp()){
			this.setState({
				isLoading : true
			});
	        if(IXIGO.loginEventHandler){
	        	this.sendSignupRequest();
	        }
	        else{
				IXIGO.HELPER.loadLoginLib(this.sendSignupRequest, function(error){
	        		console.log(error);
	        	}, this.props.staticPath);
	        }
		}
	}
	sendSignupRequest(){
		let self = this;
		let params = {
            title : this.state.signup.prefix,
            firstName : this.state.signup.name,
            lastName : this.state.signup.surname,
            phNo : this.state.signup.phone,
            prefix : this.state.signup.phonePrefix,
            countryCode : this.state.signup.countryCode,
            email : this.state.signup.email,
            password : this.state.signup.password
        };
		IXIGO.loginEventHandler.signUpUser(
		    function() {
				self.isQualifiedForSuccess = true;
		    	self.resetInterface("verify");
		    	let obj = Object.assign({}, self.state.verify);
		    	obj.type = "signup";
		    	obj.subHeading = "An OTP has been sent on your phone: <br/>" + self.state.signup.phonePrefix + '-' + self.state.signup.phone;
		        self.setState({
		        	activeInterface : "verify",
		        	verify : obj,
		        	isLoading : false
		        }, () => {
					if (self.otpInput) {
						self.otpInput.onClickLabel();
					}
				});
		    },
		    function(code, message) {
		        let obj = Object.assign({}, self.state.signup);
		        if(code == "1011" || code == "1012" || code == "1013"){
		        	obj.errorEmail = true;
		        	obj.errorMessageEmail = message.toLowerCase();
		        }
		        else if(code == "1015"){
		            obj.errorPhone = true;
		            obj.errorMessagePhone = message.toLowerCase();
		        }else{
					obj.errorMessageForm = message ? message : 'Oops! Something went wrong. Please try again later.';
		        }
	            self.setState({
	            	signup : obj,
	            	isLoading : false
	            });
		    },
		    params
		);
	}
	validateSignUp(){
		let signup = this.state.signup;
		let obj = Object.assign({}, this.state.signup);
		let checkFName = signup.name.trim().match(/^[a-zA-Z ]{2,26}$/);
		let checkLName = signup.surname.trim().match(/^[a-zA-Z ]{2,26}$/);
		let checkMobile = signup.phone.trim().match('^[0-9]+$');

		if(!checkFName){
			obj.errorMessageName = "First name must have 2-26 characters in it.";
			obj.errorName = true;
			this.setState({
				signup : obj
			});
			return false;
		}
		if(!checkLName){
			obj.errorMessageSurname = "Last name must have 2-26 characters in it.";
			obj.errorSurname = true;
			this.setState({
				signup : obj
			});
			return false;
		}
		if(!this.isValidEmail(signup.email)){
			obj.errorMessageEmail = "Please enter a valid email address.";
			obj.errorEmail = true;
			this.setState({
				signup : obj
			});
			return false;
		}
		if(checkMobile == null || checkMobile.length == 0){
			obj.errorMessagePhone = "Please enter a valid phone number.";
			obj.errorPhone = true;
			this.setState({
				signup : obj
			});
			return false;
		}
		if(!signup.password || (signup.password.length < 8)){
			obj.errorMessagePassword = "Set a password with atleast 8 characters.";
			obj.errorPassword = true;
			this.setState({
				signup : obj
			});
			return false;
		}
		return true;
	}

	validateSignIn(){
		let signIn = this.state.main;
		let obj = Object.assign({}, this.state.main);

		if(!this.isValidEmail(signIn.email)){
			obj.errorMessageEmail = "Please enter a valid email address.";
			obj.errorEmail = true;
			this.setState({
				main : obj
			});
			return false;
		}
		if(!signIn.password || (signIn.password.length < 8)){
			obj.errorMessagePassword = "Password should be atleast 8 characters.";
			obj.errorPassword = true;
			this.setState({
				main : obj
			});
			return false;
		}

		return true;
	}

	onChangeInput(value, field) {
		const view = this.state.activeInterface;
		let obj = Object.assign({}, this.state[view]);
		obj[field.toLowerCase()] = value;
		obj["error" + field] = false;
		obj["errorMessage" + field] = "";
		obj.errorMessageForm = "";
		this.setState({ [view]: obj });
	}

	renderCountryCode(inputList){
		let list = [];
		if(inputList && inputList.length){
			for(let index in inputList){
				list[index] = {
					text: inputList[index].label
				}
			}
		}
		return list;
	}

	onPressEnter(e){
		if(this.state.activeInterface == "main"){
			this.loginButtonHandler();
		}
		else if(this.state.activeInterface == "forgot"){
			this.forgotEmailSubmit();
		}
		else if(this.state.activeInterface == "signup"){
			this.registerClickHandler();
		}
		else if(this.state.activeInterface == "verify"){
			if(this.state.verify.type == "signup" || this.state.verify.type == "reverify"){
				this.onSubmitOTP();
			}
			else{
				this.onResetPassword();
			}
		}
		else if (this.state.activeInterface == "postLoginVerify") {
			this.updateUserInfoRequest();
		}
		else{
			return;
		}
	}

	attachLoginEventHandler() {
		if(IxiUtils.isBrowser){
			$(document).off('click', ".facebook-login.login-button").on("click", ".facebook-login.login-button", (event) => {
				this.facebookLoginHandler();
			});

			$(document).off('click', ".google-login.login-button").on("click", ".google-login.login-button", (event) => {
				this.googleLoginHandler();
			});
		}
	}

	componentDidMount(){
		let attributes = this.props.popupAttributes;
		if (attributes && attributes.activeInterface == "mobileVerify") {
			this.openPostLogin(true);
		} 
		
		document.addEventListener("keydown", (event)=>{
			if(event.type == 'keydown' && event.keyCode == 13 && this.props.popupAttributes.isloginPopupVisible){
				this.onPressEnter();
			}
		});

		this.setState({isLoading: true});

		IXIGO.HELPER.loadLoginLib(()=> {
			this.setState({isLoading: false});
		}, () => {
			//display error;
			this.setState({isLoading: false});
		}, this.props.staticPath);
	}

	renderLoadingAnimation(text){
		return <Loader isLoading={this.state.isLoading} text={text} type="horizontal" />
	}

	showCreativeSection() {
		let show = "";
		if (this.state.activeInterface == "successScreen") {
			show = "hide-creative";
		}
		return show;
	}

	render(){
		let className = this.props.popupAttributes.isloginPopupVisible ? "login-popup " : "login-popup u-hide";
		let activeInterface = this.state.activeInterface;
		
		if(this.props.popupAttributes.isloginPopupVisible && activeInterface == "main") {
			this.attachLoginEventHandler();
		}

		return (this.props.popupAttributes.isloginPopupVisible ?
			<div className={"login-popup " + (this.props.loginType ? this.props.loginType : '') + (this.props.isEmbedded ? '-embedded' : '') + ' ' + this.showCreativeSection()}>
				<Popup disableClose={this.props.disableClose} closePopup={this.closePopup} contentPadding={false} backgroundClass={this.props.disableClose ? 'dark' : null} >
					<div className="login-container">
						<div className="creative-section">
							{this.props.bannerImg !== false ?
								<img style={{width:'300px'}} src={this.props.imgPath + (this.props.bannerImg || '/rt/pc/img/login/banner.png?v=1')} />
								: null
							}
						</div> 
						<div className="content-section">
							{this.state.isLoading ? this.renderLoadingAnimation("Loading") : ""}

							{activeInterface == "main" ?
								<div className="main-interface">
									{this.props.enableBranding ?
										<img src="https://images.ixigo.com/image/upload/8a178b024470af59d0e1387babf3d02c-imdac.png" className="brand-icon" />
										: null
									}
									<div className="alt-view-link">
										Don&#39;t have an account? <span onClick={()=>{this.changeInterface("signup")}}>SIGN UP</span>
									</div>

									<div className="heading">{this.props.disableClose ? <span className="small">Log in for seamless booking experience</span> : 'Sign in to your account'}</div>

									<div className="ixigo-login">
										<Input label="Email" className="login-email" placeholder="userid@gmail.com" noBorder={false} type="email" changeCallback={this.onChangeEmail} isError={this.state.main.errorEmail} errorMessage={this.state.main.errorMessageEmail} val={this.state.main.email} name="email" isFocus={this.state.main.isFocusEmail} focusCallback= {this.onFocusEmail}  blurCallback= {this.onBlurEmail} />
										<Input label="Password" className="login-password" placeholder="*********" noBorder={false} type="password" changeCallback={this.onChangePassword} isError={this.state.main.errorPassword} errorMessage={this.state.main.errorMessagePassword} val={this.state.main.password} name='password' isFocus={this.state.main.isFocusPassword} focusCallback={this.onFocusPassword} blurCallback={this.onBlurPassword} />
										<div className="reset-password">
											<a onClick={()=>this.changeInterface("forgot")}>Forgot Password?</a>
										</div>

										{this.state.main.errorMessageForm ? <div className="form-error-msg">{this.state.main.errorMessageForm} <div className="ixi-icon-error"></div></div> : null}
										<div className='ixigo-terms'>By logging in, I understand & agree to ixigo <a target='_blank' href='/about/more-info/terms-of-use/'>Terms of Use</a> and <a target='_blank' href='/about/more-info/privacy/'>Privacy Policy</a></div>
										<div className="ixigo-login login-button">
											<Button text="LOGIN" onClick={this.loginButtonHandler} />
										</div>
									</div>

									<div className="or">OR</div>

									<div className="login-options">
										<div className="facebook-login login-button">
											<Button text="Facebook" iconClass="ixi-icon-facebook" iconPosition="left" />
										</div>
										<div className="google-login login-button">
											<Button text="Google" iconClass="google-plus-icon" iconPosition="left" />
										</div>
									</div>

									<div className="u-clear"></div>
								</div>
								: ""
							}
							{activeInterface == "signup" ?
								<div className="signup-interface">
									{this.props.enableBranding ?
										<img src="https://images.ixigo.com/image/upload/8a178b024470af59d0e1387babf3d02c-imdac.png" className="brand-icon" />
										: null
									}
									<div className="alt-view-link">
										Already have an account? <span onClick={()=>{this.changeInterface("main")}}>SIGN IN</span>
									</div>
									<div className="heading">Create your account</div>

									<div className="input-group">
										<label>Name</label>
										<div>
											<span className="prefix-group" onClick={() => this.setState({isPrefixDDVisible: !this.state.isPrefixDDVisible})}>
												<Dropdown className="list" caretClassName='dd-icon' text={this.state.signup.prefix} itemClickCallback={this.travellerPrefixChangeHandler.bind(this)} items={this.prefix} isVisible={this.state.isPrefixDDVisible} selected={this.state.signup.prefix} />
											</span>
											<Input className="name-input" placeholder="First Name" noBorder={false} changeCallback={(val) => this.onChangeInput(val, "Name")} isError={this.state.signup.errorName} val={this.state.signup.name} name="firstName" />
											<Input className="name-input" placeholder="Last Name" noBorder={false} changeCallback={(val) => this.onChangeInput(val, "Surname")} isError={this.state.signup.errorSurname} val={this.state.signup.surname} name="lastName" />
											{this.state.signup.errorName ? (
												<div className="error-message">{this.state.signup.errorMessageName} <div className="ixi-icon-error"></div></div>
											) : ""}
											{this.state.signup.errorSurname ? (
												<div className="error-message">{this.state.signup.errorMessageSurname} <div className="ixi-icon-error"></div></div>
											) : ""}
										</div>
									</div>

									<Input className="input-group" label="Email" placeholder="Enter your email ID" noBorder={false} errorMessage={this.state.signup.errorMessageEmail} changeCallback={this.onChangeEmail} isError={this.state.signup.errorEmail} val={this.state.signup.email} name="email" type="email" isFocus={this.state.signup.isFocusEmail} focusCallback={this.onFocusEmail}  blurCallback={this.onBlurEmail} />
									<MobileInput className="input-group" label="Mobile Number" placeholder="9818XXXXX1" noBorder={false} countryCodeSelectHandler={this.countryCodeChangeHandler.bind(this)} phonePrefix={this.state.signup.phonePrefix} errorMessage={this.state.signup.errorMessagePhone} changeCallback={(val) => this.onChangeInput(val, "Phone")} isError={this.state.signup.errorPhone} val={this.state.signup.phone} name="mobile" type="tel" selectedOption={`${this.state.signup.phonePrefix}-${this.state.signup.countryCode}`} isFocus={this.state.signup.isFocusMobile} focusCallback={this.onFocusMobile}  blurCallback={this.onBlurMobile} />
									<Input className="input-group" placeholder="Enter password" noBorder={false} errorMessage={this.state.signup.errorMessagePassword} changeCallback={this.onChangePassword} isError={this.state.signup.errorPassword} val={this.state.signup.password} type="password" />
									
									{this.state.signup.errorMessageForm ? <div className="form-error-msg">{this.state.signup.errorMessageForm} <div className="ixi-icon-error"></div></div> : null}
									<div className='ixigo-terms'>By clicking on register, I understand & agree to ixigo <a target='_blank' href='/about/more-info/terms-of-use/'>Terms of Use</a> and <a target='_blank' href='/about/more-info/privacy/'>Privacy Policy</a></div>
									<Button text="Register" onClick={this.registerClickHandler.bind(this)}/>
								</div>
								: ""
							}
							{activeInterface == "verify" ?
								<div className="verify-interface">
									{this.state.verify.type == "forgotPassword" || this.state.verify.type == "reverify" ?
										<span className="back-arrow" onClick={() => { this.changeInterface(this.state.verify.type == "forgotPassword" ? "forgot" : "postLoginVerify", this.state.verify.type == "reverify" ? true : false )}}><i className="ixi-icon-arrow back-icon"></i></span>
										: null
									}
									<div className="header-container">
										<div className="heading">{this.state.verify.type == "forgotPassword" ? 'Reset Password' : 'Mobile Verification'}</div>
										<div className="sub-heading" dangerouslySetInnerHTML={{__html: this.state.verify.subHeading}}></div>
									</div>
									<div className="input-group">
										<div className="otp-input-wrapper">
											<div className="label-text">One Time Password (OTP)</div>
											<div className="otp-input-group">
												<div className="otp-input">
													<Input id="otp-0" className="input-group" type="text" maxLength={1} val={this.state.verify.otp[0]} isFocus={this.state.verify.isFocusOTP == 0} focusCallback={(e) => this.onFocusOTP(e, 0)} blurCallback={this.onBlurOTP} changeCallback={this.onChangeOTP} keyDownCallback={this.keyDownCallbackOTP} isReadOnly={this.state.verify.isFocusOTP != 0 ? true : false} autocomplete="off" ref={ref => (this.otpInput = ref)} />
												</div>
												<div className="otp-input">
													<Input id="otp-1" className="input-group" type="text" maxLength={1} val={this.state.verify.otp[1]} isFocus={this.state.verify.isFocusOTP == 1} focusCallback={(e) => this.onFocusOTP(e, 1)} blurCallback={this.onBlurOTP} changeCallback={this.onChangeOTP} keyDownCallback={this.keyDownCallbackOTP} isReadOnly={this.state.verify.isFocusOTP != 1 ? true : false} autocomplete="off" />
												</div>
												<div className="otp-input">
													<Input id="otp-2" className="input-group" type="text" maxLength={1} val={this.state.verify.otp[2]} isFocus={this.state.verify.isFocusOTP == 2} focusCallback={(e) => this.onFocusOTP(e, 2)} blurCallback={this.onBlurOTP} changeCallback={this.onChangeOTP} keyDownCallback={this.keyDownCallbackOTP} isReadOnly={this.state.verify.isFocusOTP != 2 ? true : false} autocomplete="off" />
												</div>
												<div className="otp-input">
													<Input id="otp-3" className="input-group" type="text" maxLength={1} val={this.state.verify.otp[3]} isFocus={this.state.verify.isFocusOTP == 3} focusCallback={(e) => this.onFocusOTP(e, 3)} blurCallback={this.onBlurOTP} changeCallback={this.onChangeOTP} keyDownCallback={this.keyDownCallbackOTP} isReadOnly={this.state.verify.isFocusOTP != 3 ? true : false} autocomplete="off" />
												</div>
											</div>
										</div>
										<div className="resend-cta">
											{(this.state.verify.sendingOTP || !this.state.verify.allowResendOTP) ?
												(!this.state.verify.sendingOTP ? <span className="disabled">OTP sent</span> : <span>sending...</span>)
												:
												(<span className="label-text">Didn't receive OTP? <span className="link-text" onClick={this.resendOTP.bind(this)}>Resend OTP</span></span>)
											}
										</div>
										{this.state.verify.type == "forgotPassword" && this.state.verify.otp.join('').length == 4 ? (
											<div className="elm">
												<Input label="New Password" placeholder="*********" noBorder={false} type="password" changeCallback={this.onChangePassword} isError={this.state.verify.errorPassword} errorMessage={this.state.verify.errorMessagePassword} val={this.state.verify.password} name='password' isFocus={this.state.verify.isFocusPassword} focusCallback={this.onFocusPassword} blurCallback={this.onBlurPassword} />
											</div>
											) : null
										}
									</div>

									{this.state.verify.errorMessageForm ? <div className="form-error-msg">{this.state.verify.errorMessageForm}<div className="ixi-icon-error"></div></div> : null}

									{this.state.verify.type != "forgotPassword" ?  (
										<Button text="Verify" onClick={this.onSubmitOTP.bind(this)} />
									) : (
										<Button text="Reset" onClick={this.onResetPassword.bind(this)} />
									)}
								</div>
								: ""
							}
							{activeInterface == "forgot" ?
								<div className="forgot-interface">
									<span className="back-arrow" onClick={() => {this.changeInterface("main")}}><i className="ixi-icon-arrow back-icon"></i></span>
									<div className="header-container">
										<div className="heading">Forgot Password</div>
									</div>
									<div className="input-group">
										<Input label="Email" placeholder="userid@gmail.com" noBorder={false} errorMessage={this.state.forgot.errorMessage} changeCallback={this.onChangeEmail} isError={this.state.forgot.errorEmail} val={this.state.forgot.email} type="email" name="email" isFocus={this.state.forgot.isFocusEmail} focusCallback= {this.onFocusEmail}  blurCallback= {this.onBlurEmail} />
									</div>
									<Button text="Submit" onClick={this.forgotEmailSubmit} />
								</div>
								: ""
							}
							{activeInterface == "successScreen" ? 
								<div className="success-signup-interface">
									<Image className="success-symbol" src={this.props.imgPath + "/rt/pc/img/login/success.png"} src2x={this.props.imgPath + "/rt/pc/img/login/success@2x.png"} />
									<div className="header-text">Congratulations</div>
									<div className="custom-message">{this.state.successScreen.text}</div>
								</div>
								: ""
							}
							{activeInterface == "postLoginVerify" ?
								<div className="post-login-interface">
									<div className="header-container">
										<div className="heading">Welcome to ixigo</div>
									</div>
									<div className="profile-info-wrapper">
										<div className="pf-image">
											<Image src={"https://images.ixigo.com/node_image/user_pic/" + this.state.postLoginVerify.userId + ".jpg"} />
										</div>
										<div className="pf-info">
											<div className="user-name">{this.state.postLoginVerify.name}</div>
											<div className="sub-text">Help us secure your account</div>
										</div>
									</div>
									{this.props.popupAttributes.reason ? 
										<div className="reasonText">{this.props.popupAttributes.reason}</div>
										: ""
									}
									{this.state.postLoginVerify.showEmail ?
										<Input className="input-group" label="Email" placeholder="Enter your email ID" noBorder={false} errorMessage={this.state.postLoginVerify.errorMessageEmail} changeCallback={this.onChangeEmail} isError={this.state.postLoginVerify.errorEmail} val={this.state.postLoginVerify.email} name="email" type="email" isFocus={this.state.postLoginVerify.isFocusEmail} focusCallback={this.onFocusEmail} blurCallback={this.onBlurEmail} />
										: ""
									}
									<MobileInput className="input-group" label="Mobile Number" placeholder="9818XXXXX1" noBorder={false} countryCodeSelectHandler={this.countryCodeChangeHandler.bind(this)} phonePrefix={this.state.postLoginVerify.phonePrefix} errorMessage={this.state.postLoginVerify.errorMessagePhone} changeCallback={(val) => this.onChangeInput(val, "Phone")} isError={this.state.postLoginVerify.errorPhone} val={this.state.postLoginVerify.phone} name="mobile" type="tel" selectedOption={`${this.state.postLoginVerify.phonePrefix}-${this.state.postLoginVerify.countryCode}`} isFocus={this.state.postLoginVerify.isFocusMobile} focusCallback={this.onFocusMobile} blurCallback={this.onBlurMobile} />
									{this.state.postLoginVerify.errorMessageForm ? <div className="form-error-msg">{this.state.postLoginVerify.errorMessageForm} <div className="ixi-icon-error"></div></div> : null}
									<div className="continue-cta">
										<Button text="Continue" onClick={this.updateUserInfoRequest} />
									</div>
								</div>
								: ""
							}
				    	</div>
					</div>
				</Popup>
			</div>
			: ''
		);
	}
}

/*LoginWidget.propTypes = {
    loginCallBack : React.PropTypes.func,
    updatePopupStateCallback : React.PropTypes.func
};*/
LoginWidget.defaultProps = {
    loginCallBack:() => {},
	loginFailureCallback:() => {},
    updatePopupStateCallback:() => {},
};
