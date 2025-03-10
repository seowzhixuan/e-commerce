const dotenv = require('dotenv').config();

const debug = require("debug");
const http = require("http");
const config = require('./appsettings');

async function main() {
    try {
        const app = await require("./startup.js")(config);
        http.createServer(app)
            .listen(config.port,
                () => {
                    console.log(`Listening port: ${config.port}`);
                    debug(`Listening port: ${config.port}`);
                }
            );
    } catch (e) {
        console.error(e);
        debug("ERROR", e);
    }
}

main();
