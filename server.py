import simplejson as json
import model
from flask import Flask, render_template, request
app = Flask(__name__)

@app.route('/')
def index():
  return render_template('index.html')


@app.route('/submit/', methods=['POST'])
def query():
  if request.method == 'POST':
    a = 0
  return json.dumps(results)
  return None

if __name__ == '__main__':
  app.debug = True
  app.run()
