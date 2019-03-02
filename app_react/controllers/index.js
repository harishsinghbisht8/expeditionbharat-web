import { h, render, Component } from 'preact';
import serverRender from 'preact-render-to-string';
import configObj from '../../config/config';
import ReactifyCore from 'reactify-core';
import Home from "../views/home/components/index";
import Trip from "../views/trip/components/index";
import fs from 'fs';
import path from 'path';

let env = process.env.NODE_ENV || 'dev';
let config = configObj[env];
let rootPath = path.join(config.root + '/public');
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

export function tripPageHandler(req, res, next) {
  let tripName = req.params.tripName.trim();

  fs.readFile(rootPath+'/json/trip/'+tripName+'.json', 'utf8', function read(err, data) {
      if (err) {
          console.log("trip json read error", err);
          return404Error(next);
          return;
      }
      try {
          data = JSON.parse(data);
      } catch(e) {
          console.log("trip json parse error", e);
          return404Error(next);
          return;
      }

      let htmlString = serverRender(<Trip data={data} tripName={data.tripName} />);

      res.setHeader('Content-Type', 'text/html');
      res.render(viewUrl, {
          html: htmlString,
          metaData: {
            title: data.tripName
          }
      });
  });
}

let return404Error = (next) => {
  var err = new Error();
    err.message='not found';
    err.status = 404;
    next(err);
    return;
}