import { h, render, Component } from 'preact';

export default class Tag extends Component {
    constructor(props) {
        super(props);

        this.deleteHandler = this.deleteHandler.bind(this);
        this.selectHandler = this.selectHandler.bind(this);
    }

    deleteHandler() {
        this.props.deleteCallback(this.props.id);
    }
    selectHandler(){
      const {selectCallback} = this.props;
        selectCallback && selectCallback(this.props.id);
    }

    render() {
        const that = this;
        const {props} = that;
        const {className:propClassNames} = props;
        const className = `c-tag c-tag-default ${propClassNames ? propClassNames : ''}`;
        return (
        	<div className={className} onClick={that.selectHandler}>
        		<span>{(typeof window !== "undefined") && this.props.priceRange ? (<span className="tag-text"><span className="tag-text">{"Between "} </span><span className="tag-text"> <ReactifyCore.Components.PriceDisplay currencyCode="INR" price={this.props.priceRange[0]}/></span><span className="tag-text">{" and "}</span><span className="tag-text"><ReactifyCore.Components.PriceDisplay currencyCode="INR" price={this.props.priceRange[1]}/></span></span>) :that.props.text}</span>
        		{props.showRemove && <span className="dlt-btn" onClick={that.deleteHandler}><i className="ixi-icon-cross"></i></span>}
        	</div>
        );
    }
};

/*Tag.propTypes = {
    id: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    deleteCallback: React.PropTypes.func.isRequired
};*/

Tag.defaultProps = {
    showRemove:false,
    deleteCallback: function(){}
};