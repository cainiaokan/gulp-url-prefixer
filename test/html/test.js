/* eslint-env node, mocha */
'use strict'

var path = require('path')
var fs = require('fs')
var gulp = require('gulp')
var autoUrl = require('../../')
var through = require('through2')

describe('gulp-url-prefixer', function () {
  describe('auto prefix urls in html', function () {
    it('should has right url prefix', function (done) {
      gulp.task('auto-prefixer-html', function () {
        var resultContents = fs.readFileSync(path.join(__dirname, 'case1.html'), {encoding: 'utf-8'})
        var targetUrl = process.platform === 'win32' ? 'app\\page1\\index.html' : 'app/page1/index.html'

        var stream = through.obj(function (file, encoding, cb) {
          if (file.relative === targetUrl) {
            file.contents.toString().should.be.eql(resultContents)
            done()
          }
          cb()
        })

        function ext2CDN (pathname) {
          switch (path.extname(pathname)) {
            case '.css':
              return 'http://j1.mycdn.com'
            case '.js':
              return 'http://j2.mycdn.com'
            case '.html':
              return 'http://www.mysite.com'
            case '.png':
            case '.jpg':
              return 'http://img.mycdn.com'
          }
        }

        return gulp.src(path.join(__dirname, 'app/**/*.html'), {base: __dirname})
          .pipe(autoUrl.html({
            prefix: ext2CDN,
            splitOn: ',',
            attrs: ['href', 'src', 'data-src', 'data-srcset']
          }))
          .pipe(stream)
      })
      gulp.start('auto-prefixer-html')
    })
  })
})
