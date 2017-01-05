var sp = require('./subprocess.js');
var path = require('path')

var params = {},
    c_params = 0,
    files = [],
    filters = ['Gabor','Gaussian', 'Median', 'Roberts', 'Scharr'],
    morphologies = ['Closing', 'Dilation', 'Erosion', 'Opening'],
    transforms = ['RGB2Gray', 'Rotate'],
    contextMenuShowing = false;
let out_dir = '',
    input_dir = '',
    sample_image = '';


function run_gui(){
  add_kernel_options();
  drag_it_up();

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

  $('#run-button').on('click', run_samples )

  d3.select("body").on('contextmenu',function (d,i) {
      if(contextMenuShowing) {
          d3.event.preventDefault();
          d3.select(".popup").remove();
          contextMenuShowing = false;
      } else {
          d3_target = d3.select(d3.event.target);
          if (d3_target.classed("moved")) {
              d3.event.preventDefault();
              contextMenuShowing = true;
              d = params[d3_target.attr('id')];
              console.log(d)
              // Build the popup

              canvas = d3.select(".dashboard-container");
              mousePosition = d3.mouse(canvas.node());

              popup = canvas.append("div")
                  .attr("class", "popup")
                  .style("left", mousePosition[0] + "px")
                  .style("top", mousePosition[1] + "px");
              popup.append("h2").text('BARF');
              popup.append("p").text(
                  "The " +  " division (wearing " + " uniforms) had " + " casualties during the show's original run.")

              canvasSize = [
                  canvas.node().offsetWidth,
                  canvas.node().offsetHeight
              ];

              popupSize = [
                  popup.node().offsetWidth,
                  popup.node().offsetHeight
              ];

              if (popupSize[0] + mousePosition[0] > canvasSize[0]) {
                  popup.style("left","auto");
                  popup.style("right",0);
              }

              if (popupSize[1] + mousePosition[1] > canvasSize[1]) {
                  popup.style("top","auto");
                  popup.style("bottom",0);
              }
          }
      }
  });
}

function add_kernel_options() {
  filters.forEach(function(filt) {
    d3.select('#collapse1')
      .append('div').attr('class', 'kernel-subtray kernel-filter')
      .append('h1').attr('class', 'kernel-label').text(filt)
  });
  morphologies.forEach(function(filt) {
    d3.select('#collapse2')
      .append('div').attr('class', 'kernel-subtray kernel-morphology')
      .append('h1').attr('class', 'kernel-label').text(filt)
  });
  transforms.forEach(function(filt) {
    d3.select('#collapse3')
      .append('div').attr('class', 'kernel-subtray kernel-transform')
      .append('h1').attr('class', 'kernel-label').text(filt)
  });
}

function run_batch(d){
  // input_dir = $('#input-dir-input').val();
  // if (input_dir.length === 0) {
  //   alert('Enter a batch directory.');
  //   return false;
  // }
  // out_dir = $('#output-dir-input').val();
  // if (out_dir.length === 0) {
  //   alert('Enter an output directory.');
  //   return false;
  // }
  // sample_image = $('#sample-input').val();
  // files = [input_dir+sample_image]
  // var trilden = [];
  // $('#pipeline-inner-tray > div > h1.kernel-label').contents().each(function(d){
  //   trilden.push({
  //     'name': $(this).text().toLowerCase(),
  //     'params':params['moved-'+d]
  //   });
  // });
  // console.log(trilden)
  // post_data = {'filenames':files, 'pipeline':trilden, 'out_dir':out_dir};
  // d3.json('/batch/').post(
  // JSON.stringify(post_data), function(error, d) {
  //   $("body").css("cursor", "default")
  //   if (error) {
  //     alert('SERVER ERROR DERP!')
  //   }
  //   console.log(d)

  // });
}

function run_samples(){
  input_dir = $('#batch-dir-input').val();
  if (input_dir.length === 0) {
    alert('Enter a batch directory.');
    return false;
  }
  out_dir = $('#output-dir-input').val();
  sample_image = $('#sample-file-file').val();
  files = [input_dir+sample_image]
  var trilden = [];

  $('#pipeline-inner-tray > div').each(function(i, d){
    var id = $(d).attr('id'),
        label = $(d).children('h1.kernel-label').text();
        trilden.push({
          'name': label.toLowerCase(),
          'params':params[id]
        });
        console.log(label)
  });
  var fn = sample_image.split('\\').pop().split('/').pop();
  var sample_dir = path.join(process.cwd(), '/static/sample/', fn)
  pipeline_data = {'filename':sample_dir,
                   'pipeline':trilden,
                   'path':input_dir,
                   'func_code':'sample'};
  sp.run_sample(pipeline_data, update_sample_image);
}

function drag_it_up() {
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
}

function update_sample_image(){
  d = new Date();
  var fn = sample_image.split('\\').pop().split('/').pop();
  d3.select('.sample-tray').transition().duration(500).style('opacity', 1);
  d3.select('.sample-img').attr('src','./static/sample/'+fn+'?'+d.getTime());
}

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

module.exports = {
  draw_gui: run_gui
};
