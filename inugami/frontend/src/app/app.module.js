import angular from 'angular';

import 'angular-material';
import 'angular-messages';
import 'ngstorage';
import '@uirouter/angularjs';
import 'moment';
import 'ng-material-datetimepicker';

import './modules/auth/auth.module';
import './modules/main/main.module';

const app = angular.module('app', [
  'ngMaterial',
  'ngMessages',
  'ngStorage',
  'ngMaterialDatePicker',
  'app.auth',
  'app.main'
]);

app.config(function($mdThemingProvider) {
  $mdThemingProvider.definePalette('inugamiPrimaryPalette', {
    '50': 'e7edfe',
    '100': 'c3d1fe',
    '200': '9cb3fd',
    '300': '7495fc',
    '400': '567efb',
    '500': '3867fa',
    '600': '325ff9',
    '700': '2b54f9',
    '800': '244af8',
    '900': '1739f6',
    A100: 'ffffff',
    A200: 'f4f5ff',
    A400: 'c1c9ff',
    A700: 'a7b2ff',

    contrastDefaultColor: 'light',
    contrastDarkColors: ['50', '100', '200', '300', '400', 'A100', 'A200', 'A400', 'A700'],
    contrastLightColors: ['500', '600', '700', '800', '900']
  });

  $mdThemingProvider.definePalette('inugamiAccentPalette', {
    '50': 'e4e4e4',
    '100': 'bcbcbc',
    '200': '909090',
    '300': '646464',
    '400': '424242',
    '500': '212121',
    '600': '1d1d1d',
    '700': '181818',
    '800': '141414',
    '900': '0b0b0b',
    A100: '0a0a0a',
    A200: '090909',
    A400: '070707',
    A700: '050505',
    contrastDefaultColor: 'light',
    contrastDarkColors: ['50', '100', '200'],
    contrastLightColors: ['300', '400', '500', '600', '700', '800', '900', 'A100', 'A200', 'A400', 'A700']
  });

  $mdThemingProvider.theme('default').primaryPalette('inugamiPrimaryPalette');
  $mdThemingProvider.theme('default').accentPalette('inugamiAccentPalette');
});

require('./app.config.js');
require('./app.services.js');

require('./shared/components/paper-loading/paper-loading.component');
require('./shared/filters/capitalize-first-letter.filter');
