var spawn = require('child_process').spawn;
var path = require('path');
var jsonfile = require('jsonfile');

function run_sample(pipeline_data){
  file = './static/sample/mentat_pipeline.json'
  jsonfile.writeFile(file, pipeline_data, function (err) {
    if (err != undefined || err != null) console.log(err);
  })

  let pyth = spawn('python', ['./server.py']);
  pyth.stdin.write(JSON.stringify(pipeline_data));
  pyth.stdin.end();
  pyth.stdout.on('data', function(data){
    console.log(data)
  });
  pyth.on('exit', () => {
   console.log("exit");
  });
}



module.exports = {
  run_sample: run_sample
};
