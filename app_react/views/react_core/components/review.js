import { h, render, Component } from 'preact';

export default class Review extends Component {
    render() {
        let className = 'c-review u-ib';
        return (
            <div className={className}>
                <div className='c-review-text'>
                    <span className='c-quote'>&#8220;</span>
                        {this.props.text}
                    <span className='c-quote'>&#8221;</span>
                </div>
                <div className='c-review-user'>{this.props.user}</div>
                <div className='c-review-rating'>
                    <img alt='5 Star' className='c-review-star' src='https://edge.ixigo.com/img/star.svg'/>
                    <img alt='5 Star' className='c-review-star' src='https://edge.ixigo.com/img/star.svg'/>
                    <img alt='5 Star' className='c-review-star' src='https://edge.ixigo.com/img/star.svg'/>
                    <img alt='5 Star' className='c-review-star' src='https://edge.ixigo.com/img/star.svg'/>
                    <img alt='5 Star' className='c-review-star' src='https://edge.ixigo.com/img/star.svg'/>
                </div>                
            </div>
        );
    }
};
