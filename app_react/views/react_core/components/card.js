import { h, render, Component } from "preact";
import Tooltip from "./tooltip";
import PriceDisplay from "./priceDisplay";
import moment from "moment";
import Image from "./image";

export default class Card extends Component {
    renderDetail(props) {
        if (props.product == "flight") {
            return (
                <div className="flight-card-detail">
                    <div className="city-airport-cntr u-ib">
                        <div className="city-cntr u-text-ellipsis" title={props.cityName}>
                            {props.cityName}
                        </div>
                        <div className="airport-cntr">
                            <span className="aiport u-ib">{props.orgnCode}</span>
                            {" "}
                            <span className="right-arrow u-ib u-text-center">
                                <i className="ixi-icon-arrow icon" aria-hidden="true" />
                            </span>
                            {" "}<span className="aiport u-ib">{props.dstnCode}</span>
                        </div>
                    </div>
                    <div className="price-date-cntr u-ib u-text-right">
                        <div className="price-cntr">
                            <a
                                className="price-link"
                                href={props.href}
                                rel={this.props.rel ? this.props.rel : ""}
                                target={this.props.openNewTab ? "_blank" : "_self"}
                                onClick={e => {
                                    this.props.clickCallback(e);
                                }}
                            >
                                <div className="text u-ib u-v-align-bottom">from</div>
                                <PriceDisplay price={props.price} className="u-ib u-v-align-bottom price-value" currencyCode={props.currencyCode} />
                            </a>
                        </div>
                        <div className="date-cntr">
                            {moment(props.date, "DDMMYYYY").format("DD MMM YYYY")}
                        </div>
                    </div>
                </div>
            );
        }
        if (props.product == "packages") {
            let durationStr = "";
            if (props.duration.numNights) {
                durationStr = props.duration.numNights;

                if (props.duration.numNights == 1) {
                    durationStr = durationStr + "Night";
                } else {
                    durationStr = durationStr + "Nights";
                }
            }

            if (props.duration.numDays) {
                if (props.duration.numNights) {
                    durationStr = durationStr + " / " + props.duration.numDays;
                } else {
                    durationStr = props.duration.numDays;
                }

                if (props.duration.numDays == 1) {
                    durationStr = durationStr + "Day";
                } else {
                    durationStr = durationStr + "Days";
                }
            }
            return (
                <div className="package-card-detail">
                    <div className="card-title">
                        {props.title}
                    </div>
                    <div className="price-duration-cntr ">
                        <div className="duration-cntr u-ib">
                            {durationStr}
                        </div>
                        <div className="price-cntr u-ib">
                            <span className="rupee-icon" /> {props.price}
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div className="card-title">{props.title}</div>
                    {props.text ? <div className="card-text">{props.text}</div> : ""}
                </div>
            );
        }
    }
    onClick(e, href) {
        if (href) {
            if (this.props.openNewTab) {
                window.open(href);
            } else {
                window.location.href = href;
            }
        }
        this.props.clickCallback(e);
    }
    render() {
        let className = (this.props.className ? this.props.className : "") + " c-card " + (this.props.tooltipText ? "u-tooltip-wrapper" : "");
        const title = this.props.hoverTitle ? (this.props.hoverTitle) : (`${this.props.originCityName} to ${this.props.cityName} flights`);
        if (this.props.loading) {
            return (
                <span className={className}>
                    <div className="card-header disabled-card" />
                    <div className="card-content">
                        <div className="u-ib card-content-section">
                            <div className="card-info u-disable-state" />
                            <div className="card-info card-info-bottom u-disable-state" />
                        </div>
                        <div className="u-ib card-content-section">
                            <div className="card-info u-disable-state u-rfloat" />
                            <div className="card-info card-info-bottom u-disable-state u-rfloat" />
                        </div>
                    </div>
                </span>
            );
        }
        return (
            <span className={className} onClick={e => this.onClick(e, this.props.href)}>
                <div className="card-header">
                    <Image alt={title} title={title} src={this.props.thumbImageUrl} />
                </div>
                <div className="card-content">
                    {this.renderDetail(this.props)}
                </div>
            </span>
        );
    }
}
Card.defaultProps = {
    currencyCode: "INR",
    clickCallback: function() {}
};
