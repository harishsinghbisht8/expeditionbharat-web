import { h, render, Component } from 'preact';
import serverRender from 'preact-render-to-string';
import configObj from '../../config/config';
import ReactifyCore from 'reactify-core';
import Home from "../views/home/components/index";

let env = process.env.NODE_ENV || 'dev';
let config = configObj[env];
let viewUrl = 'common/templates/index_compiled';

export function homePageHandler(req, res, next) {
  let dataObj = {}
  let htmlString = serverRender(<Home data={dataObj} />);

  res.setHeader('Content-Type', 'text/html');
  res.render(viewUrl, {
      html: htmlString,
      metaData: {
        title:'Expedition Bharat'
      }
  });
}

let return404Error = (next) => {
  var err = new Error();
    err.message='not found';
    err.status = 404;
    next(err);
    return;
}