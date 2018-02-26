import './load-all';

import {handlers} from './config';
declare const exports: any;
Object.assign(exports, handlers());
