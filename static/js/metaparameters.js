meta_params = {
  // FILTERS
  'gaussian':[{'name':'sigma', 'disp_name':'Sigma', 'type':'numeric', 'default':1.0},
              {'name':'mode', 'disp_name':'Boundary', 'type':'disc', 'opts':['reflect', 'nearest', 'mirror', 'wrap'], 'default':'nearest'}],
  'gabor':[{'name':'frequency', 'disp_name':'Frequency', 'type':'numeric', 'default':1.0},
           {'name':'theta', 'disp_name':'Theta', 'type':'numeric', 'default':0.0},
           {'name':'bandwidth', 'disp_name':'Bandwidth', 'type':'numeric', 'default':1.0},
           {'name':'n_stds', 'disp_name':'Num STD', 'type':'numeric', 'default':3.0},
           {'name':'offset', 'disp_name':'Offset', 'type':'numeric', 'default':0.0},
           {'name':'sigma_x', 'disp_name':'Sigma X', 'type':'numeric', 'default':null},
           {'name':'sigma_y', 'disp_name':'Sigma Y', 'type':'numeric', 'default':null},
           {'name':'mode', 'disp_name':'Boundary', 'type':'disc', 'opts':['reflect', 'nearest', 'mirror', 'wrap'], 'default':'nearest'}],
  'median':[{'name':'selem', 'disp_name':'Neighborhood', 'type':'numeric', 'default':null},
            {'name':'mode', 'disp_name':'Boundary', 'type':'disc', 'opts':['reflect', 'nearest', 'mirror', 'wrap'], 'default':'nearest'}],
  'roberts':[], 'scharr':[],
// MORPHOLOGY
  'closing':[{'name':'selem', 'disp_name':'Neighborhood', 'type':'numeric', 'default':null}],
  'dilation':[{'name':'selem', 'disp_name':'Neighborhood', 'type':'numeric', 'default':null},
              {'name':'shift_x', 'disp_name':'X Shift', 'type':'disc', 'opts':[true, false], 'default':false},
              {'name':'shift_y', 'disp_name':'Y Shift', 'type':'disc', 'opts':[true, false], 'default':false}],
  'erosion':[{'name':'selem', 'disp_name':'Neighborhood', 'type':'numeric', 'default':null},
              {'name':'shift_x', 'disp_name':'X Shift', 'type':'disc', 'opts':[true, false], 'default':false},
              {'name':'shift_y', 'disp_name':'Y Shift', 'type':'disc', 'opts':[true, false], 'default':false}],
  'opening':[{'name':'selem', 'disp_name':'Neighborhood', 'type':'numeric', 'default':null}],
// COLOR
  'rgb2gray':[]
}
