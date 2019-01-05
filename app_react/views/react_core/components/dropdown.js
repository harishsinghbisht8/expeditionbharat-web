import { h, render, Component } from "preact";
import DropdownList from "./dropdownList";

class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.mounted = true;
    this.state = {
      isDropdownVisible: false
    };
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  componentDidMount() {
    if (ReactifyCore.Utils.isBrowser) {
      document.addEventListener("click", this.handleDocumentClick, false);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    if (ReactifyCore.Utils.isBrowser) {
      document.removeEventListener("click", this.handleDocumentClick, false);
    }
  }

  handleDocumentClick(event) {
    if (this.mounted) {
      if (!$(event.target).closest(this.ddRef).length) {
        this.setState({ isDropdownVisible: false });
      }
    }
  }
  toggleDropdown() {
    this.setState({ isDropdownVisible: !this.state.isDropdownVisible });
  }
  render() {
    const { props, state } = this;
    return (
      <div
        className={`c-dropdown ${props.className ? props.className : ""}`}
        onClick={this.toggleDropdown}
        ref={ref => (this.ddRef = ref)}
      >
        {props.label && <div className={`${props.labelClassName ? props.labelClassName : ""} ${state.isDropdownVisible ? "c-dropdown-label-focus" : ""}`}>{props.label}</div>}
        <div className={`${props.textClassName ? props.textClassName : ""} ${props.label ? "c-dropdown-text" : ""} ${state.isDropdownVisible ? "c-dropdown-text-focus" : ""}`}>
          {props.text}
          <i
            className={`ixi-icon-caret u-ib c-dropdown-caret ${props.caretClassName
              ? props.caretClassName
              : ""} ${state.isDropdownVisible ? "c-dropdown-caret-up" : ""}`}
          />
        </div>
        <DropdownList
          items={props.items}
          isVisible={state.isDropdownVisible}
          className={props.ddClassName}
          itemClickCallback={props.itemClickCallback}
          selected={props.selected}
        />
      </div>
    );
  }
}

export default Dropdown;
