import Components from './components';
import Utils from '../common/js/utils';
import DateUtils from "../common/js/dateUtils";

let ReactifyCore = {
	Components : Components,
    Utils : Utils,
    DateUtils : DateUtils
}

if(typeof window != "undefined"){
    if(history && history.scrollRestoration){
        history.scrollRestoration = "manual";
    }
}

export default ReactifyCore;
