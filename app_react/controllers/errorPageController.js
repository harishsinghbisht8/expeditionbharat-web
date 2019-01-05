import { h, render, Component } from 'preact';
import serverRender from 'preact-render-to-string';
import configObj from '../../config/config';
import ErrorPage from "../views/error/components/index";
import ReactifyCore from 'reactify-core';

let env = process.env.NODE_ENV || 'dev';
let config = configObj[env];
let viewUrl = 'common/templates/index_compiled';

export default function errorHandler(err, req, res) {
  if(!err.status) {
    err.status = 500;
  }
  let dataObj = {
    errStatus: err.status
  }

  res.status(err.status);
  res.setHeader('Content-Type', 'text/html');
  res.render(viewUrl, {
      html: serverRender(<ErrorPage data={dataObj} />),       
      metaData: {
        title:'Expedition Bharat - ' + err.status + ' Error'
      }
  });
}