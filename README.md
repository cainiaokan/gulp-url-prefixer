# gulp-url-prefixer
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/cainiaokan/gulp-url-prefixer)
[![Build Status](https://travis-ci.org/cainiaokan/gulp-url-prefixer.svg?branch=master)](https://travis-ci.org/cainiaokan/gulp-url-prefixer) 
[![npm version](https://img.shields.io/npm/v/gulp-url-prefixer.svg)](https://www.npmjs.com/package/gulp-url-prefixer) 
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
      prefix: 'http://yourcdn.com/myapp/'
    }))
    .pipe(gulp.dest('dist'))
);
```

### options
Type: `object`

Set options described below from its properties. 
  
#### options.tags
Type: `array`
Default:
```js
['script', 'link', 'a', 'img', 'embed']
```

Set matched tags

#### options.attrs
Type: `array`
Default:
```js
['href', 'src']
```

Set matched attributes

#### options.prefix
Type: `string\function`
Default: `http://localhost/`

used to prefix the local paths of assets.
if it's a function, the return value will be used.

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
    .pipe(urlPrefixer.html({prefix: pathToCdn}))
    .pipe(gulp.dest('dist'))
);
```

#### options.placeholderFuncName
Type: `string`
Default: `__uri`

set placeholder function name.

before
```js
location.href = __uri('/mywebsite/service/index.html')
```

after (assume you config.prefix option is `http://youwebsite.com/`)
```js
location.href = 'http://youwebsite.com/mywebsite/service/index.html'
```

### API

#### html

prefix local urls of html like files

```js
gulp.src('src/**/*.{html,tmpl}')
  .pipe(urlPrefixer.html({
    prefix: 'http://yourcdn.com/myapp/',
    tags: ['script', 'link', 'img']
  }))
  .pipe(gulp.dest('dist'))
```

#### css

prefix local urls of css like files

```js
gulp.src('src/**/*.{css,less}')
  .pipe(urlPrefixer.css({
    prefix: 'http://yourcdn.com/myapp/'
  }))
  .pipe(gulp.dest('dist'))
```

#### js

prefix local urls of js like files

```js
gulp.src('src/**/*.{js,html}')
  .pipe(urlPrefixer.js({
    prefix: 'http://yourcdn.com/myapp/',
    placeholderFuncName: '__prefix'
  }))
  .pipe(gulp.dest('dist'))
```


## License

MIT © [Louie Lang](https://github.com/cainiaokan)


