import configObj from '../../config/config';
import fs from 'fs';
import path from 'path';
import send from 'send';
import url from 'url';

let env = process.env.NODE_ENV || 'dev';
let config = configObj[env];
let rootPath = path.join(config.root + '/public');
let chunkFileListJSON = {};

export function init() {
	return new Promise((resolve, reject)=> {
		fs.readFile(path.join(rootPath, '/js/chunkFileList.json'), 'utf8', function (err, data) {
			if (err) {
				console.error('chuckFileList.json reading error', err);
				resolve();
				return;
			}

			console.log("chunkFileListJSON read success");
			chunkFileListJSON = JSON.parse(data);
			resolve(chunkFileListJSON);
		});
	})
}

export function getFilePathWithHash(chunkName) {
	return chunkFileListJSON[chunkName];
}

function serve(req, res) {
	var filePath = url.parse(req.url).pathname;
	var fileName = path.basename(filePath);
	var fileNameParts = fileName.split(".");
	var fileFound = false;

	let acceptEncoding = req.header('accept-encoding');
	let encoding = '', contentEncoding = '';
	if(typeof acceptEncoding == 'string') {
		if (acceptEncoding.indexOf('br') != -1) {
			encoding = '.br';
			contentEncoding = 'br';
		} else if (acceptEncoding.indexOf('gzip') != -1) {
			encoding = '.gz';
			contentEncoding = 'gzip';
		}
	}

	if(fileNameParts.length>3 && fileNameParts[0]=='eb' && fileNameParts[3]=='js' && chunkFileListJSON[fileNameParts[1]]) {
		filePath = path.join(path.dirname(filePath), chunkFileListJSON[fileNameParts[1]]);
		filePath +=encoding;
		fileFound = true;
		res.setHeader('Content-Encoding', contentEncoding);
		res.setHeader('Content-Type', 'application/javascript');
	}
	
	return send(req, filePath,{
		maxage: filePath == req.url && !fileFound ? 0 : 1000 * 60 * 60 * 24 * 365,
		index: "index.html",
		ignore: undefined,
		root: rootPath
	});
}
export function middleware(req, res, next) {
	if(req.method !== "GET" && req.method !== "HEAD") return next();

	serve(req, res)
		.on("error", function(err) {
			if(err.status == 404) return next();
			return next(err);
		})
		.pipe(res);
}