var spawn = require('child_process').spawn;
var path = require('path');
var jsonfile = require('jsonfile');
var process = require('process');

function run_sample(pipeline_data){
  file = './static/sample/mentat_pipeline.json'
  jsonfile.writeFile(file, pipeline_data, function (err) {
    console.error(err)
  })
  let pyth = spawn('python', ['server.py']);
  // pyth.stdin.write('python server.py sample ' + pipeline_data);
  // pyth.stdin.end();
  // var data = pyth.stdout.pipe(process.stdout);
  // var error = pyth.stderr.pipe(process.stdout);
  pyth.on('exit', () => {

   console.log("exit");
  });
}



module.exports = {
  run_sample: run_sample
};
