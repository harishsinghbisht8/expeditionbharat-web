import { h, render, Component } from "preact";
import {route} from "preact-router";
import ReactifyCore from "reactify-core";
import Carousel from "../../common/components/carousel";

let carouselImages = 11;
export default class Home extends Component {
    // constructor(props) {
    //     super(props);
        
    //     this.state = {
            
    //     };
        
    //     ["renderFooter"].forEach(fn => (this[fn] = this[fn].bind(this)));
    // }

    // renderFooter() {
    //     return <ReactifyCore.Components.Footer />
    // }

    // renderHeader() {
    // 	return(
    //     	<ReactifyCore.Components.Header />
    //     );
    // }

    // renderCarousel() {
    //     let htmlArray =[];
    //     for(let index=0; index<carouselImages; ++index) {
    //         htmlArray.push(<img src={"/img/carousel/" + index + ".jpg"} />)
    //     }

    //     return(
    //         <div className='carousel'>
    //             <Carousel scrollCount={1} defaultPosition={1} visibleElements={3} htmlArray={htmlArray} heading="Some of our trekking moments" />
    //         </div>
    //     );
    // }

    renderContent() {
        return(
            <div className='page-content'>
                <div className='coming-soon-banner'>
                    <img className='website-logo' src='/img/logo.png' style="display:none;"/>
                    <div className='first-line'>Coming Soon</div>
                    <div className='second-line'>We are adventure travel company started by two adventurous friends for trekking and biking</div>
                    <div className='third-line'>expeditionbharat@gmail.com</div>

                    <div className='follow-us'>
                        <div>Follow us for update</div>
                        <ul className='social-btn'>
                            <li><a title="facebook" target="_blank" href='https://www.facebook.com/expeditionbharat'><img alt="facebook" src="/img/fb_logo.png" /></a></li>
                            <li><a title="instagram" target="_blank" href='https://www.instagram.com/expeditionbharat'><img alt="instagram" src="/img/insta_logo.png" /></a></li>
                        </ul>
                    </div>
                </div>
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