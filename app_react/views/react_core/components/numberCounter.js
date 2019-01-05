/**
 * @param count {Number} Initial count Default: 0
 * @param ulimit {Number} Upper limit Default: 100
 * @param llimit {Number} Lower limit Default: 0
 * @param onChange {Function}
 */

import {h, render, Component} from 'preact';

export default class NumberCounter extends Component {

  constructor(props) {
    super(props);
  }

  clickHandler(e) {
    var $el = $(e.target);
    if (!$el.hasClass('counter-item'))
      return;

    if ($el.hasClass('disabled')) {
      this.props.disabledSelectCallback();
      return;
    }

    if (!$el.hasClass('current')) {
      if (this.props.id === undefined) {
        this.props.onChange(parseInt($el.attr('data-val')));
      } else {
        this.props.onChange(this.props.id, parseInt($el.attr('data-val')));
      }
    }
  }

  render() {
    let currentCount = this.props.current;
    let items = [];
    if (this.props.values !== undefined) {
      this.props.values.map((value, index) => {
        let itemClassName = "counter-item u-text-center u-ib";
        if (this.props.enabled.indexOf(value) === -1) {
          itemClassName += " disabled";
        } else {
          if (value === this.props.current) {
            itemClassName += " current";
          }
        }
        items.push(
          <span className={itemClassName} onClick={this.clickHandler.bind(this)} data-val={value}>{value}</span>
        )
      })
    } else {
      for (let i = this.props.lLimit; i <= this.props.uLimit; i++) {
        let itemClassName = "counter-item u-text-center u-ib";
        if (i == this.props.current) {
          itemClassName += " current";
        } else if (i < this.props.enabledLowerLimit || i > this.props.enabledUpperLimit) {
          itemClassName += " disabled";
        }
        items.push(
          <span className={itemClassName} onClick={this.clickHandler.bind(this)} data-val={i}>{i}</span>
        )
      }
    }
    let subLabel = '';
    if (this.props.label.sub) {
      subLabel = <div className="sub">{this.props.label.sub}</div>
    }
    return (
      <div className={'number-counter'}>
        <div className="u-ib label u-v-align-middle">
          <div className="main">{this.props.label.main}</div>
          {subLabel}
        </div>
        <div className="u-ib items u-v-align-middle">
          {items}
        </div>
      </div>
    );
  }
}

/*NumberCounter.propTypes = {
	onChange : React.PropTypes.func.isRequired,
	current : React.PropTypes.number,
	uLimit : React.PropTypes.number,
	lLimit : React.PropTypes.number,
	enabledLowerLimit : React.PropTypes.number,
	enabledUpperLimit : React.PropTypes.number,
};*/

NumberCounter.defaultProps = {
  current: 0,
  ulimit: 10,
  llimit: 0,
  enabledLowerLimit: 0,
  enabledUpperLimit: 10
};
