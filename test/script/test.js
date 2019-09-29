/* eslint-env node, mocha */
'use strict'

var path = require('path')
var fs = require('fs')
var gulp = require('gulp')
var autoUrl = require('../../')
var through = require('through2')

describe('gulp-url-prefixer', function () {
  describe('auto prefix urls in js', function () {
    it('should has right url prefix', function (done) {
      gulp.task('auto-prefixer-js', function () {
        var resultContents = fs.readFileSync(path.join(__dirname, 'case1.js'), {encoding: 'utf-8'})
        var targetUrl = process.platform === 'win32' ? 'app\\page1\\index.js' : 'app/page1/index.js'

        var stream = through.obj(function (file, encoding, cb) {
          if (file.relative === targetUrl) {
            file.contents.toString().should.be.eql(resultContents)
            done()
          }
          cb()
        })

        function ext2CDN (pathname) {
          switch (path.extname(pathname)) {
            case '.html':
              return 'http://sta.mycdn.com'
            case '.png':
              return 'http://img.mycdn.com'
          }
        }

        return gulp.src(path.join(__dirname, 'app/**/*.js'), {base: __dirname})
          .pipe(autoUrl.js({
            prefix: ext2CDN,
            splitOn: ','
          }))
          .pipe(stream)
      })
      gulp.start('auto-prefixer-js')
    })
  })
})
