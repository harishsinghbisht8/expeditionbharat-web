import { h, render, Component } from 'preact';
import Utils from "../../common/js/utils";

const EMPTY_ARRAY_READ_ONLY = [];

export default class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    render() {
        return (
        	<footer>
                <div className="footer-cntnt">
                </div>
        	</footer>
        );
    }
};