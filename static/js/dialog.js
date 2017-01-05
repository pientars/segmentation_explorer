var app = require('electron').remote;
var dialog = app.dialog;

document.getElementById('batch-dir-btn').addEventListener('click',function(){
    dialog.showOpenDialog( {properties:['openDirectory']},
      function (fileNames) {
        if(fileNames === undefined){
            console.log("No file selected");
        }else{
            document.getElementById("batch-dir-input").value = fileNames[0];
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
        }
    });
},false);

document.getElementById('output-dir-btn').addEventListener('click',function(){
    dialog.showOpenDialog( {properties:['openDirectory']},
      function (fileNames) {
        if(fileNames === undefined){
            console.log("No file selected");
        }else{
            document.getElementById("output-dir-input").value = fileNames[0];
        }
    });
},false);
