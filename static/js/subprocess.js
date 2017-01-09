var spawn = require('child_process').spawn;
var path = require('path');

function run_sample(pipeline_data, cb){
  let pyth = spawn('python', ['static/js/server.py']);
  pyth.stdin.write(JSON.stringify(pipeline_data));
  pyth.stdin.end();
  pyth.stdout.pipe(process.stdout);
  pyth.stderr.pipe(process.stdout);
  pyth.on('exit', (error_code) => {
   console.log("Exit", error_code);
   cb();
  });
}

function run_batch(pipeline_data, cb){
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
  var code_result = ''
  let pyth = spawn('python', ['static/js/server.py']);
  // pyth.stdout.pipe(process.stdout);
  // pyth.stderr.pipe(process.stdout);
  pyth.stdin.write(JSON.stringify(pipeline_data));
  pyth.stdin.end();
  pyth.stdout.on('data', function(data){
    console.log(data.toString());
    code_result = data.toString();
  });
  pyth.on('exit', (error_code) => {
    console.log("Exit", error_code);
    cb(code_result);
  });
}


module.exports = {
  run_sample: run_sample,
  run_batch: run_batch,
  get_pipeline_code: get_pipeline_code
};
