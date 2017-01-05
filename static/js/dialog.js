var app = require('electron').remote;
var dialog = app.dialog;
var fs = require('fs');
document.getElementById('batch-dir-btn').addEventListener('click',function(){
    dialog.showOpenDialog( {properties:['openDirectory']},
      function (fileNames) {
        if(fileNames === undefined){
            console.log("No file selected");
        }else{
            document.getElementById("batch-dir-input").value = fileNames[0];
            input_dir = fileNames[0];
        }
    });
},false);

document.getElementById('sample-file-btn').addEventListener('click',function(){
    dialog.showOpenDialog( {properties:['openFile']},
      function (fileNames) {
        if(fileNames === undefined){
            console.log("No file selected");
        }else{
            document.getElementById("sample-file-file").value = fileNames[0];
            sample_image = fileNames[0];
            copy_file(sample_image, function(e) {
              fn = sample_image.split('\\').pop().split('/').pop();
              d3.select('.sample-tray').transition().duration(500).style('opacity', 1);
              d3.select('.sample-img').attr('src','./static/sample/'+fn);
            })

        }
    });
},false);

document.getElementById('output-dir-btn').addEventListener('click',function(){
    dialog.showOpenDialog( {properties:['openDirectory', 'createDirectory']},
      function (fileNames) {
        if(fileNames === undefined){
            console.log("No file selected");
        }else{
            document.getElementById("output-dir-input").value = fileNames[0];
            output_dir = fileNames[0];
        }
    });
},false);

function copy_file(source, cb) {
  var cbCalled = false,
      fn = sample_image.split('\\').pop().split('/').pop();
      target = './static/sample/'+fn;

  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}
