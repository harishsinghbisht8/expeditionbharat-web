import { h, render, Component } from "preact";
import {route, Link} from "preact-router";
import ReactifyCore from "reactify-core";

export default class Trip extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            loading: true
        };

        this.data = null;
        if(props.matches) {
            this.tripUrl = props.matches.tripName;
            if(props.data && props.data.tripName && props.data.tripName.toLowerCase() == this.tripUrl.split("-").join(" ").toLowerCase()) {
                this.data = props.data;
                this.state.loading = false;
            }
        } else {
            this.data = props.data;
            this.state.loading = false;
        }
        
        [].forEach(fn => (this[fn] = this[fn].bind(this)));
    }

    componentDidMount() {
        if(!this.data) {
            ReactifyCore.Utils.AJAX.request("/json/trip/"+this.tripUrl+".json", "GET").then((response)=>{
                try {
                    if(typeof response == "string") {
                        response = JSON.parse(response);
                    }
                    this.data = response;
                } catch(e) {
                    console.log("trip json parse error", e);
                } finally {
                    this.setState({loading: false});
                }
            }).catch((err)=>{
                console.log("trip json request error", err);
                this.setState({loading: false});
            })
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

    renderItemHeading(depth, heading) {
        return(
            depth==0?<h2>{heading}</h2>:
            depth==1?<h3>{heading}</h3>:
            depth==2?<h4>{heading}</h4>:
            depth==3?<h5>{heading}</h5>:
            <div className="detail-heading">{heading}</div>
        );
    }

    renderItem(value, depth) {
        depth = depth||0;
        return(
            <div className="trip-detail-item">
                {value.heading ? this.renderItemHeading(depth, value.heading) : ""}
                {value.type == "html" ?
                    <div className="detail-value" dangerouslySetInnerHTML={{__html: value.value}}></div>
                    :
                    value.value.map(value=>this.renderItem(value, depth+1))
                }
            </div>
        );
    }

    renderDetails() {
        let details = this.data.details;
        if(!details) return null;

        return(
            <div className="trip-details">
                {details.map(value=>this.renderItem(value, 0))}
            </div>
        );
    }

    renderRightColumn() {
        let rightDetails = this.data.rightDetails;
        if(!rightDetails) return null;

        return(
            <div className="trip-right-column">
                {rightDetails.map(value=>this.renderItem(value, 0))}
            </div>
        );
    }

    renderContent() {
        let data = this.data;
        return(this.state.loading ?
            <div className="loader-cntnr"><ReactifyCore.Components.Loader /></div>
            :
            data ?
            <div className='page-content'>
                <div className="main-image" style={{backgroundImage:`url(${data.mainImage})`}}>
                    <div className="max-width-cntnr">
                        <h1>{data.tripName}</h1>
                    </div>
                </div>
                <div className="max-width-cntnr">
                    {this.renderDetails()}
                    {this.renderRightColumn()}
                </div>
            </div>
            :
            <div className="error-cntnr max-width-cntnr">Sorry no trip found</div>
        );
    }

    render() {
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