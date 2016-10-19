import simplejson as json
import model
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
    model.copy_sample_to_server(data['path'], data['filename'])

@app.route('/batch/', methods=['POST'])
def query():
  if request.method == 'POST':
    data = json.loads(request.data)
    print data
    go_okay = True
    try:
      model.run_set_on_batch(data['filenames'], data['out_dir'], data['pipeline'])
    except:
      go_okay = False
  return json.dumps(go_okay)
  return None

if __name__ == '__main__':
  app.debug = True
  app.run()
