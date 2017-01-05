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
  $('#run-batch-button').on('click', run_batch )
  $('#run-code-button').on('click', run_code )

  d3.select("body").on('contextmenu', parameter_context);
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

function run_batch(){
  input_dir = $('#batch-dir-input').val();
  if (input_dir.length === 0) {
    alert('Enter a batch directory.');
    return false;
  }
  out_dir = $('#output-dir-input').val();
  if (out_dir.length === 0) {
    out_dir = path.join(input_dir, '/output/');
  }
  sample_image = $('#sample-file-file').val();
  files = [input_dir+sample_image]
  var trilden = [];
  $('#pipeline-inner-tray > div > h1.kernel-label').contents().each(function(d){
    trilden.push({
      'name': $(this).text().toLowerCase(),
      'params':params['moved-'+d]
    });
  });
  pipeline_data = {'input_dir':input_dir,
                   'filenames':files,
                   'pipeline':trilden,
                   'out_dir':out_dir,
                   'func_code':'batch'};
  $("body").css("cursor", "progress");
  sp.run_batch(pipeline_data, remove_loading_bar);
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
  $("body").css("cursor", "progress");
  sp.run_sample(pipeline_data, update_sample_image);
}

function run_code() {
  trilden = []
  $('#pipeline-inner-tray > div').each(function(i, d){
    var id = $(d).attr('id'),
        label = $(d).children('h1.kernel-label').text();
        trilden.push({
          'name': label.toLowerCase(),
          'params':params[id]
        });
  });
  var pipeline_data = {'pipeline':trilden, 'func_code':'code'}
  $("body").css("cursor", "progress");
  sp.get_pipeline_code(pipeline_data, draw_code_popup)
}

function remove_loading_bar() {
  $("body").css("cursor", "default");
  //TODO remove the loading bar
}

function draw_code_popup(code){
  $("body").css("cursor", "default");
  var code_html = Prism.highlight(code, Prism.languages.python);
  d3.select('#code-pre').html(code_html)
  $('#myModal').modal('show')
}

function update_sample_image(){
  $("body").css("cursor", "default");
  d = new Date();
  var fn = sample_image.split('\\').pop().split('/').pop();
  d3.select('.sample-tray').transition().duration(500).style('opacity', 1);
  d3.select('.sample-img').attr('src','./static/sample/'+fn+'?'+d.getTime());
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

function parameter_context(d, i) {
  if(contextMenuShowing) {
      d3.event.preventDefault();
      d3.select(".popup").remove();
      contextMenuShowing = false;
  } else {
      d3_target = d3.select(d3.event.target);
      console.log(d3_target, d3_target.classed("moved"))
      if (d3_target.classed("moved")) {
          d3.event.preventDefault();
          contextMenuShowing = true;
          d = params[d3_target.attr('id')];
          // console.log(d)
          // Build the popup

          var menu_pos = {},
              menu_width = 0;
          canvas = d3.select(".dashboard-container");
          if (d3_target.classed('kernel-label')){
            // get rents
            var kern_subtray = d3_target.node().parentNode;
            menu_pos = $(kern_subtray).offset();
            menu_width = $(kern_subtray).width() + 10;
            // console.log(menu_pos, menu_width)
          } else {
            menu_pos = $(d3_target.node()).offset();
            menu_width = $(d3_target.node()).width() + 10;
          }

          // TODO obvs need to have separate templates for each params

          popup = canvas.append("div")
              .attr("class", "popup")
              .style("left", (menu_pos.left+menu_width) + "px")
              .style("top", menu_pos.top + "px");
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

          if (popupSize[0] + (menu_pos.left+menu_width) > canvasSize[0]) {
              popup.style("left","auto");
              popup.style("right",0);
          }

          if (popupSize[1] + menu_pos.top > canvasSize[1]) {
              popup.style("top","auto");
              popup.style("bottom",0);
          }
      }
  }
}

function on_drop(el){
  el.className += ' moved';
  el.id = 'moved-'+c_params;
  $(el).find('h1.kernel-label').addClass('moved').attr('id', 'moved-'+c_params);
  var name = $(el).find('h1.kernel-label').text().toLowerCase();
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
