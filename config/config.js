/* jshint ignore:start */
module.exports = {
    dev: {
      basePath: "http://dev.expeditionbharat.com",
      sslBasePath: "http://dev.expeditionbharat.com",
      imgPath: 'http://dev.expeditionbharat.com',
      root: require('path').normalize(__dirname + '/..'),
      app: {
        name: 'DEV - NodeJS Server for Expedition Bharat'
      },
      logLevel: 'debug',
      staticPath: '',
      fontPath: ''
    }
  , build: {
      basePath: "http://build.expeditionbharat.com",
      sslBasePath: "http://build.expeditionbharat.com",
      imgPath: 'http://build.expeditionbharat.com',
      root: require('path').normalize(__dirname + '/..'),
      app: {
        name: 'BUILD - NodeJS Server for Expedition Bharat'
      },
      logLevel: 'debug',
      staticPath: '',
      fontPath: ''
    }
  , preprod: {
      basePath: "http://preprod.expeditionbharat.com",
      sslBasePath: "http://preprod.expeditionbharat.com",
      imgPath: 'http://preprod.expeditionbharat.com',
      root: require('path').normalize(__dirname + '/..'),
      app: {
        name: 'PREPROD - NodeJS Server for Expedition Bharat'
      },
      logLevel: 'debug',
      staticPath: '',
      fontPath: ''
    }
  , prod: {
      basePath: "http://www.expeditionbharat.com",
      sslBasePath: "http://www.expeditionbharat.com",
      imgPath: 'http://www.expeditionbharat.com',
      root: require('path').normalize(__dirname + '/..'),
      app: {
        name: 'PRODUCTION - NodeJS Server for Expedition Bharat'
      },
      logLevel: 'info',
      staticPath: '',
      fontPath: ''
    }
}
