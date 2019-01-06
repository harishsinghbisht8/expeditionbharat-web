import { h, render, Component } from 'preact';
import Utils from '../../common/js/utils';

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    render() {
        return (
        	<header>
                <div className='header-cntnt'>
            		<div className="title">Expedition Bharat</div>
                    <div className='contact-info'>harishsinghbisht8@gmail.com</div>
                </div>
            </header>
        );
    }
};
