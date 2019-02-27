import { h, render, Component } from "preact";
import {route, Link} from "preact-router";
import ReactifyCore from "reactify-core";
import Carousel from "../../common/components/carousel";

let carouselImages = 11;
export default class Home extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            
        };
        
        ["submitQuery"].forEach(fn => (this[fn] = this[fn].bind(this)));
    }

    renderFooter() {
        return <ReactifyCore.Components.Footer />
    }

    renderHeader() {
    	return(
        	<ReactifyCore.Components.Header />
        );
    }

    renderCarousel() {
        let htmlArray =[];
        for(let index=0; index<carouselImages; ++index) {
            htmlArray.push(<Link href="/something">
                <img src={"/img/carousel/" + index + ".jpg"} />
                <div className="carousel-info">
                    <div className="info-row">
                        <div className="info-left">Nag Tibba Trek</div>
                        <div className="info-right">&#8377;3000</div>
                    </div>
                    <div className="info-row">
                        <div className="info-left">2D/1N</div>
                    </div>
                </div>
            </Link>)
        }

        return(
            <div className='carousel'>
                <Carousel scrollCount={1} defaultPosition={1} visibleElements={3} htmlArray={htmlArray} heading="Some of our trekking moments" />
            </div>
        );
    }

    // <div className='coming-soon-banner'>
    //                 <img className='website-logo' src='/img/logo.png'/>
                    // <div className='first-line'>Coming Soon</div>
                    // <div className='second-line'>We are adventure travel company started by two adventurous friends for trekking and biking</div>
                    // <div className='third-line'>expeditionbharat@gmail.com</div>

                    // <div className='follow-us'>
                    //     <div>Follow us for update</div>
                    //     <ul className='social-btn'>
                    //         <li><a title="facebook" target="_blank" href='https://www.facebook.com/expeditionbharat'><img alt="facebook" src="/img/fb_logo.png" /></a></li>
                    //         <li><a title="instagram" target="_blank" href='https://www.instagram.com/expeditionbharat'><img alt="instagram" src="/img/insta_logo.png" /></a></li>
                    //     </ul>
                    // </div>
    //             </div>

    submitQuery() {

    }
    renderContent() {
        return(
            <div className='page-content'>
                <div className='coming-soon-banner'>
                    <div className="max-width-cntnr">
                        <form className='query-form' action="/submit-query" method="POST">
                            <div className="query-header">Any query?</div>
                            <ReactifyCore.Components.Input label="Name" name="name" />
                            <ReactifyCore.Components.Input label="Destination" name="destination" />
                            <ReactifyCore.Components.Input label="Email" name="email" />
                            <ReactifyCore.Components.Input label="Mobile" name="mobile" />
                            <ReactifyCore.Components.Input label="From" type="date" name="fromdate" />
                            <ReactifyCore.Components.Input label="To" type="date" name="todate" />
                            <div className="query-message c-input-cntr">
                                <div className="input-label">Message</div>
                                <textarea rows="3" name="message"></textarea>
                            </div>
                            <div className="submit-button">
                                <ReactifyCore.Components.Button text="SUBMIT" type="submit" onClick={this.submitQuery} />
                            </div>
                        </form>
                    </div>
                </div>
                {this.renderCarousel()}
            </div>
        );
    }

    render() {
        let screen = this.state.screen;
        return (
            <div className='home-page'>
                {this.renderHeader()}
                {this.renderContent()}
                {this.renderFooter()}
                {ReactifyCore.Utils.isBrowser ? "" : <input type="hidden" value={JSON.stringify(this.props.data)} id="dataBE" />}
            </div>
        );
    }
}