import { h, render, Component } from "preact";
import {route, Link} from "preact-router";
import ReactifyCore from "reactify-core";

export default class Trip extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            
        };

        this.data = null;
        if(props.tripName) {
            this.data = props.data;
        } else {
            let tripUrl = props.matches.tripName;
            if(props.data && props.data.tripName && props.data.tripName.toLowerCase() == tripUrl.split("-").join(" ").toLowerCase()) {
                this.data = props.data;
            }
        }
        
        
        [].forEach(fn => (this[fn] = this[fn].bind(this)));
    }

    componentDidMount() {
        if(!this.data) {
            //ReactifyCore.Utils.AJAX
        }
    }

    renderFooter() {
        return <ReactifyCore.Components.Footer />
    }

    renderHeader() {
    	return(
        	<ReactifyCore.Components.Header />
        );
    }

    renderContent() {
        let data = this.data;
        return(data ?
            <div className='page-content'>
                <div className="main-image">
                    <h1>{data.tripName}</h1>
                    <img src={data.mainImage} />
                </div>
                <div className="max-width-cntnr">
                    
                </div>
            </div>
            :
            <div className="loader-cntnr"><ReactifyCore.Components.Loader /></div>
        );
    }

    render() {
        let screen = this.state.screen;
        return (
            <div className='trip-page'>
                {this.renderHeader()}
                {this.renderContent()}
                {this.renderFooter()}
                {ReactifyCore.Utils.isBrowser ? "" : <input type="hidden" value={JSON.stringify(this.props.data)} id="dataBE" />}
            </div>
        );
    }
}