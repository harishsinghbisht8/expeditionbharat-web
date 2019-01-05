/* jshint ignore:start */

/**
 * Module dependencies.
 */
var express = require('express');
var expressWinston = require('express-winston');
var winston = require('winston');
//var viewHelpers = require('./middlewares/view');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var compression = require('compression');
var path = require('path');
var multer = require('multer');
var uuidV1 = require('uuid/v1');

var errorPageController = require("../app_react/controllers/errorPageController");
var fileController = require("../app_react/controllers/fileController");
var env = process.env.NODE_ENV || 'dev';
var commonFilesHashes={
  runtime: 'ui.runtime.' + parseInt(Math.random()*10000000) + '.js',
  common: 'ui.common.' + parseInt(Math.random()*10000000) + '.js',
  app: 'ui.app.' + parseInt(Math.random()*10000000) + '.js',
  polyfill: 'ui.polyfill.' + parseInt(Math.random()*10000000) + '.js'
};

var isSecure = function(req) {
  return (req && req.headers && req.headers["x-forwarded-proto"] && req.headers["x-forwarded-proto"] === "https");
}

module.exports = function (app, config, router) {
  let filePromise = fileController.init()
  filePromise.then(function(fileHashes) {
    commonFilesHashes={
      runtime: fileHashes['runtime'],
      common: fileHashes['common'],
      app: fileHashes['app'],
      polyfill: fileHashes['polyfill']
    };
  })

  app.disable('etag');
  app.disable('view cache');
  app.set('showStackError', true);

  // should be placed before express.static
  app.use(compression({
    filter: function (req, res) {
        return (req.url.indexOf("/js/dist/") == -1 || req.url.indexOf("/css/") == -1) && /json|text|javascript|css/.test(res.getHeader('Content-Type'));
    },
    level: 9
  }))

  // cookieParser should be above session
  app.use(cookieParser());

  // set views path, template engine and default layout
  app.set('views', path.join(config.root, '/app_react/views/'))
  app.set('view engine', 'ejs');

  app.use(methodOverride());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(multer());

  if(!process.env.NODE_TEST) {

      if(env == "build") {
          app.use(expressWinston.logger({
              transports: [
                  new winston.transports.Console({
                      json: true,
                      timestamp: true
                  })
              ],
              exitOnError: false
          }));
      }else{
          app.use(expressWinston.logger({
              transports: [
                  new (winston.transports.Console)({
                      json: true,
                      timestamp: true,
                      stringify: function (obj) {
                          return JSON.stringify(obj);
                      }
                  })
              ],
              exitOnError: false
          }));
      }
  }

  app.get('/**', function (req, res, next) {
    res.locals.selfUrl = ( isSecure(req) ? 'https' : 'http') + '://' + req.get('host') + (req.path !== "/" ? req.path : "");
    res.locals.commonFilesHashes = commonFilesHashes;
    
    if (req.url.indexOf("/js/") != -1 || req.url.indexOf("/css/") != -1 || req.url.indexOf("/fonts/") != -1) {
      //add cache header for static js, css and font files to 1 year
      res.setHeader("Cache-Control", "public, max-age=31536000");
      res.setHeader("Expires", new Date(Date.now() + 31536000000).toUTCString());
      next();
    } else {
      //add cache header no-cache and expires header to now
      //and also set URL for canonical tags in ejs
      res.setHeader("Cache-Control", "no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Expires", new Date(Date.now()).toUTCString());
      next();
    }
  });

  //use routes
  app.use(router);

  app.use(fileController.middleware);
  
  if(!process.env.NODE_TEST) {
      if(env == "build") {
          app.use(expressWinston.errorLogger({
              transports: [
                  new winston.transports.Console({
                      json: true,
                      timestamp: true,
                      level: "error"
                  })
              ],
              exitOnError: false
          }));
      }else{
          app.use(expressWinston.errorLogger({
              transports: [
                  new (winston.transports.Console)({
                      json: true,
                      timestamp: true,
                      level: "error",
                      stringify: function (obj) {
                          return JSON.stringify(obj);
                      }
                  })
              ],
              exitOnError: false
          }));
      }
  }


  //404 or other errors page handling
  app.use(function(err, req, res, next) {
    winston.error(err);

    //do not cache error response
    res.setHeader("Cache-Control", "no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Expires", new Date(Date.now()).toUTCString());

    // error page
    errorPageController.default(err, req, res);
  });

  app.use(function(req, res, next) {
    var err = new Error();
    err.message='not found';
    err.status = 404;

    //do not cache 404 response
    res.setHeader("Cache-Control", "no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Expires", new Date(Date.now()).toUTCString());

    // error page
    errorPageController.default(err, req, res);
  });

  return filePromise;
}

