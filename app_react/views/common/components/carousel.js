import { h, render, Component } from 'preact';
import ReactifyCore from 'reactify-core';

export default class Carousel extends Component {
	constructor(props) {
		super(props);
        this.carouselItem = [];
        this.currentNavIndex = 0;
        this.state = {
            slideLeft : 0,
            activeStartIndex: 0
        }
	}

    handleClickViaCapturing(e, index) {
        if(!this.carouselItem[index].classList.contains('central-item')){
            e.stopPropagation();
            if(index < this.state.activeStartIndex) {
                this.moveSlider(null, 'left');
            }else {
                this.moveSlider(null, 'right');
            }
        }
    }

    renderHeading(heading) {
        if(heading) {
            return (
                <h3 className="carousel-heading">{heading}</h3>
            );
        }else{
            return('');
        }
    }

    checkNavVisibility() {
        const leftNav = this.leftNav;
        const rightNav = this.rightNav;

        if(this.props.htmlArray.length > this.props.visibleElements) {
            if(this.state.activeStartIndex > 0) {
                leftNav.classList.remove('u-hide');
            }else {
                leftNav.classList.add('u-hide');
            }
            if(this.state.activeStartIndex + this.props.visibleElements < this.props.htmlArray.length) {
                rightNav.classList.remove('u-hide');
            }else {
                rightNav.classList.add('u-hide');
            }
        }else {
            leftNav.classList.add('u-hide');
            rightNav.classList.add('u-hide');
        }
    }

    moveSlider(e, direction) {
        const elementWidth = this.carouselItem[0].getBoundingClientRect().width + 15;
        const slideLeft = this.state.slideLeft;
        if(direction == 'left') {
            const modulus = this.props.htmlArray.length % this.props.scrollCount ;
            this.encounteredLastElement = this.encounteredLastElement || (this.currentNavIndex * this.props.scrollCount) + this.props.scrollCount > this.props.htmlArray.length;
            this.currentNavIndex-- ;
            const scrollCount = this.encounteredLastElement && this.currentNavIndex === 0 ? modulus : this.props.scrollCount ;
            this.setState({slideLeft: slideLeft + (scrollCount * elementWidth)});
        }else {
            this.encounteredLastElement = undefined;
            this.currentNavIndex++ ;
            const remainingElementToRight = this.props.htmlArray.length - (this.currentNavIndex * this.props.scrollCount);
            const scrollCount = (remainingElementToRight < this.props.scrollCount) ? remainingElementToRight : this.props.scrollCount;
            this.setState({slideLeft: slideLeft - (scrollCount * elementWidth)});
        }
        this.activateSliderElements(direction);
        this.checkNavVisibility();
    }

    activateSliderElements(direction) {
        if(direction == 'left') {
            const modulus = this.props.htmlArray.length % this.props.scrollCount ;
            const scrollCount = this.encounteredLastElement && this.currentNavIndex === 0 ? modulus : this.props.scrollCount ;
            this.setState({activeStartIndex: this.state.activeStartIndex - scrollCount})
        }else {
            const remainingElementToRight = this.props.htmlArray.length - (this.currentNavIndex * this.props.scrollCount);
            const scrollCount = (remainingElementToRight < this.props.scrollCount) ? remainingElementToRight : this.props.scrollCount;
            this.setState({activeStartIndex: this.state.activeStartIndex + scrollCount})
        }

        for(let index in this.carouselItem) {
            let item = this.carouselItem[index];
            if((index < this.state.activeStartIndex || index >= this.state.activeStartIndex + this.props.visibleElements) && item.classList.contains('central-item')) {
                item.classList.remove('central-item');
            }else if(index >= this.state.activeStartIndex && index < this.state.activeStartIndex + this.props.visibleElements && !item.classList.contains('central-item')) {
                item.classList.add('central-item');
            }
        }
    }

    componentDidMount() {
        if(this.carouselItem.length) {
            for(let index in this.carouselItem) {
                if(index < this.props.visibleElements) {
                    this.carouselItem[index].classList.add('central-item');
                } else if (index == this.props.visibleElements) {
                    break;
                }
            }
            if(this.props.defaultPosition && this.props.htmlArray.length > this.props.visibleElements) {
                for(let i=0; i<this.props.defaultPosition; i++) {
                    this.moveSlider(null, 'right');
                }
            }
            this.checkNavVisibility();
        }
    }

    componentDidUpdate() {
        //this.checkNavVisibility();
    }

	render() {
        let sliderStyle = {
            transform: 'translateX('+ this.state.slideLeft + 'px)'
        };

		return  (
			<div className="c-carousel" ref={(ref) => this.carousel = ref}>
                {this.renderHeading(this.props.heading)}
                <div className="slider-wrapper">
                    <div className="prev-nav nav-btn-cntnr u-hide" onClick={(e) => this.moveSlider(e, 'left')} ref={(ref) => this.leftNav = ref}>
                        <div className='nav-btn'></div>
                    </div>
                    <div className="slider-container" style={sliderStyle}>
                        {
                            this.props.htmlArray.map((item, index) => {
                                let crouselHTML = [];
                                crouselHTML.push(
                                    <div className={"carousel-item " + (ReactifyCore.isBrowser ? "shaded" : "")} onClickCapture={(e) => this.handleClickViaCapturing(e, index)} ref={(ref) => this.carouselItem[index] = ref}>
                                        {item}
                                    </div>
                                )
                                return crouselHTML;
                            })
                        }
                    </div>
                    <div className="next-nav nav-btn-cntnr u-hide" onClick={(e) => this.moveSlider(e, 'right')} ref={(ref) => this.rightNav = ref}>
                        <div className='nav-btn'></div>
                    </div>
                </div>
			</div>
		)
	}
}

Carousel.defaultProps = {
    htmlArray: []
};
