var path = require('path');
var fs = require('fs');

function EJSPlugin(options) {
  // Configure your plugin with options...
  this.options = Object.assign({}, {
    chunks: 'all',
    excludeChunks: []
  }, options);
}

EJSPlugin.prototype.apply = function(compiler) {
  let self = this;

  compiler.plugin("emit", function(compilation, callback) {
    if(!self.options.template) {
      console.error('\n*******************************************');
      console.error('EJSPlugin: template path missing');
      console.error('*******************************************');

      compilation.errors.push(new Error('EJSPlugin: template path missing'));
      return;
    }

    let filename =  path.basename(self.options.template);
    const lastDotIndex = filename.lastIndexOf('.');
    filename = path.join(path.dirname(self.options.template), filename.substr(0, lastDotIndex) + '_compiled' + filename.substr(lastDotIndex, filename.length));

    let filteredChunks = filterChunks(compilation.getStats().toJson().chunks, self.options.chunks, self.options.excludeChunks);
    addChunksPath(filteredChunks, self.options.template, filename);
    callback();
  });
};

function addChunksPath(chunks, inFile, outFile) {
  fs.readFile(inFile, 'utf8', function (err,data) {
    if (err) {
      console.error('\n*******************************************');
      console.error('EJSPlugin: template file reading error', err);
      console.error('*******************************************');
      return;
    }

    let result = data;

    for(let i=0; i<chunks.length; ++i) {
      let stringToReplace = '{{{' + chunks[i].names[0] + '}}}';
      let regex = new RegExp(stringToReplace, 'g')
      let replaceString = chunks[i].files[0];
      result = result.replace(regex, replaceString);
    }

    fs.writeFile(outFile, result, 'utf8', function (err) {
      if (err) {
        console.error('\n*******************************************');
        console.error('EJSPlugin: out file writing error', err);
        console.error('*******************************************');
        return;
      }
      console.log('\nEJSPlugin: The file is saved', outFile);
    });
  });
}

function filterChunks(allChunks, chunks, excludeChunks) {
  return allChunks.filter(function(chunk) {
    return (chunks=='all' || chunks.indexOf(chunk.names[0]) != -1) && excludeChunks.indexOf(chunk.names[0]) == -1;
  });
}

module.exports = EJSPlugin;