// Values that are injected into our serverless.yml config
// ${file(../src/serverless-yml.js):functions}

import './load-all';
const c = require('./config');

for(const name in c) {
    exports[name] = () => c[name];
}