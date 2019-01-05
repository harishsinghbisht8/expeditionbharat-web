import { h, render, Component } from 'preact';
import IxiUtils from "../../../common/js/ixiUtils";
import CommonURLs from '../url_builder';
import Popup from './popup';

const googleyoloCred = {
    supportedAuthMethods: [
        "https://accounts.google.com",
        "googleyolo://id-and-password"
    ],
    supportedIdTokenProviders: [
        {
            uri: "https://accounts.google.com",
            clientId: IxiUtils.HELPER.getGoogleClientId()
        }
    ],
    context: 'continue'
};

export default class AutoLogin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            globalMsg: {
                type: "",
                text: ""
            }
        };
        this.savedSwitchPref = null;
        this.staticPath = this.props.staticPath || "";
        ["fetchAutoLoginConfig", "triggerAutoGoogleLogin", "closePopup"].forEach(fn => (this[fn] = this[fn].bind(this)));
    }

    componentDidMount() {
        this.fetchAutoLoginConfig();
    }

    fetchAutoLoginConfig() {
        if (this.triggerAutoLogin()) {
            if (this.savedSwitchPref == null) {
                IxiUtils.AJAX.get(IxiUtils.AJAX.buildURL(CommonURLs.cmsContent, ["login", "autoLogin", "url"])).then(response => {
                    if (response && response.enabled) {
                        this.launchAutoLogin();
                    }
                    this.savedSwitchPref = (response && response.enabled != null ? response.enabled : null);
                }, () => { });
            } else if (this.savedSwitchPref) {
                this.launchAutoLogin();
            }
        }
    }

    launchAutoLogin() {
        IXIGO.HELPER.loadLoginLib(() => {
            IXIGO.HELPER.loadJS('https://smartlock.google.com/client', this.triggerAutoGoogleLogin, () => {
                console.log("could not load - one tap google login js");
            });
        }, () => {
            console.log("could not load - loginlib");
        }, this.staticPath);

        if (IXIGO.SESSION_STORAGE && IXIGO.SESSION_STORAGE.isAvailable) {
            IXIGO.SESSION_STORAGE.setItem('autoLogin', true);
        }
    }

    componentWillUnmount() {
        if (typeof googleyolo == "object") {
            googleyolo.cancelLastOperation().then(() => {
                console.log('close google auto login');
            });
        }
    }

    triggerAutoLogin() {
        let trigger = false;
        if (!IXIGO.HELPER.isForeignEnvironment() && !IXIGO.loginHandler.isLoggedIn() && IXIGO.SESSION_STORAGE && IXIGO.SESSION_STORAGE.isAvailable && !IXIGO.SESSION_STORAGE.getItem('autoLogin')) {
            trigger = true;
        }
        return trigger;
    }

    triggerAutoGoogleLogin() {
        if (!googleyolo) return;
        googleyolo.retrieve(googleyoloCred).then((credential) => {
            if (credential) {
                switch (credential.authMethod) {
                    case "googleyolo://id-and-password":
                        this.loginUsingIxigoCred(credential);
                        break;
                    case "https://accounts.google.com":
                        this.loginUsingGoogleCred(credential);
                    default:
                        break;
                }
            }
        }, (e) => {
            console.log(e);
        });
    }

    loginUsingIxigoCred(credential, failureOverride) {
        if (!credential) return;
    
        window.IXIGO.loginHandler.loginUsingIxigoCred((name, userId, imageSrc) => {
            this.props.successCallback(name, userId, imageSrc, true); // 4th parameter to tell listing page that it is autologin
            this.showSuccessMessage();
        }, () => {
            if (typeof failureOverride == "function") {
                failureOverride();
            } else {
                this.props.failureCallback();
                this.showErrorMessage();
            }
        }, {
            username: credential.id,
            password: credential.password
        });
    }

    loginUsingGoogleCred(credential, failureOverride) {
        if (!credential) return;

        window.IXIGO.loginHandler.loginUserUsingGoogle((name, userId, imageSrc) => {
            this.props.successCallback(name, userId, imageSrc, true); // 4th parameter to tell listing page that it is autologin
            this.showSuccessMessage();
        }, () => {
            if (typeof failureOverride == "function") {
                failureOverride();
            } else {
                this.props.failureCallback();
                this.showErrorMessage();
            }
        }, {
            signInOptions: {
                login_hint: credential.id,
                prompt: 'none'
            },
            token: credential.idToken ? credential.idToken : null
        });
    }

    // loginUsingFbCred(credential, failureOverride) {
    //     if (!credential) return;

    //     window.IXIGO.loginHandler.loginUserUsingFacebook((name, userId, imageSrc) => {
    //         this.props.successCallback(name, userId, imageSrc, true); // 4th parameter to tell listing page that it is autologin
    //         this.showSuccessMessage();
    //     }, () => {
    //         if (typeof failureOverride == "function") {
    //             failureOverride();
    //         } else {
    //             this.props.failureCallback();
    //             this.showErrorMessage();
    //         }
    //     }, {
    //         login_hint: credential.id
    //     });
    // }

    showSuccessMessage() {
        window.IXIGO.loginHandler.getUserInfo().then((info) => {
            info = info ? info.split("|") : [];
            if (info.length) {
                this.setPopupData("success", "You have now logged in " + (info[6] ? "with " + info[6] : info[2] ? "as " + info[2] : ""));
            }
        });
    }

    showErrorMessage() {
        this.setPopupData("error", "We were not able to log you in. Please try again later.");
    }

    renderPopup() {
        let msgObj = this.state.globalMsg;
        return (
            <div className={"one-tap-login-popup " + msgObj.type}>
                <Popup disableClose={this.props.disableClose} closePopup={this.closePopup} closePopupCallback={this.closePopup}>
                    {msgObj.type == "success" ?
                        <span className="u-ib icon ixi-icon-tick-circle"></span>
                        : <span className="u-ib icon ixi-icon-cross-circle"></span>
                    }
                    <div className="status-text">{msgObj.text}</div>
                </Popup>
            </div>
        );
    }

    closePopup() {
        let globalMsg = this.state.globalMsg;
        this.setState({
            globalMsg: Object.assign({}, globalMsg, {
                text: ""
            })
        });
    }

    setPopupData(type, msg) {
        if (msg) {
            this.setState({
                globalMsg: {
                    type: type ? type : "",
                    text: msg
                }
            });
            setTimeout(() => {
                this.closePopup();
            }, 3000);
        }
    }

    render() {
        return this.state.globalMsg.text ? this.renderPopup() : "";
    }
}

AutoLogin.defaultProps = {
    successCallback: () => { },
    failureCallback: () => { },
    showPopup: () => { },
    disableCredentialApi: false,
    disableOneTapLogin: false
};
