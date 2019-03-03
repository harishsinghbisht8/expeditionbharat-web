import { h, render, Component } from "preact";
import {route, Link} from "preact-router";
import ReactifyCore from "reactify-core";

export default class Trip extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            loading: true,
            expandedDates: null
        };

        this.noDateExpanded = true;
        this.data = null;
        if(props.matches) {
            const tripUrl = props.matches.tripName;
            if(props.data && props.data.tripName && props.data.tripName.toLowerCase() == tripUrl.split("-").join(" ").toLowerCase()) {
                this.data = props.data;
                this.state.loading = false;
            }
        } else {
            this.data = props.data;
            this.state.loading = false;
        }
        
        ["expandDates"].forEach(fn => (this[fn] = this[fn].bind(this)));
    }

    expandDates(e) {
        let dataHeading = e.currentTarget.dataset.heading;
        this.setState((prevState)=>{
            return {expandedDates: prevState.expandedDates==dataHeading ? "" : dataHeading}
        })
    }

    componentDidMount() {
        if(!this.data) {
            this.getData(this.props.matches.tripName);
        }
    }

    getData(tripUrl) {
        ReactifyCore.Utils.AJAX.request("/json/trip/"+tripUrl+".json", "GET").then((response)=>{
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
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.matches.tripName != this.props.matches.tripName) {
            this.data = null;
            this.setState({loading: true});
            this.getData(nextProps.matches.tripName);
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
            <div className="detail-heading">
                {
                    depth==0?<h2>{heading}</h2>:
                    depth==1?<h3>{heading}</h3>:
                    depth==2?<h4>{heading}</h4>:
                    depth==3?<h5>{heading}</h5>:
                    heading
                }
            </div>
        );
    }

    renderDateItem(item) {
        const {heading, value, attr} = item;
        const expandedDates = this.state.expandedDates;
        const expanded = expandedDates == heading || (expandedDates==null && this.noDateExpanded);
        this.noDateExpanded = false;

        return(
            <div className={"trip-dates" + (expanded ? " expanded" : "")}>
                <div className="trip-date-heading" data-heading={heading} onClick={this.expandDates}>
                    {heading}
                    <div><span className="plus">+</span><span className="minus">-</span></div>
                </div>
                {value.map(newItem=>{
                    const {type, value, heading} = newItem;
                    return(
                        <div className="trip-date-value">
                            <div dangerouslySetInnerHTML={{__html: heading}}></div>
                            <div className={"trip-date-info " + type} dangerouslySetInnerHTML={{__html: value}}></div>
                        </div>
                    )
                })}
            </div>
        );
    }

    renderItem(item, depth) {
        depth = depth||0;
        const {heading, type, value, attr} = item;
        let delimiter, subHeading;
        if(attr) {
            ({delimiter, subHeading} = attr);
        }

        return(type == "dates" ? this.renderDateItem(item) :
            <div className={"trip-detail-item" + (delimiter ? " inline" : "") + (subHeading ? " has-sub-heading" : "")}>
                {heading ? this.renderItemHeading(depth, heading) : ""}
                {subHeading ? <div className="detail-sub-heading" dangerouslySetInnerHTML={{__html: subHeading}}></div> : ""}
                {delimiter ? <div className="detail-delimiter" dangerouslySetInnerHTML={{__html: delimiter}}></div> : ""}
                {type == "html" ?
                    <div className="detail-value" dangerouslySetInnerHTML={{__html: value}}></div>
                    :
                    value.map(newItem=>this.renderItem(newItem, depth+1))
                }
            </div>
        );
    }

    renderDetails() {
        let details = this.data.details;
        if(!details) return null;

        return(
            <div className="trip-details">
                {details.map(item=>this.renderItem(item, 0))}
            </div>
        );
    }

    renderRightColumn() {
        let rightDetails = this.data.rightDetails;
        if(!rightDetails) return null;

        return(
            <div className="trip-right-column">
                {rightDetails.map(item=>this.renderItem(item, 0))}
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
        this.noDateExpanded = true;
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