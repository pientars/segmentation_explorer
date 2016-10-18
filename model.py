import numpy
from skimage import io, feature, filters, morphology
import os


def run_set_on_batch(filenames, out_dir, pipeline):
  # is outdir there?
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
    if (name == 'gaussian'):
      im = filters.gaussian(im, sigma=pip['sigma'], mode=pip['mode'])
    elif (name == 'gabor'):
      im = filters.gaussian(im, sigma=pip['sigma'], mode=pip['mode'])
    else:
      print '$$$ Error: ' + name + ' not valid kernel.'
  return im

if __name__ == '__main__':
  fn = ['C:\Users\Hitchens\Documents\mentat_data\\buildings.jpg', 'C:\Users\Hitchens\Documents\mentat_data\\arth.jpg', 'C:\Users\Hitchens\Documents\mentat_data\\pennywise.jpg']
  pipez = [{'name':'gaussian', 'sigma':1, 'mode':'nearest'}, {'name':'gaussian', 'sigma':1, 'mode':'nearest'}, {'name':'gaussian', 'sigma':1, 'mode':'nearest'}]
  out_dir = 'C:\Users\Hitchens\Documents\mentat_data\\test'
  run_set_on_batch(fn, out_dir, pipez)
