/**
 * @param selected {variable} preselected value that needs to be highlighted on render.
 * @param onSelect {function} callback fuction that will be called on select.
 * @param view {String} "horizontal/vertical" Default : Vertical

 * @param items {Array} of Objects
        {
            @param label {string}
            @param value {variable}
            @param anyRandomPayload : You can pass any random payload with each item. It will be given back onSelect!
        }
 */




import { h, render, Component } from 'preact';

export default class RadioButton extends Component {
    constructor(props) {
        super(props);
    }

    radioListClickHandler(e) {
        let radioIndex = $(e.currentTarget).data('radioindex');
        let selectedComponent = this.props.items[radioIndex];

        if(this.props.value !== selectedComponent.value) {
            this.props.onSelect(selectedComponent);
        }
    }

    render() {
        return (
            <span className={'radio-list'}>
                {
                    this.props.items.map(
                        (listItem,id) => {
                            return (
                                <div className={'radio-list-item ' + (this.props.view === "horizontal" ? "u-ib" : "") + ((this.props.selected === listItem.value) && (listItem.disabled === undefined || listItem.disabled === false ) ? " selected" : "") + (listItem.disabled ? " disabled" :"")} onClick={this.radioListClickHandler.bind(this)} data-radioindex={id} key={id}>
                                    <span className="radio-button u-pos-rel u-v-align-top u-ib "></span>
                                    <span className="label u-ib u-pos-rel u-v-align-top">{listItem.label}</span>
                                </div>
                            )
                        }
                    )
                }
            </span>
        );
    }
};

/*RadioButton.propTypes = {
    onSelect: React.PropTypes.func,
    view : React.PropTypes.string,
    items : React.PropTypes.array
};*/

RadioButton.defaultProps = {
    view : "vertical"
};
