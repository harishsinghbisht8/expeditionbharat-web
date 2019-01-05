var path = require('path');
var fs = require('fs');

function TextReplacePlugin(options) {
  // Configure your plugin with options...
  this.options = options;
}

TextReplacePlugin.prototype.apply = function(compiler) {
  let self = this;

  compiler.plugin("emit", function(compilation, callback) {
    if(!self.options.template || !self.options.styles || !self.options.replaceString) {
      console.error('\n*******************************************');
      console.error('TextReplacePlugin: template or styles path missing');
      console.error('*******************************************');

      compilation.errors.push(new Error('TextReplacePlugin: template path missing'));
      return;
    }
    let filename;
    if(self.options.outputFilename){
      filename = path.join(path.dirname(self.options.template),self.options.outputFilename);
    }else{
      filename =  path.basename(self.options.template);
      const lastDotIndex = filename.lastIndexOf('.');
      filename = path.join(path.dirname(self.options.template), filename.substr(0, lastDotIndex) + '_compiled' + filename.substr(lastDotIndex, filename.length));
    }
    addStyles(self.options.template, filename, self.options.styles, self.options.replaceString);
    callback();
  });
};

function addStyles(inFile, outFile, stylesFile, replaceString) {
  fs.readFile(inFile, 'utf8', function (err,data) {
    if (err) {
      console.error('\n*******************************************');
      console.error('TextReplacePlugin: template file reading error', err);
      console.error('*******************************************');
      return;
    }

    let result = data;
    let regex = new RegExp(replaceString, 'g');
    fs.readFile(stylesFile, 'utf8', function (err,data) {
      if (err) {
        console.error('\n*******************************************');
        console.error('TextReplacePlugin: styles file reading error', err);
        console.error('*******************************************');
        return;
      }
      result = result.replace(regex, data);

      fs.writeFile(outFile, result, 'utf8', function (err) {
        if (err) {
          console.error('\n*******************************************');
          console.error('TextReplacePlugin: out file writing error', err);
          console.error('*******************************************');
          return;
        }
        console.log('\TextReplacePlugin: The file is saved', outFile);
      });
    });
  });
}

module.exports = TextReplacePlugin;