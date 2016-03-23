# gulp-url-prefixer
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/cainiaokan/gulp-url-prefixer)
[![Build Status](https://travis-ci.org/cainiaokan/gulp-url-prefixer.svg?branch=master)](https://travis-ci.org/cainiaokan/gulp-url-prefixer) 
[![npm version](https://img.shields.io/npm/v/gulp-url-prefixer)](https://www.npmjs.com/package/gulp-url-prefixer) 
[![Dependency Status](https://david-dm.org/cainiaokan/gulp-url-prefixer.svg)](https://david-dm.org/cainiaokan/gulp-url-prefixer) 
[![Coverage Status](https://coveralls.io/repos/github/cainiaokan/gulp-url-prefixer/badge.svg?branch=master)](https://coveralls.io/github/cainiaokan/gulp-url-prefixer?branch=master)

> prefix urls of static assets in a flexible way with [Gulp-Url-Prefixer](https://github.com/cainiaokan/gulp-url-prefixer)

*Issues with the output should be reported on the GulpUrlPrefixer [issue tracker](https://github.com/cainiaokan/gulp-url-prefixer/issues).*

## Install
```
$ npm install --save-dev gulp-url-prefixer
```

## Usage

```js
const gulp = require('gulp');
const urlPrefixer = require('gulp-url-prefixer');

gulp.task('default', () =>
  gulp.src('src/**/*.html')
    .pipe(urlPrefixer.html({
      cdn: 'http://yourcdn.com/myapp/'
    }))
    .pipe(gulp.dest('dist'))
);
```

### options
Type: `object`

Set options described below from its properties. 
  
#### options.matches
Type: `object`
Default:
```js
{
  'script': 'src',
  'link': 'href',
  'a': 'href',
  'img': 'src'
}
```

Set matched tags & attributes

#### options.cdn
Type: `string\function`
Default: `http://localhost/`

cdn url used to prefix the local paths.
if it's a function, return value will be used as cdn url.

```js

const path = require('path')

const pathToCdn = (pathname) =>
  const extname = path.extname(pathname)
  let cdn = null
  switch (extname) {
    case '.js':
    cdn = 'http://j1.mycdn.com/mywebsite/'
    break;
    case '.css':
    cdn = 'http://j2.mycdn.com/mywebsite/'
    break;
  }

gulp.task('default', =>
  gulp.src('src/**/*.html')
    .pipe(urlPrefixer.html({cdn: pathToCdn}))
    .pipe(gulp.dest('dist'))
);
```

#### options.placeholderFuncName
Type: `string`
Default: `__uri`

before prefixing
```js
location.href = __uri('/mywebsite/service/index.html')
```

after prefixing (assume you config.cdn option is `http://youwebsite.com/`)
```
location.href = 'http://youwebsite.com//mywebsite/service/index.html'
```

set placeholder function name. this is where the prefixer starts the url prefixing job in js files

## License

MIT © [Louie Lang](https://github.com/cainiaokan)


