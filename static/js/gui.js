var params = {},
    c_params = 0,
    files = [],
    out_dir = '',
    input_dir = '',
    sample_image = ''

$(document).on('change', ':file', function() {
  var input = $(this),
      numFiles = input.get(0).files ? input.get(0).files.length : 1,
      derp = input.val()
      console.log(derp)
      label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
  input.trigger('fileselect', [numFiles, label]);
});

$(document).ready( function() {
  $(':file').on('fileselect', function(event, numFiles, label) {
    var input = $(this).parents('.input-group').find(':text'),
        log = numFiles > 1 ? numFiles + ' files selected' : label;

    d

    if( input.length ) {
      input.val(log);
    } else {
      if( log ) alert(log);
    }
  });

  dragula([document.getElementById('collapse1'), document.getElementById('pipeline-inner-tray')], {
    copy: function (el, source) {
    return source === document.getElementById('collapse1')
  },
  accepts: function (el, target) {
    return target !== document.getElementById('collapse1')
  },
    removeOnSpill: true
  }).on('drop', on_drop);

  dragula([document.getElementById('collapse2'), document.getElementById('pipeline-inner-tray')], {
    copy: function (el, source) {
    return source === document.getElementById('collapse2')
  },
  accepts: function (el, target) {
    return target !== document.getElementById('collapse2')
  },
    removeOnSpill: true
  }).on('drop', on_drop);

  dragula([document.getElementById('collapse3'), document.getElementById('pipeline-inner-tray')], {
    copy: function (el, source) {
    return source === document.getElementById('collapse3')
  },
  accepts: function (el, target) {
    return target !== document.getElementById('collapse3')
  },
    removeOnSpill: true
  }).on('drop', on_drop);

  var pipe_width = $('#pipeline-tray').width()
  var pipe_height = $('#pipeline-tray').height()
  d3.select('.arrow-svg').append('line')
    .attr('x1', pipe_width/2)
    .attr('y1', 10)
    .attr('x2', pipe_width/2)
    .attr('y2', pipe_height-150)
    .attr('marker-end', 'url(#arrow)')
    .style('stroke-width', '25')
    .style('stroke', '#e0e0e0');

  $

  $('#run-button').on('click', run_samples )
});

function on_drop(el){
  el.className += ' moved';
  el.id = 'moved-'+c_params;
  name = $(el).find('h1.kernel-label').text().toLowerCase();
  switch (name) {
    case 'gaussian':
      params['moved-'+c_params] = {'sigma':1.0, 'mode':'nearest'}
      break;
  }
  c_params += 1
}

function run_batch(d){
  input_dir = $('#input-dir-input').val();
  if (input_dir.length === 0) {
    alert('Enter a batch directory.');
    return false;
  }
  out_dir = $('#output-dir-input').val();
  if (out_dir.length === 0) {
    alert('Enter an output directory.');
    return false;
  }
  sample_image = $('#sample-input').val();
  files = [input_dir+sample_image]
  var trilden = [];
  $('#pipeline-inner-tray > div > h1.kernel-label').contents().each(function(d){
    trilden.push({
      'name': $(this).text().toLowerCase(),
      'params':params['moved-'+d]
    });
  });
  console.log(trilden)
  post_data = {'filenames':files, 'pipeline':trilden, 'out_dir':out_dir};
  d3.json('/batch/').post(
  JSON.stringify(post_data), function(error, d) {
    $("body").css("cursor", "default")
    if (error) {
      alert('SERVER ERROR DERP!')
    }
    console.log(d)

  });
}


function run_samples(d){
  input_dir = $('#input-dir-input').val();
  if (input_dir.length === 0) {
    alert('Enter a batch directory.');
    return false;
  }
  out_dir = $('#output-dir-input').val();
  sample_image = $('#sample-input').val();
  files = [input_dir+sample_image]
  var trilden = [];
  $('#pipeline-inner-tray > div > h1.kernel-label').contents().each(function(d){
    trilden.push({
      'name': $(this).text().toLowerCase(),
      'params':params['moved-'+d]
    });
  });
  console.log(trilden)
  post_data = {'filenames':files, 'pipeline':trilden, 'out_dir':out_dir};
  d3.json('/batch/').post(
  JSON.stringify(post_data), function(error, d) {
    $("body").css("cursor", "default")
    if (error) {
      alert('SERVER ERROR DERP!')
    }
    console.log(d)

  });
}
