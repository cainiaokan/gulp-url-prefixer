/* eslint-env node, mocha */
'use strict'

var path = require('path')
var fs = require('fs')
var gulp = require('gulp')
var autoUrl = require('../../')
var through = require('through2')

describe('gulp-url-prefixer', function () {
  describe('auto prefix urls in html', function () {
    it('should has appropriate url prefix', function (done) {
      gulp.task('auto-prefixer-html', function () {
        var resultContents = fs.readFileSync(path.join(__dirname, 'case1.html'), {encoding: 'utf-8'})
        var targetUrl = 'app/page1/index.html'
        if (process.platform === 'win32') {
          targetUrl = targetUrl.replace(/\/+/g, path.sep)
        }
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
          }
        }

        return gulp.src(path.join(__dirname, 'app/**/*.html'), {base: __dirname})
          .pipe(autoUrl.html({
            cdn: ext2CDN
          }))
          .pipe(stream)
      })
      gulp.start('auto-prefixer-html')
    })
  })
})
