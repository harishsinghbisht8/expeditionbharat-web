var path = require('path');
var fs = require('fs');

function ChunkFileList(options) {
  if (!options.path) {
    throw new Error("path property is required on options");
  }

  // Configure your plugin with options...
  this.options = Object.assign({}, {
    fileName: 'chunkFileList.json',
  }, options);

}

ChunkFileList.prototype.apply = function(compiler) {
  let self = this;

  compiler.plugin("emit", function(compilation, callback) {
    let filename = path.join(self.options.path, self.options.fileName);
    addChunksPath(compilation.getStats().toJson().chunks, filename);
    callback();
  });
};

function addChunksPath(chunks, outFile) {
  let outputJson = {
    timeStamp: Date.now()
  };
  for(let i=0; i<chunks.length; ++i) {
    outputJson[chunks[i].names[0]] = chunks[i].files[0];
  }
  outputJson = JSON.stringify(outputJson);
  fs.writeFile(outFile, outputJson, 'utf8', function (err) {
    
    if (err) {
      console.error('\n*******************************************');
      console.error('ChunkFileList: out file writing error', err);
      console.error('*******************************************');
      return;
    }
    console.log('\ChunkFileList: The file is saved', outFile);
  });
}

module.exports = ChunkFileList;