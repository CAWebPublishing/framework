#!/usr/bin/env node

/**
 * External dependencies
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const pkg = JSON.parse( fs.readFileSync(path.resolve('package.json')) );

let scripts = {
    "caweb": "caweb",
    "postbuild": "npm run create-entrypoint",
    "create-entrypoint": "node ./lib/scripts/create-entrypoints.js",
    "update-scripts": "node ./lib/scripts/update-scripts.js",
    "new-scheme": "node ./lib/scripts/schemes.js",
    "remove-scheme": "node ./lib/scripts/schemes.js -r",
    "test": "echo \"Error: run tests from root\" && exit 0",
    "build": "npm run build:prod && npm run build:dev",
    "build:prod": "caweb build --config ./lib/scripts/create-entrypoints.js --mode production",
    "build:dev": "caweb build --config ./lib/scripts/create-entrypoints.js --mode development"
};

// iterate over all colorschemes
fs.readdirSync(path.resolve('src', 'styles', 'colorschemes')).forEach((c) => {
    let scheme = c.substring(0, c.indexOf('.')).replace(' ', '');

    // add build scripts for each colorscheme 
    scripts[`build:${scheme}`] = `npm run build:${scheme}:prod && npm run build:${scheme}:dev`;
    scripts[`build:${scheme}:prod`] = `caweb build --config ./lib/entry/${scheme}.js --mode production`;
    scripts[`build:${scheme}:dev`] = `caweb build --config ./lib/entry/${scheme}.js --mode development`;
    
    // add serve scripts for each colorscheme 
    scripts[`serve:${scheme}`] = `caweb serve --config ./lib/entry/${scheme}.js ./lib/scripts/webpack.test.js --scheme false --no-jshint --no-audit --no-a11y`;
    scripts[`serve:${scheme}:audit`] = `caweb serve --config ./lib/entry/${scheme}.js ./lib/scripts/webpack.test.js --scheme false`;

})

// update scripts in package.json
pkg.scripts = scripts;

// write package.json file 
fs.writeFileSync(
    'package.json',
    JSON.stringify( pkg, null, 4 )
)
