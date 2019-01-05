/**
 * @param selected {Array} preselected value that needs to be highlighted on render.
 * @param onSelect {function} callback fuction that will be called on select.
 * @param view {String} "horizontal/vertical" Default : Vertical

 * @param items {Array} of Objects
        {
            @param label {html string or react component}
            @param value {variable}
            @param anyRandomPayload : You can pass any random payload with each item. It will be given back onSelect!
        }
 */




import { h, render, Component } from 'preact';

export default class CheckBox extends Component {
    constructor(props) {
        super(props);
        this.checkboxListClickHandler = this.checkboxListClickHandler.bind(this);
    }

    checkboxListClickHandler(e) {
        let $el = $(e.currentTarget);
        if($el.hasClass('disabled')) return;

        let checkboxIndex = $el.data('checkboxindex');
        let selectedComponent = this.props.items[checkboxIndex];
        let currentlySelected = this.props.selected.slice();
        let index = currentlySelected.indexOf(selectedComponent.value);
        let returnArray = [];


        if(index > -1) {
            currentlySelected.splice(index, 1);
        } else {
            currentlySelected.push(selectedComponent.value);
        }

        this.props.items.forEach(item => {
            if(currentlySelected.indexOf(item.value) !== -1){
                if(this.props.returnIndexOnly)
                  returnArray.push(item.value);
                else
                  returnArray.push(item);
            }
        })

        if(this.props.id)
          this.props.onSelect(this.props.id,returnArray)
        else
          this.props.onSelect(returnArray);
    }

    render() {
        return (
            <span className={'checkbox-list'}>
                {
                    this.props.items.map(
                        (listItem,id) => {
                            return (
                                <div className={'checkbox-list-item ' + (this.props.view === "horizontal" ? "u-ib" : "") + (listItem.disabled ? "disabled" : "") }  data-checkboxindex={id} key={id}onClick={this.checkboxListClickHandler} >
                                    <span className={"checkbox-button u-pos-rel u-v-align-top u-ib " + (this.props.selected.indexOf(listItem.value) != -1 ? "selected" : "")}>
                                        <span className="ixi-icon-tick check-icon"></span>
                                    </span>                                
                                    <span className="label u-ib u-pos-rel u-v-align-top">
                                        {listItem.label}
                                    </span>
                                </div>
                            )
                        }
                    )
                }
            </span>
        );
    }
};

/*CheckBox.propTypes = {
    onSelect: React.PropTypes.func,
    view : React.PropTypes.string,
    items : React.PropTypes.array,
    selected : React.PropTypes.array
};*/

CheckBox.defaultProps = {
    view : "vertical"
};
