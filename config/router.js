import routes from "../app_react/routes/index";
import configObj from '../config/config';
import path from 'path';

const env = process.env.NODE_ENV || 'dev';
const config = configObj[env];

export default  function (express) {
    let router = express.Router();

    router.get('/version.txt', function (req, res) {
        res.send({ server: 'OK', date: new Date() });
    });

    router.get('/service-worker-nm.js', function(req, res) {
    	res.sendFile(path.join(config.root, 'service-worker-nm.js'));
    });

    router.use('/', routes);

    return router;
};