/*
 @param headers {Array} of Strings
 @param items {Array} of Arrays where each array represents a row
*/


import { h, render, Component } from 'preact';

export default class Table extends Component {
    constructor(props) {
        super(props);

        this.tableLength = this.props.headers.length;
    }

    render() {
        return (
            <table className="table-root">
                <tr className="table-header">
                    {this.props.headers.map((headerElem, id) => {
                        return (<th key={id} className="table-header-elem">{headerElem}</th>)
                    })}
                </tr>

                {this.props.items.map((tableRow, id) => {
                    return (
                        <tr key={id} className="table-content-row">
                            {tableRow.map((tableRowElement, id1) => {
                                return (<td key={id1} className="table-content-row-elem">{tableRowElement}</td>)                                
                            })}                        
                        </tr>
                    )                                     
                })}
            </table>
        );
    }
};


/*Table.propTypes = {
    headers : React.PropTypes.array.isRequired,
    items : React.PropTypes.array.isRequired
};*/
