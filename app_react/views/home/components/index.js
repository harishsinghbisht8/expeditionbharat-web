import { h, render, Component } from "preact";
import {route, Link} from "preact-router";
import ReactifyCore from "reactify-core";
import Carousel from "../../common/components/carousel";

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
        let carouselTrips = [{
            name: "Nag Tibba",
            price: 2500,
            duration: "2D/1N",
            image: "nagtibba.jpg",
            link: "/trip/nag-tibba-trek"
        }, {
            name: "Prashar Lake",
            price: 2300,
            duration: "2D/1N",
            image: "prashar.jpg",
            link: "/trip/nag-tibba-trek"
        }, {
            name: "Tunganath-Chandrashila",
            price: 8000,
            duration: "4D/3N",
            image: "chandrashila.jpg",
            link: "/trip/nag-tibba-trek"
        }, {
            name: "Hampta Paas",
            price: 7000,
            duration: "4D/3N",
            image: "hampta.jpg",
            link: "/trip/nag-tibba-trek"
        }, {
            name: "Bhrigu Lake",
            price: 7000,
            duration: "4D/3N",
            image: "bhrigu.jpg",
            link: "/trip/nag-tibba-trek"
        }]
        let htmlArray =[];
        let carouselElem;
        for(let index=0; index<carouselTrips.length; ++index) {
            carouselElem = carouselTrips[index];
            htmlArray.push(<Link href={carouselElem.link} >
                <img className="carousel-trips-img" src={"/img/carousel/" + carouselElem.image} />
                <div className="carousel-info">
                    <div className="info-row">
                        <div className="info-left carousel-info-name">{carouselElem.name}</div>
                        <div className="info-right">&#8377;{carouselElem.price}</div>
                    </div>
                    <div className="info-row">
                        <div className="info-left">{carouselElem.duration}</div>
                    </div>
                </div>
            </Link>)
        }

        return(
            <div className='carousel max-width-cntnr'>
                <Carousel scrollCount={1} defaultPosition={0} visibleElements={3} htmlArray={htmlArray} heading="Upcoming Treks" />
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

    submitQuery(e) {
        alert("Hello! I am an alert box!");
        e.preventDefault();
        return false;
    }

    renderReviews() {
        let reviewsArray = [
            {
                img: "/img/reviews/dummy_profile.jpg",
                name: "Tanzeem Ansari, Delhi",
                review: "Its was life time exp during nag tibba trek , nothing could be better than this , must say very supprtive team , awesome stay , delicious food wht mre one can ask for....cheers to uh guys...keep it up !!"
            },
            {
                img: "/img/reviews/dummy_profile.jpg",
                name: "Abhishek Rajput, Delhi",
                review: "To experience India in a different way"
            },
            {
                img: "/img/reviews/dummy_profile.jpg",
                name: "Priya Ajay, Delhi",
                review: "This i must share. So it was my first trek ever and the place was NAAG TIBBA and had no clue the amount of difficulties i am gonna face. But was pretty excited about living in camp surrounded by big dense forest up on the hills..."
            },
        ];
        let htmlArray =[];
        for(let index=0; index<reviewsArray.length; ++index) {
            let item = reviewsArray[index];
            htmlArray.push(<div className="review">
                <div className="user-info">
                    <img src={item.img} />
                    <div className="user-name">{item.name}</div>
                </div>
                <div className="review-text">{item.review}</div>
            </div>)
        }

        return(
            <div className='reviews-carousel'>
                <Carousel scrollCount={1} defaultPosition={0} visibleElements={2} htmlArray={htmlArray} />
            </div>
        );
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
                                <ReactifyCore.Components.Button text="SUBMIT" type="submit" onClick={this.submitQuery}/>
                            </div>
                        </form>
                    </div>
                </div>
                {this.renderCarousel()}
                <div className="promotion-content max-width-cntnr">
                    <div className="why-explain">
                        <div className="promotion-heading">Why Expedition Bharat</div>
                        <div>Expert trek leaders and team</div>
                        <div>Special care of hygiene</div>
                        <div>Easy cancellation</div>
                        <div>Customer focus servcies</div>
                    </div>
                    <div className="reviews">
                        <div className="promotion-heading">Reviews</div>
                        {this.renderReviews()}
                    </div>
                </div>
            </div>
        );
    }

    render() {
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