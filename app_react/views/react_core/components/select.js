/** 
 * @param selected {variable} preselected value that needs to be highlighted on render.
 * @param onSelect {function} callback fuction that will be called on select.

 * @param items {Array} of Objects
        {
            @param label {string}
            @param value {variable}
            @param anyRandomPayload : You can pass any random payload with each item. It will be given back onSelect! 
        }
 */




import { h, render, Component } from 'preact';

export default class Select extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='c-select-cntr'>
                <select onChange={this.props.onChangeHandler}>
                    {
                        this.props.items.map(
                            (listItem,id) => { 
                                return (
                                    <option value={listItem.value}>{listItem.label}</option>
                                )
                            }
                        )
                    }
                </select>
                <span className="u-pos-abs icon">&#8964;</span>
            </div>
        );
    }
};

/*Select.propTypes = {
    onChangeHandler: React.PropTypes.func,
    items : React.PropTypes.array
};*/

Select.defaultProps = {
    onChangeHandler : ()=>{},
    items : []
};