import { h, render, Component } from 'preact';

export default class Pagination extends Component {
    constructor(props) {
        super(props);

        this.onPageClick = this.onPageClick.bind(this);
        this.onNavClick = this.onNavClick.bind(this);
    }

    onPageClick(e) {
        if(!$(e.target).hasClass("selected")){
            this.props.pageClickCallback($(e.target).text());
            this.props.trackingCallback("page_change", "page_num");
        }
    }

    onNavClick(type) {
        if(type == 'left') {
            if(this.props.currentPage>1) {
                this.props.trackingCallback("page_change", "prev");
                if(this.props.paginationType === "link")
                    window.location = `${this.props.baseUrl}${parseInt(this.props.currentPage)-1 > 1 ? "?page=" + (parseInt(this.props.currentPage)-1).toString():""}`;
                else 
                    this.props.pageClickCallback(this.props.currentPage-1);
            }
        } else {
            if(this.props.currentPage<this.props.totalPages) {
                this.props.trackingCallback("page_change", "next");
                if(this.props.paginationType === "link")
                    window.location = this.props.baseUrl + "?page=" + (parseInt(this.props.currentPage)+1).toString();
                else 
                    this.props.pageClickCallback(this.props.currentPage+1);
            }
        }
    }

    renderPageNums() {
        if(!this.props.totalPages) return '';

        let currentPage = this.props.currentPage - 2;

        currentPage = (currentPage+4) <= this.props.totalPages ? currentPage : this.props.totalPages - 4;
        currentPage = currentPage > 0 ? currentPage : 1;
        
        let html = [];
        if(this.props.paginationType=="link"){
            for(let index=1; currentPage<=this.props.totalPages && index<=5; ++index,++currentPage) {
                html.push(<a href={`${this.props.baseUrl}${currentPage>1?"?page="+currentPage:""}`} className={'page-num' + (currentPage == this.props.currentPage ? ' selected' : '')}>{currentPage}</a>);
            }
        }else{
            for(let index=1; currentPage<=this.props.totalPages && index<=5; ++index,++currentPage) {
                html.push(<span onClick={this.onPageClick} className={'page-num' + (currentPage == this.props.currentPage ? ' selected' : '')}>{currentPage}</span>);
            }
        }

        return html;
    }

    render() {
        return (
            <div className='c-pagination'>
                <span onClick={() => this.onNavClick('left')} className={'nav left ixi-icon-chevron u-rotate-180' + (this.props.currentPage > 1 ? '' : ' disabled')}></span>
                {this.renderPageNums()}
                <span onClick={() => this.onNavClick('right')} className={'nav right ixi-icon-chevron' + (this.props.currentPage < this.props.totalPages ? '' : ' disabled')}></span>
            </div>
        );
    }
};

/*Pagination.propTypes = {
    totalPages: React.PropTypes.number,
    currentPage: React.PropTypes.number,
    pageClickCallback: React.PropTypes.func,
    trackingCallback: React.PropTypes.func
};*/

Pagination.defaultProps = {
    pageClickCallback: () => {},
    trackingCallback: () => {}
};