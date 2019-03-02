import { h, render, Component } from 'preact';
import {Link} from "preact-router";
import Utils from '../../common/js/utils';

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navListIndex: 0
        };

        ["openNavList"].forEach(fn => (this[fn] = this[fn].bind(this)));
    }

    openNavList(e) {
        let index = e.currentTarget.dataset.index;
        
        if(this.state.navListIndex == index) {
            index = 0;
        }

        this.setState({navListIndex: index});
    }

    render() {
        let navListIndex = this.state.navListIndex
        return (
        	<header>
                <div className='header-cntnt max-width-cntnr'>
                    <div className="logo-cntr">
                        <Link href="/" className="hdr-logo">
                            <img className="logo" alt="expeditionbharat.com" title="expeditionbharat.com" src="/img/logo.png" width={250} />
                        </Link>
                    </div>
                    <div className={"nav-item" + (navListIndex==1 ? " list-open" : "")}>
                        <span className="nav-title" data-index="1" onClick={this.openNavList}>
                            treks
                            <span className={"dd-arrow" + (navListIndex==1 ? " up" : "")}></span>
                        </span>
                        <ul className="dropdown-list">
                            <li data-index="0"><Link className="dropdown-list-item" href="/trip/parashar">parashar</Link></li>
                            <li data-index="1"><Link className="dropdown-list-item" href="/trip/nag-tibba-trek">nag tibba</Link></li>
                        </ul>
                    </div>
                    <div className={"nav-item" + (navListIndex==2 ? " list-open" : "")}>
                        <span className="nav-title" data-index="2" onClick={this.openNavList}>
                            rides
                            <span className={"dd-arrow" + (navListIndex==2 ? " up" : "")}></span>
                        </span>
                        <ul className="dropdown-list">
                            <li data-index="0"><Link className="dropdown-list-item" href="/alwar-bhangarh">alwar-bhangarh</Link></li>
                            <li data-index="1"><Link className="dropdown-list-item" href="/leh-laddakh">leh-laddakh</Link></li>
                        </ul>
                    </div>
                    <div className="nav-item">
                        <span className="nav-title"><Link href="/gallery">gallery</Link></span>
                    </div>
                    <div className="nav-item">
                        <span className="nav-title"><Link href="/blogs">blogs</Link></span>
                    </div>
                    <div className="nav-item">
                        <span className="nav-title"><Link href="/about-us">about us</Link></span>
                    </div>
                </div>
            </header>
        );
    }
};
