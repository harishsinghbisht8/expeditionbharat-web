import { h, render, Component } from 'preact';
import Input from './input';
import IxiUtils from '../../../common/js/ixiUtils';
import moment from 'moment';

export default class Calendar extends Component {

	constructor(props) {
		super(props);
        this.listItemSelectCallback = this.listItemSelectCallback.bind(this);
        this.blurCallback = this.blurCallback.bind(this);
	}

    componentDidMount() {
		let self = this;
		self.props.options.styles = Object.assign({}, self.props.options.styles, {
            "back" : 'ixi-icon-arrow u-rotate-180 rd-back',
            "next" : 'ixi-icon-arrow rd-next'
        });
        self.props.options = Object.assign({}, self.props.options, {
            min: self.props.options.min != undefined ? self.props.options.min : new Date(),
            max: self.props.options.max != undefined ? self.props.options.max : null,
            monthsInCalendar: self.props.options.monthsInCalendar ? self.props.options.monthsInCalendar : 2,
            time: false,
            inputFormat: "DD MMM, ddd",
            initialValue: self.props.options.initialValue ? self.props.options.initialValue : self.props.date ? self.props.date.toDate() : "",
            sd: self.props.date ? self.props.date.toDate() : new Date(),
            weekdayFormat : 'short',
            calType: 1,
            listItemSelectCallback: this.listItemSelectCallback,
            dateValidator: self.props.options.dateValidator ? self.props.options.dateValidator : ()=>{return true}
        });

        self.calendar  = rome(self.el.getElementsByTagName("input")[0], self.props.options);

		self.calendar.on('data', date => {
            self.props.selectCallback(moment(self.calendar.getDate()));
        });

        self.calendar.off('date').on('date', date => {
            self.calendar.resetList();
            self.el.getElementsByTagName("input")[0].blur();
        });

        if(self.props.options.hasInfo) {
            self.calendar.on('show', () => {
                self.props.fillInfoCallback(self.calendar);
            });
            self.calendar.on('next', () => {
                self.props.fillInfoCallback(self.calendar);
            });
            self.calendar.on('back', () => {
                self.props.fillInfoCallback(self.calendar);
            });
        }
    }

	componentWillReceiveProps(nextProps){
		if(this.calendar && this.props.date && nextProps.date && !this.props.date.startOf('day').isSame(nextProps.date.startOf('day'))){
			this.calendar.setDate(nextProps.date)
		}
    }
    blurCallback(){
        if (this.props.blurCallback){
            this.props.blurCallback();
        }
    }
    listItemSelectCallback(calType, itemIndex, startDate, endDate) {
        this.calendar.show();
        this.props.selectCallback(moment(this.calendar.getDate()));
    }

    render() {
        return (
            <div ref={(ref) => this.el = ref}>
                <Input noBorder={false} placeholder={this.props.placeholder} label={this.props.label} isReadOnly={true} val={this.props.date ? this.props.date.format("DD MMM, ddd") : ''} isError={this.props.isError} errorMessage={this.props.errorMsg} focusCallback={this.props.focusCallback} blurCallback={this.blurCallback}/>
            </div>
        );
    }
};


/*Calendar.propTypes = {
    options : React.PropTypes.object,
    date: React.PropTypes.object.isRequired,
    fillInfoCallback: React.PropTypes.func
};*/
Calendar.defaultProps = {
    options: {},
    fillInfoCallback: () => {}
};
