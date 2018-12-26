import 'zone.js/dist/zone';
import 'core-js/es6';
import 'core-js/es7/reflect';
import {environment} from '@src/environments/environment';
import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from '@src/app/app.module';

if (environment.production) {
	enableProdMode();
} else {
  // Development and test
  Error['stackTraceLimit'] = Infinity;
  require('zone.js/dist/long-stack-trace-zone');
}


platformBrowserDynamic().bootstrapModule(AppModule);