import simplejson as json
import model
import os
from flask import Flask, render_template, request
app = Flask(__name__)

@app.route('/')
def index():
  return render_template('index.html')

@app.route('/set_sample/', methods=['POST'])
def set_sample():
  if request.method == 'POST':
    data = json.loads(request.data)
    print data
    return json.dumps(model.copy_sample_to_server(data['path'], data['filename']))
  return json.dumps(False)

@app.route('/run_sample/', methods=['POST'])
def run_sample():
  go_okay = False
  if request.method == 'POST':
    data = json.loads(request.data)
    print 'DATA:' + str(data)
    try:
      model.run_sample(data['path'], data['filename'], data['pipeline'])
      go_okay = True
    except:
      print 'Error in pipeline'
      go_okay = False
  return json.dumps(go_okay)


@app.route('/batch/', methods=['POST'])
def query():
  go_okay = False
  if request.method == 'POST':
    data = json.loads(request.data)
    print data
    try:
      model.run_set_on_batch(data['filenames'], data['out_dir'], data['pipeline'])
      go_okay = True
    except:
      go_okay = False
  return json.dumps(go_okay)

if __name__ == '__main__':
  app.debug = True
  app.run()
