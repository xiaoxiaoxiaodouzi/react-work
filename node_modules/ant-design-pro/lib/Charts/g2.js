'use strict';

var _bizcharts = require('bizcharts');

(0, _bizcharts.track)(false); // 全局 G2 设置


var config = {
  defaultColor: '#1089ff',
  shape: {
    interval: {
      fillOpacity: 1
    }
  }
};

(0, _bizcharts.setTheme)(config);