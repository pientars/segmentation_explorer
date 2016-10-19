function on_drop(el){
  el.className += ' moved';
  el.id = 'moved-'+c_params;
  name = $(el).find('h1.kernel-label').text().toLowerCase();
  switch (name) {
    case 'gabor':
      params['moved-'+c_params] = {'frequency':1.0,
                                   'mode':'nearest',
                                   'theta':0.0,
                                   'bandwidth':1.0};
    break;
    case 'gaussian':
      params['moved-'+c_params] = {'sigma':1.0, 'mode':'nearest'}
      break;
    case 'median':
    case 'scharr':
    case 'roberts':
      params['moved-'+c_params] = {}
      break;
    // Morphology
    case 'closing':
    case 'dilation':
    case 'erosion':
    case 'opening':
      params['moved-'+c_params] = {}
      break;
    // Transforms
    case 'rgb2gray':
      params['moved-'+c_params] = {}
      break;
  }
  if (sample_image != '') {
    run_samples()
  }
  c_params += 1
}
