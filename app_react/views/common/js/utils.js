let isBrowser = typeof window != 'undefined';
let isLocalStorage = false;

if (isBrowser) {
	try {
		window.localStorage.setItem('test', 'test');
		window.localStorage.removeItem('test');
		isLocalStorage = true;
	} catch (e) {
		isLocalStorage = false;
	}

	document.querySelector('body').style.overscrollBehavior = 'contain';

	(function(funcName, baseObj) {
	    funcName = funcName || "docReady";
	    baseObj = baseObj || window;
	    var readyList = [];
	    var readyFired = false;
	    var readyEventHandlersInstalled = false;
	    
	    function ready() {
	        if (!readyFired) {
	            // this must be set to true before we start calling callbacks
	            readyFired = true;
	            for (var i = 0; i < readyList.length; i++) {
	                // if a callback here happens to add new ready handlers,
	                // the docReady() function will see that it already fired
	                // and will schedule the callback to run right after
	                // this event loop finishes so all handlers will still execute
	                // in order and no new ones will be added to the readyList
	                // while we are processing the list
	                readyList[i].fn.call(window, readyList[i].ctx);
	            }
	            // allow any closures held by these functions to free
	            readyList = [];
	        }
	    }
	    
	    function readyStateChange() {
	        if ( document.readyState === "complete" ) {
	            ready();
	        }
	    }
	    
	    // This is the one public interface
	    // docReady(fn, context);
	    // the context argument is optional - if present, it will be passed
	    // as an argument to the callback
	    baseObj[funcName] = function(callback, context) {
	        if (typeof callback !== "function") {
	            throw new TypeError("callback for docReady(fn) must be a function");
	        }
	        // if ready has already fired, then just schedule the callback
	        // to fire asynchronously, but right away
	        if (readyFired) {
	            setTimeout(function() {callback(context);}, 1);
	            return;
	        } else {
	            // add the function and context to the list
	            readyList.push({fn: callback, ctx: context});
	        }
	        // if document already ready to go, schedule the ready function to run
	        // IE only safe when readyState is "complete", others safe when readyState is "interactive"
	        if (document.readyState === "complete" || (!document.attachEvent && document.readyState === "interactive")) {
	            setTimeout(ready, 1);
	        } else if (!readyEventHandlersInstalled) {
	            // otherwise if we don't have event handlers installed, install them
	            if (document.addEventListener) {
	                // first choice is DOMContentLoaded event
	                document.addEventListener("DOMContentLoaded", ready, false);
	                // backup is window load event
	                window.addEventListener("load", ready, false);
	            } else {
	                // must be IE
	                document.attachEvent("onreadystatechange", readyStateChange);
	                window.attachEvent("onload", ready);
	            }
	            readyEventHandlersInstalled = true;
	        }
	    }
	})("docReady", window);
}

let LOCAL_STORAGE = {
	isAvailable: isLocalStorage,
	setItem: function (key, val) {
		if (!isBrowser || !key) return;
		if (isLocalStorage) {
			return window.localStorage.setItem(key, val);
		} else {
			return COOKIE.set(key, val);
		}
	},
	getItem: function (key) {
		if (!isBrowser || !key) return;
		if (isLocalStorage) {
			return window.localStorage.getItem(key);
		} else {
			return COOKIE.read(key);
		}
	},
	removeItem: function (key) {
		if (!isBrowser || !key) return;
		if (isLocalStorage) {
			return window.localStorage.removeItem(key);
		} else {
			return COOKIE.remove(key);
		}
	}
}

let HELPER = {
	getUrlParameter:function(name) {
		name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
		var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
		var results = regex.exec(location.search);
		return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	},
	isIEBrowser: function () {
		let ms_ie = false;
		let ua = window.navigator.userAgent;
		let old_ie = ua.indexOf('MSIE ');
		let new_ie = ua.indexOf('Trident/');

		if ((old_ie > -1) || (new_ie > -1)) {
			ms_ie = true;
		}

		return ms_ie;
	},
	compareObject: function (a, b, neglectProps) {
		// Create arrays of property names
		var aProps = Object.getOwnPropertyNames(a);
		var bProps = Object.getOwnPropertyNames(b);

		if (!neglectProps) neglectProps = [];

		for (var i = 0; i < aProps.length; i++) {
			var propName = aProps[i];
			if (neglectProps.indexOf(propName) != -1) continue;
			// If values of same property are not equal,
			// objects are not equivalent
			if (typeof a[propName] == typeof b[propName]) {
				if (Array.isArray(a[propName])) {
					if (!HELPER.compArrays(a[propName], b[propName])) return false;
				} else if (typeof a[propName] == 'object' && !HELPER.compareObject(a[propName], b[propName])) {
					return false
				} else if (a[propName] != b[propName]) {
					return false;
				}
			} else {
				return false;
			}
		}

		// If we made it this far, objects
		// are considered equivalent
		return true;
	},
	deepCompare: function () {
		var i, l, leftChain, rightChain;

		function compare2Objects(x, y) {
			var p;

			// remember that NaN === NaN returns false
			// and isNaN(undefined) returns true
			if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
				return true;
			}

			// Compare primitives and functions.     
			// Check if both arguments link to the same object.
			// Especially useful on the step where we compare prototypes
			if (x === y) {
				return true;
			}

			// Works in case when functions are created in constructor.
			// Comparing dates is a common scenario. Another built-ins?
			// We can even handle functions passed across iframes
			if ((typeof x === 'function' && typeof y === 'function') ||
				(x instanceof Date && y instanceof Date) ||
				(x instanceof RegExp && y instanceof RegExp) ||
				(x instanceof String && y instanceof String) ||
				(x instanceof Number && y instanceof Number)) {
				return x.toString() === y.toString();
			}

			// At last checking prototypes as good as we can
			if (!(x instanceof Object && y instanceof Object)) {
				return false;
			}

			if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
				return false;
			}

			if (x.constructor !== y.constructor) {
				return false;
			}

			if (x.prototype !== y.prototype) {
				return false;
			}

			// Check for infinitive linking loops
			if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
				return false;
			}

			// Quick checking of one object being a subset of another.
			// todo: cache the structure of arguments[0] for performance
			for (p in y) {
				if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
					return false;
				}
				else if (typeof y[p] !== typeof x[p]) {
					return false;
				}
			}

			for (p in x) {
				if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
					return false;
				}
				else if (typeof y[p] !== typeof x[p]) {
					return false;
				}

				switch (typeof (x[p])) {
					case 'object':
					case 'function':

						leftChain.push(x);
						rightChain.push(y);

						if (!compare2Objects(x[p], y[p])) {
							return false;
						}

						leftChain.pop();
						rightChain.pop();
						break;

					default:
						if (x[p] !== y[p]) {
							return false;
						}
						break;
				}
			}

			return true;
		}

		if (arguments.length < 1) {
			return true; //Die silently? Don't know how to handle such case, please help...
			// throw "Need two or more arguments to compare";
		}

		for (i = 1, l = arguments.length; i < l; i++) {

			leftChain = []; //Todo: this can be cached
			rightChain = [];

			if (!compare2Objects(arguments[0], arguments[i])) {
				return false;
			}
		}

		return true;
	},
	isValidEmail: function (email) {
		if (!email) return false;
		return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
	},
	roundInt: function (a, b) {
		return b ? Math.round(a / b) * b : Math.round(a);
	},
	ceilInt: function (a, b) {
		return b ? Math.ceil(a / b) * b : Math.ceil(a);
	},
	floorInt: function (a, b) {
		return b ? Math.floor(a / b) * b : Math.floor(a);
	},
	getGeoLocation: (successCallback, errorCallback, options) => {
		if (!navigator || !navigator.geolocation || !navigator.geolocation.getCurrentPosition) {
			if (errorCallback && (typeof errorCallback == "function")) {
				errorCallback("functionality not supported");
			}
		}
		if (successCallback && (typeof successCallback == "function") && errorCallback && (typeof errorCallback == "function")) {
			navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
		}
	},
	getUserLocationEnabledPermission: (successCallback, errorCallback) => {
		if (!navigator || !navigator.permissions || !navigator.permissions.query) {
			if (errorCallback && (typeof errorCallback == "function")) {
				errorCallback("functionality not supported");
			}
			return;
		}
		if (successCallback && (typeof successCallback == "function")) {
			navigator.permissions.query({'name': 'geolocation'})
			.then( permission => successCallback(permission.state) )
		}
	},
	canUseWebP: null,
	isWebpSupported: function () {
		if (this.canUseWebP == null && isBrowser) {
			var elem = document.createElement('canvas');
			if (!!(elem.getContext && elem.getContext('2d'))) {
				// was able or not to get WebP representation
				this.canUseWebP = elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
			} else {
				// very old browser like IE 8, canvas not supported
				this.canUseWebP = false;
			}
		}
		return this.canUseWebP;
	},
	isiOSDevice: isBrowser && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
	isMobile: function () {
		var isMobile = false; //initiate as false
		// device detection
		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
			isMobile = true;
		}
		return isMobile;
	},
	toTitleCase: function (str) {
		return str ? str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) : '';
	},
	isInteger(num) {
		return (num ^ 0) === num;
	},
	/**
	 * element : element on which ripple is to be created
	 * callback: function to call after ripple is finished
	 * isRippleFromCenter : if true Start ripple from center , if false start ripple from cursor position.
	 * backgroundClr: background color of the ripple
	 * animationDuration : duration of the animation in the ripple
	 */
	createRipple: function (event, element, callback, isRippleFromCenter, backgroundClr, animationDuration) {
		const elementPosition = element.getBoundingClientRect();
		const elementWidth = elementPosition.right - elementPosition.left;
		const elementHeight = elementPosition.bottom - elementPosition.top;

		let rippleElement;
		rippleElement = element.querySelector("ripple");
		if (rippleElement) {
			rippleElement.parentNode.removeChild(rippleElement);
		}
		rippleElement = document.createElement("div");
		rippleElement.classList.add("ripple");
		if (backgroundClr) {
			rippleElement.style.background = backgroundClr;
		}
		if (animationDuration) {
			rippleElement.style.animationDuration = animationDuration;
		}
		element.appendChild(rippleElement);

		const maxWidthOrHeight = Math.max(elementWidth, elementHeight);
		rippleElement.style.width = `${maxWidthOrHeight}px`;
		rippleElement.style.height = `${maxWidthOrHeight}px`;
		if (isRippleFromCenter) {
			rippleElement.style.left = `${elementWidth / 2 - maxWidthOrHeight / 2}px`;
			rippleElement.style.top = `${elementHeight / 2 - maxWidthOrHeight / 2}px`;
		} else {
			const rippleX = elementPosition.left + window.pageXOffset - document.documentElement.clientLeft;
			rippleElement.style.left = `${event.pageX - rippleX - maxWidthOrHeight / 2}px`;
			const rippleY = elementPosition.top + document.body.scrollTop - document.body.clientTop;
			rippleElement.style.top = `${event.pageY - rippleY - maxWidthOrHeight / 2}px`;
		}

		rippleElement.classList.add("circle");
		const _animationDuration = animationDuration ? animationDuration.split("s")[0] * 1000 : 250;
		setTimeout(() => {
			rippleElement.parentNode.removeChild(rippleElement);
			if (callback) {
				callback();
			}
		}, _animationDuration);
	},
	getViewportHeight: function () {
		return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	},
	shareUrl: function (url, text, copyOnly) {
		text = text||"";
		if (navigator.share && !copyOnly) {
			navigator
				.share({ title: document.title, url: url, text: text })
				.then(() => console.log("Successful share"))
				.catch(error => console.log("Error sharing", error));
			return null;
		} else if (typeof document.execCommand == "function" && typeof window.getSelection == "function") {
			var id = "mycustom-clipboard-textarea-hidden-id";
			var existsTextarea = document.getElementById(id);
			if (!existsTextarea) {
				var textarea = document.createElement("textarea");
				textarea.id = id;
				// Place in top-left corner of screen regardless of scroll position.
				textarea.style.position = 'fixed';
				textarea.style.top = 0;
				textarea.style.left = 0;

				// Ensure it has a small width and height. Setting to 1px / 1em
				// doesn't work as this gives a negative w/h on some browsers.
				textarea.style.width = '1px';
				textarea.style.height = '1px';

				// We don't need padding, reducing the size if it does flash render.
				textarea.style.padding = 0;

				// Clean up any borders.
				textarea.style.border = 'none';
				textarea.style.outline = 'none';
				textarea.style.boxShadow = 'none';

				// Avoid flash of white box if rendered for any reason.
				textarea.style.background = 'transparent';

				textarea.contentEditable = true;
				textarea.readOnly = false;

				document.querySelector("body").appendChild(textarea);
				existsTextarea = document.getElementById(id);
			}

			existsTextarea.value = (text?(text+" "):"") + url;

			if (HELPER.isiOSDevice) {
				var range = document.createRange();
				range.selectNodeContents(existsTextarea);

				var selection = window.getSelection();
				selection.removeAllRanges();
				selection.addRange(range);

				existsTextarea.setSelectionRange(0, 999999);

			} else {
				existsTextarea.select();
			}

			try {
				var status = document.execCommand('copy');
				existsTextarea.blur();
				
				if (!status) {
					console.log("Oops, unable to copy");
					return false;
				} else {

					return true;
				}
			} catch (err) {
				console.log("Oops, unable to copy");
				return false;
			}
		} else {
			return false;
		}
	},
	scrollTo(element, to, duration) {
		var start;
		if(element === window){
			 start = element.scrollY;
		}else{
			 start = element.scrollTop;
		}
			var change = to - start,
			currentTime = 0,
			increment = 20;

		var animateScroll = function () {
			currentTime += increment;
			var val = HELPER.easeInOutQuad(currentTime, start, change, duration);
			
			if(element === window){
				element.scrollTo(0,val);
		    }else{
				element.scrollTop = val;
		    }
			
			if (currentTime < duration) {
				setTimeout(animateScroll, increment);
			}
		};
		animateScroll();
	},
	isChrome() {
		let isChromium = window.chrome;
		let winNav = window.navigator;
		let vendorName = winNav.vendor;
		let isOpera = typeof window.opr !== "undefined";
		let isIEedge = winNav.userAgent.indexOf("Edge") > -1;
		let isIOSChrome = winNav.userAgent.match("CriOS");

		return isIOSChrome ||
			(isChromium !== null &&
			typeof isChromium !== "undefined" &&
			vendorName === "Google Inc." &&
			isOpera === false &&
			isIEedge === false)
	},
	isiOSChrome(incognito) {
		let flag = false;
		if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream && navigator.userAgent.match('CriOS')) {
			flag = true;
		}
		return flag;
	},
	loadJS(scriptUrl, successCallback, failureCallback) {
		if(scriptUrl) {
			var el = document.createElement('script');
			el.onload = successCallback;
			el.onerror = failureCallback;
		    el.src = scriptUrl;
		    el.type= "text/javascript";
		    document.head.appendChild(el);
		} else if (typeof failureCallback == 'function') {
			failureCallback();
		}
	},
	// askPushPermission(setting) {
	// 	let serviceWorkerPath = "/service-worker-nm.js" ;
 //       	var defaultSetting = {
 //            titleText: 'Looking for Best Flight Deals?',
 //            bodyText: 'Subscribe here to receive top deals of the day',
 //            okButtonText: 'Subscribe me!',
 //            rejectButtonText: 'Not now',
 //            okButtonColor: '#EC5B24',
	// 		skipDialog: false,
	// 		serviceWorkerPath: serviceWorkerPath
 //        }

 //        if (typeof window.wizrocket == "object") {
 //            wizrocket.notifications.push(Object.assign({},defaultSetting,setting));
 //        }
 //    },	
	getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
	    function deg2rad(deg) {
	        return deg * (Math.PI / 180)
	    }
	    var R = 6371; // Radius of the earth in km
	    var dLat = deg2rad(lat2 - lat1); // deg2rad below
	    var dLon = deg2rad(lon2 - lon1);
	    var a =
	        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
	        Math.sin(dLon / 2) * Math.sin(dLon / 2);

	    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	    var d = R * c; // Distance in km
	    return parseInt(d);
	}
};

let COOKIE = {
	set: function (a_name, a_value) {
		let expires = new Date(),
			cookieStr;

		expires.setYear(expires.getFullYear() + 20);
		cookieStr = a_name + "=" + a_value + ";expires=" + expires.toGMTString() + ";path=/";

		document.cookie = cookieStr;
	},
	setWithTime: function (a_name, a_value, t) {
		let expires = new Date(),
			cookieStr;
		expires.setDate(expires.getDate() + t);
		cookieStr = a_name + "=" + a_value + ";expires=" + expires.toGMTString() + ";path=/";
		document.cookie = cookieStr;
	},
	setSessionCookie: function (a_name, a_value) {
		let cookieStr;
		cookieStr = a_name + "=" + a_value + ";path=/";
		document.cookie = cookieStr;
	},
	read: function (a_name) {
		let name = a_name + "=",
			cookieList = document.cookie.split(';'),
			c, i, l;
		for (i = 0, l = cookieList.length; i < l; i++) {
			c = cookieList[i].trim();
			if (c.indexOf(name) === 0) {
				return decodeURIComponent(c.substring(name.length, c.length).replace(/^"/, '').replace(/"$/, ''));
			}
		}
		return null;
	},
	remove: function () {
		let a_name, cookieStr, i, l;
		for (i = 0, l = arguments.length; i < l; i++) {
			a_name = arguments[i];

			cookieStr = a_name + "=;expires=Thu, 01-Jan-1970 00:00:01 GMT;path=/";
			document.cookie = cookieStr;

			//Also try to delete the cookie from the main domain
			cookieStr = a_name + "=;domain=.ixigo.com;expires=Thu, 01-Jan-1970 00:00:01 GMT;path=/";
			document.cookie = cookieStr;

		}
	}
};

let EB = {
	HELPER: HELPER,
	COOKIE: COOKIE,
	isBrowser: isBrowser,
	LOCAL_STORAGE: LOCAL_STORAGE,
};

export default EB;