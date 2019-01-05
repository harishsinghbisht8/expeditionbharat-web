import { h, render, Component } from 'preact';
import ReactifyCore from 'reactify-core';

export default class ErrorPage extends Component {
  
    render() {
      return (
        <div className="err-page">
          <ReactifyCore.Components.Header />
          <div className="page-cntnt">
            <div className='err-msg'>
              <div className='err-msg-desc'>{this.props.data.errStatus == 404 ? 'You seem to have reached the wrong destination :(' : 'Internal Server Error!'}</div>
              {this.props.data.errStatus == 404 ? <div className='err-msg-desc'>We couldn’t find the page you were looking for.</div> : ''}
              <div className='home-cta'><ReactifyCore.Components.Button text="GO TO HOMEPAGE" onClick={() => window.location.href = '/'} /></div>
            </div>
          </div>
          <ReactifyCore.Components.Footer />
          <input type="hidden" value={JSON.stringify(this.props.data)} id="dataBE" />
        </div>
      );
    }
}