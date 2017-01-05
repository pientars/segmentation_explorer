import simplejson as json
import model
import os, sys
import argparse

def run_sample(data):
  go_okay = False
  try:
    model.run_sample(data['path'], data['filename'], data['pipeline'])
    go_okay = True
  except:
    print 'Error in pipeline'
    go_okay = False
  return go_okay

def batch(data):
  go_okay = False
  try:
    model.run_set_on_batch(data['input_dir'], data['out_dir'], data['pipeline'])
    go_okay = True
  except:
    go_okay = False
  return go_okay

def get_pipeline_code(data):
  code = 0
  try:
    code = model.generate_pipeline_python_code(data['pipeline'])
  except:
    print 'ERROR GENERATING CODE'
    pass
  return code
def read_in():
  lines = sys.stdin.readlines()
  return json.loads(lines[0])

def main():
  data = read_in()
  func_code = data['func_code']
  if func_code == 'sample':
    exit(run_sample(data))
  elif func_code == 'batch':
    exit(batch(data))
  elif func_code == 'code':
    code = get_pipeline_code(data)
    print code
    exit(code)


if __name__ == '__main__':
  main()
