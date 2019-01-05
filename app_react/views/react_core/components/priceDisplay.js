import { h, render, Component } from 'preact';
import IxiUtils from '../../../common/js/ixiUtils';

export default class PriceDisplay extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        if(IxiUtils.isBrowser){
            IxiUtils.CURRENCY.fetchList().then(() => {
                this.forceUpdate();
            });
        }
    }

    currencyIcon(){
        let currencyCode = this.props.toCurrencyCode;
        if(!currencyCode) {
            if(IxiUtils.CURRENCY.currencyCode){
                currencyCode = IxiUtils.CURRENCY.currencyCode;
            }else if(this.props.currencyCode){
                currencyCode = this.props.currencyCode;
            }
        }

        let icon = [];
        switch(currencyCode){
            case 'INR':
                icon.push(<i className='ixi-icon-inr icon' aria-hidden='true'></i>);
                break;
            case 'USD':
                icon.push(<i className='ixi-icon-usd icon' aria-hidden='true'></i>);
                break;
            case 'JPY':
                icon.push(<i className='ixi-icon-jpy icon' aria-hidden='true'></i>);
                break;
            case 'GBP':
                icon.push(<i className='ixi-icon-gbp icon' aria-hidden='true'></i>);
                break;
            case 'EUR':
                icon.push(<i className='ixi-icon-eur icon' aria-hidden='true'></i>);
                break;
            default:
                currencyCode ? icon.push(<span className="cur-txt">{currencyCode.toUpperCase()}</span>) : icon.push(<i class='fa fa-inr' aria-hidden='true'></i>);
                break;
        }
        return icon;
    }

    convertedPrice(){
        return IxiUtils.CURRENCY.convert(this.props.price, this.props.currencyCode, this.props.toCurrencyCode, this.props.decimalDigits);
    }

    render() {
        const {className} = this.props;
        let isNegative = false;
        
        if(IxiUtils.isBrowser){
            if(this.convertedPrice() && this.convertedPrice() < 0){
                isNegative = false;
            }
            return (
            	<div className={`c-price-display u-text-ellipsis ${className ? className :''}`} title={this.props.showToolTip ? this.convertedPrice() : ''}>
                    {isNegative ? '- ' : ''}<span className="icon">{this.props.includeParentheses ? '(' : ''}{this.currencyIcon()}{this.props.includeParentheses ? ')' : ''}</span>{this.props.price != undefined? <span className={this.props.strike ? "strike":""}>{Math.abs(this.convertedPrice())}</span> : ''}
            	</div>
            )
        }else{
            if(this.props.price && this.props.price < 0){
                isNegative = true;
            }
            return (
                <div className={"c-price-display u-text-ellipsis"}>
                    {isNegative ? '- ' : ''}<span className="icon">{this.props.includeParentheses ? '(' : ''}{this.props.toCurrencyCode}{this.props.includeParentheses ? ')' : ''}</span>{this.props.price != undefined ? <span className={this.props.strike ? "strike":""}>{Math.abs(this.props.price)}</span> : ''}
                </div>
            )
        }
    }
};

/*PriceDisplay.propTypes = {
    price: React.PropTypes.string,
    currencyCode : React.PropTypes.string,
    toCurrencyCode : React.PropTypes.string
};*/
