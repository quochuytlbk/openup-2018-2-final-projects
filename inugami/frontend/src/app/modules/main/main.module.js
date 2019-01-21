import angular from 'angular';

import '../add/add.module';
import '../focus/focus.module';
import '../organize/organize.module';
import '../track/track.module';

angular.module('app.main', [
  'ui.router',
  'app.main.organize',
  'app.main.add',
  'app.main.focus',
  'app.main.organize',
  'app.main.track'
]);

require('./components/sidebar/sidebar.component');
require('./components/main-layout/main-layout.component');
require('./main.routes');
require('./main.services');
