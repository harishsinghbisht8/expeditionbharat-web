import { h, render, Component } from "preact";
import {route} from "preact-router";
import ReactifyCore from "reactify-core";
import Carousel from "../../common/components/carousel";

let carouselImages = 11;
export default class Home extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            
        };
        
        ["renderFooter"].forEach(fn => (this[fn] = this[fn].bind(this)));
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
            htmlArray.push(<img src={"/img/carousel/" + index + ".jpg"} />)
        }

        return(
            <div className='carousel'>
                <Carousel scrollCount={1} defaultPosition={1} visibleElements={3} htmlArray={htmlArray} heading="Some of our trekking moments" />
            </div>
        );
    }

    renderContent() {
        return(
            <div className='page-content'>
                <div className='coming-soon-banner'>
                    {this.renderHeader()}
                    <div className='first-line'>Coming Soon!!!</div>
                    <div className='second-line'>A trekking experience that will astonish you</div>
                </div>
                {this.renderCarousel()}
            </div>
        );
    }

    render() {
        let screen = this.state.screen;
        return (
            <div className='home-page'>
                {this.renderContent()}
                {ReactifyCore.Utils.isBrowser ? "" : <input type="hidden" value={JSON.stringify(this.props.data)} id="dataBE" />}
            </div>
        );
    }
}