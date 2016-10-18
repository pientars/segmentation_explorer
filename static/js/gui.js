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
  });

  dragula([document.getElementById('collapse2'), document.getElementById('pipeline-inner-tray')], {
    copy: function (el, source) {
    return source === document.getElementById('collapse2')
  },
  accepts: function (el, target) {
    return target !== document.getElementById('collapse2')
  },
    removeOnSpill: true
  });

  dragula([document.getElementById('collapse3'), document.getElementById('pipeline-inner-tray')], {
    copy: function (el, source) {
    return source === document.getElementById('collapse3')
  },
  accepts: function (el, target) {
    return target !== document.getElementById('collapse3')
  },
    removeOnSpill: true
  });

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
});

function run_samples(d){
  var trilden = [];
  console.log($('#pipeline-inner-tray > div > h1.kernel-label').contents())
  $('#pipeline-inner-tray > div > h1.kernel-label').contents().each(function(d){
    trilden.push({
      'name': $(this).text(),
    });
  });

  trilden.forEach(function(d){
    console.log(d)
  })
}
