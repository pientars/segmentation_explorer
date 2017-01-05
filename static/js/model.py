import numpy
from skimage import io, feature, filters, morphology, color
import os
from shutil import copyfile

filters_namespace = set(['gabor', 'gaussian', 'median', 'scharr', 'roberts'])
morphology_namespace = set(['closing', 'dilation', 'opening', 'erosion'])
color_namespace = set(['rgb2gray'])

def run_sample(path, filename, pipeline):
  image = io.imread(os.path.join(path,filename))
  new_image = apply_pipeline(image, pipeline)
  io.imsave(os.path.join(os.getcwd(),'static/sample/', filename), new_image)

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
    if (name == 'gabor'):
      im = filters.gabor(im, frequency=pms['frequency'],
                             theta=pms['theta'],
                             bandwidth=pms['bandwidth'],
                             mode=pms['mode'])
    elif (name == 'gaussian'):
      im = filters.gaussian(im, sigma=pms['sigma'], mode=pms['mode'])
    elif (name == 'median'):
      im = filters.median(im)
    elif (name == 'scharr'):
      im = filters.scharr(im)
    elif (name == 'roberts'):
      im = filters.roberts(im)
    # Morphology
    elif (name == 'closing'):
      im = morphology.closing(im)
    elif (name == 'dilation'):
      im = morphology.dilation(im)
    elif (name == 'erosion'):
      im = morphology.erosion(im)
    elif (name == 'opening'):
      im = morphology.opening(im)
    # Transforms
    elif (name == 'rgb2gray'):
      im = color.rgb2gray(im)
    else:
      print '$$$ Error: ' + name + ' not valid kernel.'
  return im

def copy_sample_to_server(path, fn):
  print os.getcwd()
  print 'Copying '+os.path.join(path,fn)+' to '+ os.path.join(os.getcwd(),'static/sample/',fn)
  try:
    copyfile(os.path.join(path,fn), os.path.join(os.getcwd(),'static/sample/', fn))
  except:
    return False
  return True


def generate_pipeline_python_code(pipeline, pretty=False):
  pipeline_str = '\ndef mentat_pipeline(im):'
  includes = '# Place this import at the top of your python project\n# Requires python modules skimage and numpy\n from skimage import '
  modules_used = set()
  for pip in pipeline:
    name = pip['name']
    pms = pip['params']
    if name in filters_namespace:
      modules_used.add('filters')
      pipeline_str += '\n    nu_im = filters.'+name+'(im)'
    elif name in morphology_namespace:
      modules_used.add('morphology')
      pipeline_str += '\n    nu_im = morphology.'+name+'(im)'
    elif name in color_namespace:
      modules_used.add('color')
      pipeline_str += '\n   nu_im = color.'+name+'(im)'
    includes += ','.join(list(modules_used))
    return includes + pipeline_str + '    return nu_im'


if __name__ == '__main__':
  fn = ['/Users/Astraeus/Documents/mentat_data/arth.jpg']
  # pipez = [{'name':'gaussian', 'params':{'sigma':1, 'mode':'nearest'}}]
  pipez = [{'name':'dilation', 'params':{}}]
  out_dir = '/Users/Astraeus/Documents/mentat_data/output/'
  run_sample('/Users/Astraeus/Documents/mentat_data/', 'arth.jpg', pipez)