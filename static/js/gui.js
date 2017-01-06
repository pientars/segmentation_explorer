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
          console.log(d)
          // Build the popup

          var menu_pos = {},
              menu_width = 0;
          canvas = d3.select(".dashboard-container");
          var name = ''
          if (d3_target.classed('kernel-label')){
            // get rents
            var kern_subtray = d3_target.node().parentNode;
            menu_pos = $(kern_subtray).offset();
            menu_width = $(kern_subtray).width() + 10;
            name = d3_target.text();
            // console.log(menu_pos, menu_width)
          } else {
            menu_pos = $(d3_target.node()).offset();
            menu_width = $(d3_target.node()).width() + 10;
            name = d3_target.select('h1').text();
          }

          popup = canvas.append("div")
              .attr("class", "popup")
              .style("left", (menu_pos.left+menu_width) + "px")
              .style("top", menu_pos.top + "px");
          popup.append("h4").attr('class', 'param-header').text(name + ' Parameters');
          add_parameters_to_popup(popup, name, d3_target.attr('id'))

          canvasSize = [ canvas.node().offsetWidth,
                         canvas.node().offsetHeight];
          popupSize = [ popup.node().offsetWidth,
                        popup.node().offsetHeight];
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

meta_params = {'gaussian':[{'name':'sigma', 'disp_name':'Sigma', 'type':'numeric', 'default':1.0},
                           {'name':'mode', 'disp_name':'Boundary', 'type':'disc', 'opts':['reflect', 'nearest', 'mirror', 'wrap'], 'default':'nearest'}]}

function add_parameters_to_popup(popup, name, p_ind){
  var l_name = name.toLowerCase();
  switch (l_name) {
    case 'gabor':
      popup.append('a').attr('href', 'http://scikit-image.org/docs/dev/api/skimage.filters.html#gabor')
      break;
    case 'gaussian':
      popup.append('a').attr('href', 'http://scikit-image.org/docs/dev/api/skimage.filters.html#gaussian')
        .text('Scikit-image: '+ name)
        .attr('target', '_blank')
        .attr('class', 'param-link');
      add_forms_for_params(p_ind, l_name);
      break;
    case 'median':
    break;
    case 'scharr':
    break;
    case 'roberts':
      break;
    // Morphology
    case 'closing':
    break;
    case 'dilation':
    break;
    case 'erosion':
    break;
    case 'opening':
      break;
    // Transforms
    case 'rgb2gray':
      break;
  }
}

function is_param_default(param, p_ind){
  if (params[p_ind][param.name] != param.default) return params[p_ind][param.name];
  return param.default;
}

function add_forms_for_params(p_ind, l_name){
  meta_params[l_name].forEach(function(param){
    if (param.type === 'numeric'){
      var input_g = popup.append('div').attr('class', 'input-group param-group');
      input_g.append('span')
        .attr('class', 'input-group-addon')
        .text(param.disp_name);
      input_g.append('input')
        .attr('class', 'form-control')
        .attr('id', param.name)
        .attr('placeholder', is_param_default(param, p_ind));
      $('#'+param.name).change(function(d) {
        params[p_ind][$(this).attr('id')] = $(this).val()
      })
    } else if (param.type === 'disc') {
      var input_g = popup.append('div').attr('class', 'input-group param-group');
      var input_b = input_g.append('div').attr('class', 'input-group-btn');
      input_b.append('button')
        .attr('class', 'btn btn-secondary dropdown-toggle')
        .attr('type', 'button')
        .attr('data-toggle', 'dropdown')
        .attr('aria-haspopup', 'true')
        .attr('aria-expanded', 'false')
        .text(param.disp_name);
      var droppy = input_b.append('ul').attr('class', 'dropdown-menu')
        .attr('id', 'droppy-'+p_ind)
        .attr('role', 'menu');
      param.opts.forEach(function(opto){
        droppy.append('li')
          .attr('role', 'presentation')
          .attr('id', param.name)
          .append('a')
            .attr('class', 'dropdown-item')
            .attr('href', '#')
            .text(opto)
      });
      input_g.append('input')
        .attr('class', 'form-control')
        .attr('id', 'param-input-'+p_ind)
        .attr('placeholder', is_param_default(param, p_ind));
      $('#droppy-'+p_ind+' li').on('click', function(){
        params[p_ind][$(this).attr('id')] = $(this).text()
        $('#param-input-'+p_ind).val($(this).text());
      });
    } else {
      console.log('Illegal param type')
    }
  })
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
