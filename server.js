/* Main application entry file. Please note, the order of loading is important.
 * Configuration loading and booting of controllers and custom error handlers */

import express from 'express';
import path from 'path';
import configObj from "./config/config";
import expressConfig from "./config/express";
import router from "./config/router";

// Load configurations
const env = process.env.NODE_ENV || 'dev';
const config = configObj[env];
const app = express();
app.set("port", process.env.PORT || 3000);

expressConfig(app, config, router(express)).then(function() {
    app.listen(app.get("port"), function() {
        console.info("The server is listening on port " + app.get("port"));
    });
}).catch(function(err) {
    console.error("Error in starting the server " + err.stack);
    process.exit();
});
