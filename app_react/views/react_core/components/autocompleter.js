import { h, render, Component } from "preact";
import Input from "./input";
import IxiUtils from "../../../common/js/ixiUtils";

export default class Autocompleter extends Component {
  constructor(props, autocompleter, autocompleterId) {
    super(props);

    this.isFirstRender = true;
    this.resultNavCounter = 0;
    this.resultsMarkup = "";
    this.autocompleter = autocompleter;
    this.autocompleterId = autocompleterId;
    this.debounceDelay = this.props.debounceDelay ? this.props.debounceDelay : 250;
    this.limit = this.props.limit || 10;

    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.resultSelectHandler = this.resultSelectHandler.bind(this);
    this.inputFocusHandler = this.inputFocusHandler.bind(this);
    this.inputBlurHandler = this.inputBlurHandler.bind(this);
    this.inputKeydownHandler = this.inputKeydownHandler.bind(this);
    this.hideResults = this.hideResults.bind(this);
    this.debouceTimeout = null;

    this.globalParsedData = [];

    if (IxiUtils.isBrowser) {
      if (!this.autocompleter.isSelectType) {
        this.getMarkup(this.props.inputVal, this.props.showDefaultList, resultsMarkup => {
          this.resultsMarkup = resultsMarkup;
        });
      } else if (typeof this.autocompleter.getData == "function") {
        this.autocompleter.getData().then(() => {
          this.resultsMarkup = this.autocompleter.filterMarkup(null, this.limit);
          this.globalParsedData = this.autocompleter.filteredData;
        });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      !this.autocompleter.isSelectType &&
      (nextProps.inputVal != this.props.inputVal ||
        (nextProps.showResults && nextProps.showResults !== this.props.showResults))
    ) {
      if(nextProps.fetchDefaultFromApi && nextProps.fetchDefaultFromApi === true){
          this.resultsMarkup = "";
          this.setState();
      }
      if (this.debouceTimeout) clearTimeout(this.debouceTimeout);
        this.debouceTimeout = setTimeout(() => {
          this.getMarkup(nextProps.inputVal, nextProps.showDefaultList, resultsMarkup => {
            this.resultsMarkup = resultsMarkup;
            this.forceUpdate();
          });
        }, this.debounceDelay);

    } else if (this.autocompleter.isSelectType) {
      if (!IxiUtils.HELPER.compArrays(nextProps.URLData, this.props.URLData)) {
        this.getSelectList(nextProps.URLData);
      } else if (nextProps.inputVal != this.props.inputVal) {
        this.resultsMarkup = this.autocompleter.filterMarkup(nextProps.inputVal, this.limit);
        this.globalParsedData = this.autocompleter.filteredData;
      }
    }
  }

  componentDidUpdate() {
    let $resultRows = $(this.element).find(".result-row").not(".u-hide");
    $resultRows.removeClass("selected");
    if ($resultRows.length) {
      $($resultRows.get(0)).addClass("selected");
    }

    $resultRows.off("mouseover mouseout").on('mouseover',e => {
      $($resultRows.get(this.resultNavCounter)).removeClass("selected");
    }).on('mouseout', e => {
      $($resultRows.get(this.resultNavCounter)).addClass("selected");
    });
  }

  getSelectList(URLData) {
    if (!this.autocompleter.url) return;
    let url = IxiUtils.AJAX.buildURL(this.autocompleter.url, URLData);

    IxiUtils.AJAX.get(url).then(
      response => {
        if (response && (response.length || Object.keys(response).length)) {
          this.autocompleter.parser(response);

          this.resultsMarkup = this.autocompleter.filterMarkup(null, this.limit);

          if (this.props.inputVal) {
            let filteredMarkup = this.autocompleter.filterMarkup(this.props.inputVal, this.limit);
            if (filteredMarkup && filteredMarkup.length) {
              this.resultsMarkup = filteredMarkup;
            } else {
              this.props.inputChangeCallback(this.autocompleterId, "");
            }
          }

          this.globalParsedData = this.autocompleter.filteredData;
        }
      },
      err => console.log(this.autocompleterId, "auto completer error", err)
    );
  }

  getMarkup(inputVal, showDefaultList, markupCallback,gPlaces = false,gmapParams) {
    let autocompleter = this.autocompleter;
    if ((inputVal && inputVal.length >= (this.props.inputValSearchMinLength || 3)) || this.props.fetchDefaultFromApi) {
      let searchInputVal = this.props.encodeString === true ?  encodeURIComponent(inputVal.split("-")[0].split(",")[0].trim()):inputVal.split("-")[0].split(",")[0].trim();
      let url = IxiUtils.AJAX.buildURL(autocompleter.url, this.props.URLData.concat(searchInputVal));
      if(this.xhr) this.xhr.abort();
      this.xhr = IxiUtils.AJAX.get(url).then(
        response => {
          if (response && (response.length || Object.keys(response).length)) {
            let parsedData = autocompleter.parser(response);
            this.globalParsedData = parsedData;
            if (this.limit && !isNaN(this.limit)) {
              parsedData.length = parsedData.length < this.limit ? parsedData.length : this.limit;
            }
            markupCallback(autocompleter.createMarkup(parsedData, false, null, false, this.props.excludeObj));
          } else {
            markupCallback("");
          }
        },
        err => {
          console.log(this.autocompleterId, "auto completer error", err);
          markupCallback("");
        }
      );

    } else if (showDefaultList) {
      let parsedData = autocompleter.parser(autocompleter.defaultList);
      this.globalParsedData = parsedData;
      markupCallback(
        autocompleter.createMarkup(
          parsedData,
          true,
          this.props.recentSearchList,
          this.props.showRecentSearch,
          this.props.excludeObj
        )
      );
    } else {
      markupCallback("");
    }
  }

  inputFocusHandler() {
    if (this.props.acSelected) $(this.element).find("input")[0].select();
    this.props.inputFocusCallback(this.autocompleterId);
  }

  inputBlurHandler() {
    this.props.inputBlurCallback(this.autocompleterId);
  }

  inputChangeHandler(inputVal) {
    if (this.autocompleter.isSelectType) {
      this.resultsMarkup = this.autocompleter.filterMarkup(inputVal, this.limit);
      this.globalParsedData = this.autocompleter.filteredData;
      this.props.inputChangeCallback(this.autocompleterId, inputVal);
    } else {
      this.props.inputChangeCallback(this.autocompleterId, inputVal);
    }
  }

  inputKeydownHandler(e) {
    let $resultRows = $(this.element).find(".autocompleter-results .result-row").not(".u-hide");
    if (!$resultRows.length) return;

    let preventDefault = false;
    if (e.keyCode == 38) {
      // up arrow
      preventDefault = true;
      if (this.resultNavCounter > 0) {
        $($resultRows.get(this.resultNavCounter)).removeClass("selected");
        this.resultNavCounter--;
        $($resultRows.get(this.resultNavCounter)).addClass("selected");
      }
    } else if (e.keyCode == 40) {
      //down arrow
      preventDefault = true;
      if (this.resultNavCounter < $resultRows.length - 1) {
        $($resultRows.get(this.resultNavCounter)).removeClass("selected");
        this.resultNavCounter++;
        $($resultRows.get(this.resultNavCounter)).addClass("selected");
      }
    } else if (e.keyCode == 13) {
      //enter key
      preventDefault = true;
      if (this.resultNavCounter >= 0) {
        let $targetRow = $($resultRows.get(this.resultNavCounter));
        this.selectCallback($targetRow);
      }
    }

    if (preventDefault) {
      e.preventDefault();
    }
  }

  selectCallback($targetRow) {
    if (
      this.props.showRecentSearch &&
      typeof this.props.recentSearchList !== "undefined" &&
      this.props.recentSearchList.length &&
      $targetRow.data("isRecent") === true
    ) {
      this.props.recentSearchCallback(this.props.recentSearchList[$targetRow.data("acindex")]);
    } else {
      this.props.selectCallback(this.autocompleterId, this.globalParsedData[$targetRow.data("acindex")]);
    }
    setTimeout(() => {
      $(this.element).find("input").blur();
    });
  }

  resultSelectHandler(e) {
    let $targetRow = $(e.target).closest(".result-row").not(".u-hide");
    if($targetRow.length) this.selectCallback($targetRow);
  }

  hideResults() {
    $(this.element).find(".autocompleter-results").css("display", "none");
  }

  setResultsMaxHeight() {
    if(this.autocompleter.isSelectType) {
        let rowHeight = this.autocompleter.rowHeight;

        if(!rowHeight) {
            let acResults, resultRow;
            if(this.element) acResults = this.element.querySelector('.autocompleter-results');
            if(acResults) resultRow = acResults.querySelector('.result-row');

            //40 is just an arbitrary number in case we do not know the row height
            rowHeight = resultRow && resultRow.offsetHeight ? resultRow.offsetHeight : this.resultsMaxHeight ? '' : 40;
        }

        if(rowHeight) this.resultsMaxHeight = (this.props.limit * rowHeight) + 'px';
    }
  }

  renderAutoCompleterList() {
    this.setResultsMaxHeight();

    let styles = {};

    this.isFirstRender = this.isFirstRender && !this.props.showResults;
    if(this.isFirstRender) styles.display = 'none';
    else if(this.props.showResults) styles.display = 'block';

    if(this.resultsMaxHeight) styles.maxHeight = this.resultsMaxHeight;

    let className =
      "autocompleter-results u-box" +
      (this.props.showResults ? "" : " u-animated u-fadeOut") +
      ((this.resultsMarkup && this.resultsMarkup.length) || this.props.inputError
        ? " autocompleter-results-caret"
        : "");

    if(this.autocompleter.isSelectType) className += ' u-cstm-scroll';

    return (
      <div className={className} onAnimationEnd={this.hideResults} style={styles} onClick={this.resultSelectHandler}>
        <div className="autocompleter-scroll-cntr">
          {this.props.inputError && this.props.inputErrorMessage
            ? <div className="error-msg-cnt">
                <div className="error-msg">{this.props.inputErrorMessage}</div>
                <div className="ixi-icon-error error-icon" />
              </div>
            : null}
          {this.resultsMarkup}
        </div>
      </div>
    );
  }

  render() {
    let className = "c-auto-cmpltr";
    this.resultNavCounter = 0;
    let clearButtonHTML = "";
    if (this.props.inputVal)
      clearButtonHTML = <div className="clear-input ixi-icon-cross" onClick={this.props.clearInputHandler} />;
    return (
      <div className={className} ref={ref => (this.element = ref)}>
        <Input
          focusCallback={this.inputFocusHandler}
          blurCallback={this.inputBlurHandler}
          changeCallback={this.inputChangeHandler}
          keyDownCallback={this.inputKeydownHandler}
          val={this.props.inputVal}
          label={this.props.inputLabel}
          placeholder={this.props.inputPlaceholder}
          isError={this.props.inputError}
          isFocus={this.props.isFocus}
        />
        {clearButtonHTML}
        {this.renderAutoCompleterList()}
      </div>
    );
  }
}
