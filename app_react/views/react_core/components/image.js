import { h, render, Component } from 'preact';
import Utils from '../../common/js/utils';

export default class Image extends Component {

    render() {
        const src = this.props.src;
        this.src = src;

        if (Utils.isBrowser) {
            const pixelRatio = window.devicePixelRatio;
            if (pixelRatio) {
                if (this.props.src2x && pixelRatio >= 2 && pixelRatio < 3) {
                    this.src = this.props.src2x;
                } else if (pixelRatio >= 3 && (this.props.src3x || this.props.src2x)) {
                    this.src = this.props.src3x ? this.props.src3x : this.props.src2x;
                }
            }
        }
        
        let fAuto = 'f_auto';
        let wh = '';
        if (this.props.w) {
            fAuto += ',w_' + this.props.w;
            wh = 'w_' + this.props.w;
        }
        if (this.props.h) {
            fAuto += ',h_' + this.props.h;
            wh += (wh ? ',' : '') + 'h_' + this.props.h;
        }
        if (this.props.c) {
            fAuto += ',c_' + this.props.c;
            wh += (wh ? ',' : '') + 'c_' + this.props.c;
        }

        if(src) {
            if (!this.props.webpDisabled && Utils.HELPER.isWebpSupported()) {
                if (src.includes("https://images.ixigo.com/image/upload")) {
                    this.src = "https://images.ixigo.com/image/upload/" + fAuto + src.split("https://images.ixigo.com/image/upload")[1];
                } else if (src.includes("http") || src.includes("https")) {
                    this.src = "https://images.ixigo.com/node_image/" + fAuto + "/imageURL?url=" + src;
                }
            } else if (src.includes("http") || src.includes("https")) {
                this.src = "https://images.ixigo.com/node_image/" + (wh ? wh + '/' : '') + "imageURL?url=" + src;
            }
        }

        return (
            <img
                className={this.props.className}
                src={this.src}
                alt={this.props.alt}
                title={this.props.title}
                itemprop={this.props.itemprop}
                id={this.props.id}
                width={this.props.width}
                height={this.props.height}
            />
        );
    }
};

Image.defaultProps = {
    className: ""
};
