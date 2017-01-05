var spawn = require('child_process').spawn;
var path = require('path');
var jsonfile = require('jsonfile');

function run_sample(pipeline_data, cb){
  file = './static/sample/mentat_pipeline.json'
  jsonfile.writeFile(file, pipeline_data, function (err) {
    if (err != undefined || err != null) console.log(err);
  })

  let pyth = spawn('python', ['static/js/server.py']);
  // let pyth = spawn('pwd', []);
  pyth.stdin.write(JSON.stringify(pipeline_data));
  pyth.stdin.end();
  // pyth.stdout.pipe(process.stdout);
  // pyth.stderr.pipe(process.stdout);
  pyth.on('exit', (error_code) => {
   console.log("Exit", error_code);
   cb();
  });
}

function run_batch(pipeline_data, cb){
  file = './static/sample/mentat_pipeline.json'
  jsonfile.writeFile(file, pipeline_data, function (err) {
    if (err != undefined || err != null) console.log(err);
  })

  let pyth = spawn('python', ['static/js/server.py']);
  pyth.stdout.pipe(process.stdout);
  pyth.stderr.pipe(process.stdout);
  pyth.stdin.write(JSON.stringify(pipeline_data));
  pyth.stdin.end();
  pyth.on('exit', (error_code) => {
   console.log("Exit", error_code);
   cb();
  });
}

function get_pipeline_code(pipeline_data, cb){
  cb();
}


module.exports = {
  run_sample: run_sample,
  run_batch: run_batch,
  get_pipeline_code: get_pipeline_code
};
