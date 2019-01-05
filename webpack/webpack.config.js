const webpackClientConfig = require("./webpack.config.client");
const webpackServerConfig = require("./webpack.config.server");

module.exports = (env = {}) => {
    return [webpackServerConfig, webpackClientConfig(env)];
};
