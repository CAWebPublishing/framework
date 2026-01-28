#!/usr/bin/env node

/**
 * External dependencies
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const pkg = JSON.parse( fs.readFileSync(path.resolve('package.json')) );

let scripts = {
    "webpack": "webpack",
    "postbuild": "npm run create-entrypoint",
    "create-entrypoint": "node ./lib/scripts/create-entrypoints.js",
    "update-scripts": "node ./lib/scripts/update-scripts.js",
    "new-scheme": "node ./lib/scripts/schemes.js",
    "remove-scheme": "node ./lib/scripts/schemes.js -r",
    "test": "echo \"Error: run tests from root\" && exit 0",
    "build": "npm run build:prod && npm run build:dev",
    "build:prod": "webpack build --config ./node_modules/@caweb/webpack/webpack.config.js ./lib/scripts/create-entrypoints.js --merge --mode production",
    "build:dev": "webpack build --config ./node_modules/@caweb/webpack/webpack.config.js ./lib/scripts/create-entrypoints.js --merge --mode development"
};

// iterate over all colorschemes
fs.readdirSync(path.resolve('src', 'styles', 'colorschemes')).forEach((c) => {
    let scheme = c.substring(0, c.indexOf('.')).replace(' ', '');

    // add build scripts for each colorscheme 
    scripts[`build:${scheme}`] = `npm run build:${scheme}:prod && npm run build:${scheme}:dev`;
    scripts[`build:${scheme}:prod`] = `webpack build --config ./node_modules/@caweb/webpack/webpack.config.js ./lib/entry/${scheme}.js --merge --mode production`;
    scripts[`build:${scheme}:dev`] = `webpack build --config ./node_modules/@caweb/webpack/webpack.config.js ./lib/entry/${scheme}.js --merge --mode development`;
    
    // add serve scripts for each colorscheme 
    scripts[`serve:${scheme}`] = `set NODE_OPTIONS='--scheme' && webpack serve --config ./node_modules/@caweb/webpack/webpack.config.js ./lib/entry/${scheme}.js ./node_modules/@caweb/webpack/tests/webpack.tests.js --merge`;
    // scripts[`serve:${scheme}:audit`] = `webpack serve --config ./lib/entry/${scheme}.js ./lib/scripts/webpack.test.js --scheme false`;

})

// update scripts in package.json
pkg.scripts = scripts;

// write package.json file 
fs.writeFileSync(
    'package.json',
    JSON.stringify( pkg, null, 4 )
)
