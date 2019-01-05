import { h, render, Component } from 'preact';

export default class Timeline extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const prop = this.props;

        // inline styles
        let lineStyles, dotStyles, labelStyles;
        if(prop.type == 'horizontal'){
            lineStyles = {
                height: prop.lineProps.thickness,
                backgroundColor: prop.lineProps.bgColor
            };
            dotStyles = {
                width: prop.dotProps.thickness,
                height: prop.dotProps.thickness,
                borderRadius: prop.dotProps.thickness,
                backgroundColor: prop.dotProps.bgColor,
                marginTop: - Math.ceil(prop.dotProps.thickness/2 - Math.ceil(prop.lineProps.thickness/2))
            };
            labelStyles = {
                fontSize: prop.labelFontSize
            };
        }else{
            
        }

        // making dots
        let dots = [];
        for (let i = 0; i < prop.dotProps.pointCount; i++) {
            dots.push(<div className='dot' style={dotStyles}></div>);
            dots.push(' ');
        }

        // labelsTL - (postion: either top or left) || labelsBR - (postion: either bottom or right) 
        let labelsTL = []; let labelsBR = [];
        for (let lb = 0; lb < prop.labels.length; lb++) {
            labelsTL.push(<div style={labelStyles} className={'label tl ' + (lb == 0 ? 'first' : '') + (lb == prop.labels.length - 1 ? 'last' : '')}>{prop.labels[lb].topLeft}</div>); 
            labelsTL.push(' '); 
            labelsBR.push(<div style={labelStyles} className={'label br ' + (lb == 0 ? 'first' : '') + (lb == prop.labels.length - 1 ? 'last' : '')}>{prop.labels[lb].bottomRight}</div>); 
            labelsBR.push(' ');
        }

        return (
            <div className={'c-timeline-wrapper ' + prop.type}>
                {labelsTL}
                <div className='c-timeline' style={lineStyles}>
                    {dots}
                </div>
                {labelsBR}
            </div>
        );
    }
};

/*Timeline.propTypes = {
    type: React.PropTypes.string,
    labels: React.PropTypes.array,
    labelFontSize: React.PropTypes.number
};*/

Timeline.defaultProps = {
    type: 'horizontal',
    colorCode: {
        default:  'rgba(0,0,0,0.64)',
        primary: '',
        inverse: ''
    },
    lineProps: {
        bgColor: '#bbbbbb',
        thickness: 2
    },
    dotProps: {
        pointCount: 2,
        thickness: 10,
        bgColor: '#757575'
    },
    labels: [
        {
            'topLeft': '',
            'bottomRight': ''
        },
        {
            'topLeft': '',
            'bottomRight': ''
        },
        {
            'topLeft': '',
            'bottomRight': ''
        }
    ],
    labelFontSize: 14
};