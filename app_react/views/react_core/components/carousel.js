import { h, render, Component } from 'preact';

export default class Carousel extends Component {
    componentDidMount() {
        this.data = {};
        this.finishedScroll = true;

        let $carousel = $(this.carousel);
        let $navRight = $(this.navRight);
        let $navLeft = $(this.navLeft);

        $carousel.on({
          mouseenter: () => {
            this.refreshScrollData();

            if(this.data.maxScroll > 0) {
                $navRight.addClass("u-ib");
                $navLeft.addClass("u-ib");
            }
          },
          mouseleave: () => {
                $navRight.removeClass("u-ib");
                $navLeft.removeClass("u-ib");
          }
        });

        $(document).on({
          keydown:(e) => {
            if(this.props.navWithKeys){
              if(e.keyCode == 37)
                this.scrollComponent("left");
              else if(e.keyCode == 39)
                this.scrollComponent("right");
            }
          }
        })

        if(this.props.scrollTo) {
            this.refreshScrollData();
            this.slidesCntr.scrollLeft = this.props.scrollCount ? this.data.scrollWidth*this.props.scrollTo/this.props.scrollCount : this.data.scrollWidth;
            this.refreshScrollData();
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.scrollTo != this.props.scrollTo) {
            this.refreshScrollData(nextProps);
            this.slidesCntr.scrollLeft = nextProps.scrollCount ? this.data.scrollWidth*nextProps.scrollTo/nextProps.scrollCount : this.data.scrollWidth;
            this.refreshScrollData(nextProps);
        }
    }

    componentWillUnmount() {
        let $carousel = $(this.carousel);
        $carousel.off('mouseenter mouseleave');
    }

    refreshScrollData(props) {
        props = props || this.props;
        let $navRight = $(this.navRight);
        let $navLeft = $(this.navLeft);
        let $slidesCntr = $(this.slidesCntr);
        let $carouselSlides = $slidesCntr.children();
        let slideWidth = $carouselSlides.outerWidth(true);
        this.data.scrollWidth = this.props.scrollCount ? slideWidth*this.props.scrollCount : slideWidth;
        this.data.maxScroll = $slidesCntr[0].scrollWidth;
        let currentScroll = $slidesCntr.scrollLeft();
        if(currentScroll == 0){
            $navLeft.addClass("disabled");
        }else{
            $navLeft.removeClass("disabled");
        }

        if(currentScroll >= (this.data.maxScroll - this.data.scrollWidth)){
            $navRight.addClass("disabled");
        } else {
            $navRight.removeClass("disabled");
        }

        if ($slidesCntr.outerWidth(true) > ($carouselSlides.length * this.data.scrollWidth)) {
            $navRight.addClass("disabled");
        }
    }

    handleKeys(pos,e){
      if(this.props.navWithKeys){
        if(e.keyCode == 37)
          this.scrollComponent("left");
        else if(e.keyCode == 39)
          this.scrollComponent("right");
      }
    }

    scrollComponent(pos) {
        let scroll = 0;
        let $slidesCntr = $(this.slidesCntr);
        let $navRight = $(this.navRight);
        let $navLeft = $(this.navLeft);
        let maxScroll = this.data.maxScroll;
        let currentScroll = $slidesCntr.scrollLeft();

        if(!this.finishedScroll){
            return;
        }

        if(pos == 'left'){
            scroll = currentScroll - this.data.scrollWidth;
            scroll  = scroll < 0 ? 0 : scroll;
        } else {
            scroll = currentScroll + this.data.scrollWidth;
            scroll  = scroll > maxScroll ? maxScroll : scroll;
        }

        this.finishedScroll = false;

        $slidesCntr.animate({
            scrollLeft : scroll
        },() => {
            this.refreshScrollData();
            this.props.navCallback(pos);
            this.finishedScroll = true;
            this.props.onClickHandler(pos);
        });
    }

    renderHeading(heading) {
        if(heading){
            return (
                <div className="carousel-heading">{heading}</div>
            );
        }else{
            return('');
        }
    }
    render() {
        var className = "carousel" + (this.props.arrowType == "fullHeight" ? " full-arrow" : "")
        return (
            <div className={className} ref={(ref) => this.carousel = ref} >
                {this.renderHeading(this.props.heading)}
                <div className="data-wrapper">
                    <div className="data-cntr" ref={(ref) => this.slidesCntr = ref}>
                        {this.props.children}
                    </div>
                    <div className="nav-left ixi-icon-chevron u-rotate-180" onClick={this.scrollComponent.bind(this, 'left')} ref={(ref) => this.navLeft = ref} ></div>
                    <div className="nav-right ixi-icon-chevron"  onClick={this.scrollComponent.bind(this, 'right')} ref={(ref) => this.navRight = ref} ></div>
                </div>
            </div>
        );
    }
};

Carousel.defaultProps = {
    navCallback: ()=>{},
    onClickHandler: ()=>{}
}
