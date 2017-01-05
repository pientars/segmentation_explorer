import simplejson as json
import model
import os, sys
import argparse

def run_sample(data):
  go_okay = False
  print 'DATA:' + str(data)
  try:
    model.run_sample(data['path'], data['filename'], data['pipeline'])
    go_okay = True
  except:
    print 'Error in pipeline'
    go_okay = False
  return go_okay

def batch(data):
  go_okay = False
  print data
  try:
    model.run_set_on_batch(data['filenames'], data['out_dir'], data['pipeline'])
    go_okay = True
  except:
    go_okay = False
  return go_okay

if __name__ == '__main__':
  with open('../sample/mentat_pipeline.json') as data_file:
    data = json.load(data_file)
    print data
    # data = json.loads(json.load(data_file))
    func_code = data['func_code']
    if func_code == 'sample':
      exit(run_sample(data))
    elif func_code == 'batch':
      exit(batch(data))
