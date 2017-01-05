var spawn = require('child_process').spawn;
var path = require('path');
var jsonfile = require('jsonfile');

function run_sample(pipeline_data, cb){
  file = './static/sample/mentat_pipeline.json'
  jsonfile.writeFile(file, pipeline_data, function (err) {
    if (err != undefined || err != null) console.log(err);
  })

  // let pyth = spawn('python', ['-u'], {argv0:'server.py'});
  // let pyth = spawn('/Users/Astraeus/anaconda/bin/python2.7', [], {argv0:'/static/js/server.py'});
  // let pyth = spawn('python', ['/static/js/server.py'], {argv0:'/static/js/server.py'});
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

module.exports = {
  run_sample: run_sample
};
