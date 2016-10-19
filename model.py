import numpy
from skimage import io, feature, filters, morphology
import os
from shutil import copyfile

def run_set_on_batch(filenames, out_dir, pipeline):
  # is out_dir there?
  if not os.path.exists(out_dir):
    os.mkdir(out_dir)

  for fil in filenames:
    fn = os.path.basename(fil)
    image = io.imread(fil)
    new_image = apply_pipeline(image, pipeline)
    io.imsave(os.path.join(out_dir, fn), new_image)

def apply_pipeline(im, pipeline):
  for pip in pipeline:
    name = pip['name']
    pms = pip['params']
    if (name == 'gaussian'):
      im = filters.gaussian(im, sigma=pms['sigma'], mode=pms['mode'])
    elif (name == 'gabor'):
      im = filters.gaussian(im, sigma=pms['sigma'], mode=pms['mode'])
    else:
      print '$$$ Error: ' + name + ' not valid kernel.'
  return im

def copy_sample_to_server(path, fn):
  print 'Copying '+os.path.join(path,fn)+' to '+ os.path.join('/static/sample/',fn)
  copyfile(os.path.join(path,fn), os.path.join('/static/sample/',fn) )


if __name__ == '__main__':
  fn = ['/Users/Astraeus/Documents/mentat_data/arth.jpg']
  pipez = [{'name':'gaussian', 'params':{'sigma':1, 'mode':'nearest'}}]
  out_dir = '/Users/Astraeus/Documents/mentat_data/output/'
  run_set_on_batch(fn, out_dir, pipez)
