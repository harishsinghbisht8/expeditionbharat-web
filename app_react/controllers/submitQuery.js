import configObj from '../../config/config';

let env = process.env.NODE_ENV || 'dev';
let config = configObj[env];

export function submitQuery(req, res, next) {
  let data = req.body;
  console.log(data);
  
  res.setHeader('Content-Type', 'application/json');
  res.send({"status":"OK"});
}
