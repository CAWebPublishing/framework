This is the Official CAWebPublishing Framework frontendend toolkit used by the CAWebPublishing Service 

<i>This framework is inspired by [Bootstrap](https://getbootstrap.com/)</i>

## Installation
```
npm install --save-dev @caweb/framework
```


## How to use this repository
There are various different scripts that can be ran  

### Build
<code>npm run build</code> - will build all colorschemes minified and unminified.  
<code>npm run build:prod</code> - will build all colorschemes minified only.  
<code>npm run build:dev</code> - will build all colorschemes unminified only.  

<code>npm run build:&lt;colorscheme&gt;</code> - will build that specific colorscheme minified and unminified.  
<code>npm run build:&lt;colorscheme&gt;:prod</code> - will build that specific colorscheme minified only.  
<code>npm run build:&lt;colorscheme&gt;:dev</code> - will build that specific colorscheme unminified only.  

### Serve
<code>npm run serve:&lt;colorscheme&gt;</code> - will serve that specific colorscheme without running a11y checks, css audits, jshints.  
<code>npm run serve:&lt;colorscheme&gt;:audit</code> - will serve that specific colorscheme and also run a11y checks, css audits, jshints.

### Update scripts
<code>npm run update-scripts</code> - This will regenerate the build/serve commands.  

### Creating Entrypoints
<code>npm run create-entrypoint</code> - This will generate a webpack entrypoint for each of the colorschemes in the ./src/styles/colorschemes directory.
