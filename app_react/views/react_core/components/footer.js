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
                <div className="footer-cntnt max-width-cntnr">
                    <div class="footer-left">
                        <div class="footer-part-div">
                            <div class="footer-heading">Our Vision</div>
                            <div class="footer-text">This is space to share vision of Expedition Bharat. We have a big mission to create aware ness among the world about treking and adventure activities among people of all age group.</div>
                        </div>
                    </div>
                    <div class="footer-center">
                        <div class="footer-part-div">
                            <div class="footer-heading">Links</div>
                            <div class="footer-links footer-text">
                                <ul class ="footer-text" style="list-style-type:none">
                                     <li><a href="#" class="footer-text">Help and support</a></li>
                                     <li><a href="#" class="footer-text">Privacy policy</a></li>
                                     <li><a href="#" class="footer-text">Terms and conditions</a></li>
                                     <li><a href="#" class="footer-text">Blogs</a></li>
                                     <li><a href="#" class="footer-text">Contact us</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="footer-right">
                        <div class="footer-part-div">
                            <div class="footer-heading">Contacts</div>
                            <div class="footer-links footer-text">
                                <ul class ="footer-text" style="list-style-type:none">
                                     <li class="footer-text">
                                        <div class="contact-info">
                                            <img src="/img/locationicon.png"/>
                                            <div class="contact-info-name">F-62, Dev Kunj, Sector -7, Dwarka, New Delhi-110077, India</div>
                                        </div>
                                     </li>
                                     <li class="footer-text">
                                        <div class="contact-info">
                                            <img src="/img/callicon.png"/>
                                            <div class="contact-info-name">9718773296 / 8800301801</div>
                                        </div>
                                     </li>
                                     <li class="footer-text">
                                        <div class="contact-info">
                                            <img src="/img/whatsappicon.png"/>
                                            <div class="contact-info-name">9718773296 / 8800301801</div>
                                        </div>
                                     </li>
                                     <li class="footer-text">
                                        <div class="contact-info">
                                            <a href="https://www.instagram.com/expeditionbharat/" target="_blank">
                                                <img src="/img/insta_logo.png"/>
                                                <div class="contact-info-name">expeditionbharat</div>
                                            </a>
                                        </div>
                                     </li>
                                     <li class="footer-text">
                                        <div class="contact-info">
                                            <a href="https://www.facebook.com/expeditionbharat/" target="_blank">
                                                <img src="/img/fb_logo.png"/>
                                                <div class="contact-info-name">expeditionbharat</div>
                                            </a>
                                        </div>
                                     </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div id="footer-clear" style="clear:both;"></div>
                </div>
        	</footer>
        );
    }
};


