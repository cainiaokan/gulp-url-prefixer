var gutil = require('gulp-util')
var path = require('path')
var through = require('through2')
var PLUGIN_NAME = 'gulp-url-prefixer'

var default_conf = {
  tags: ['script', 'link', 'a', 'img', 'embed'],
  attrs: ['src', 'href'],
  prefix: 'http://localhost/',
  placeholderFuncName: '__uri',
  splitOn: ''
}

var config = {}

var processConf = function (conf) {
  Object.keys(default_conf).forEach(function (key) {
    config[key] = conf[key] || default_conf[key]
  })
}

var buildHtmlTagRegex = function () {
  var tags = config.tags
  return new RegExp('<\\s*(' + tags.join('|') + ')[\\s\\S]*?>', 'g')
}

var buildHtmlAttrRegex = function () {
  var attrs = config.attrs
  return new RegExp('\\s+(' + attrs.join('|') + ')=([\'"]?)([\\s\\S]*?)(\\?[\\s\\S]*?)?\\2', 'g')
}

var buildCssRegex = function () {
  return /url\((['"])?([\s\S]+?)(\?[\s\S]*?)?\1\)/g
}

var buildJsRegex = function () {
  return new RegExp(config.placeholderFuncName + '\\s*\\(\\s*([\'"])([\\s\\S]+?)(\\?[\\s\\S]*?)?\\1([\\s\\S]*?)\\)', 'g')
}

var buildUrl = function (file, url, prefix, splitOn) {
  if (splitOn !== '') {
    var urls = url.split(splitOn)
    for (let i = 0; i < urls.length; i++) {
      let url = urls[i].trim()
      urls[i] = _buildUrl(file, url, prefix)
    }
    return urls.join(splitOn)
  } else {
    return _buildUrl(file, url, prefix)
  }
}

var _buildUrl = function (file, url, prefix) {
  if (url.charAt(0) === '/') {
    url = url.substring(1)
  } else {
    url = path.join(path.dirname(file.relative), url)
  }

  url = path.normalize(url)

  if (prefix.charAt(prefix.length - 1) !== '/') {
    prefix += '/'
  }

  url = prefix + url

  if (process.platform === 'win32') {
    url = url.replace(/\\+/g, '/')
  }

  return url
}

var autoHtmlUrl = function (file, tagReg, attrReg) {
  var prefix = config.prefix
  var contents = file.contents.toString().replace(tagReg, function (match, tagName) {
    return match.replace(attrReg, function (__, attrName, delimiter, url, search) {
      if (url.indexOf(':') === -1 && /[\w\/\.]/.test(url.charAt(0))) {
        url = buildUrl(file, url, typeof prefix === 'function' ? prefix(url) : prefix, config.splitOn)
        delimiter = delimiter || ''
        search = search || ''
        return ' ' + attrName + '=' + delimiter + url + search + delimiter
      } else {
        return __
      }
    })
  })
  file.contents = new Buffer(contents)
}

var autoCssUrl = function (file, reg) {
  var prefix = config.prefix
  var contents = file.contents.toString().replace(reg, function (match, delimiter, url, search) {
    if (url.indexOf(':') === -1 && /[\w\/\.]/.test(url.charAt(0))) {
      delimiter = delimiter || ''
      search = search || ''
      url = buildUrl(file, url, typeof prefix === 'function' ? prefix(url) : prefix, config.splitOn)
      return 'url(' + delimiter + url + search + delimiter + ')'
    } else {
      return match
    }
  })
  file.contents = new Buffer(contents)
}

var autoJsUrl = function (file, reg) {
  var prefix = config.prefix

  var contents = file.contents.toString().replace(reg, function (match, delimiter, url, search, appendix) {
    if (url.indexOf(':') === -1) {
      delimiter = delimiter || ''
      search = search || ''
      appendix = appendix || ''

      url = buildUrl(file, url, typeof prefix === 'function' ? prefix(url) : prefix, config.splitOn)
      url = delimiter + url + search + delimiter + appendix
      return url
    } else {
      return match
    }
  })

  file.contents = new Buffer(contents)
}

exports.js = function (conf) {
  processConf(conf)
  var reg = buildJsRegex()
  return through.obj(function (file, encoding, cb) {
    if (file.isStream()) {
      return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'))
    }
    autoJsUrl(file, reg)
    cb(null, file)
  })
}

exports.css = function (conf) {
  processConf(conf)
  var reg = buildCssRegex()
  return through.obj(function (file, encoding, cb) {
    if (file.isStream()) {
      return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'))
    }
    autoCssUrl(file, reg)
    cb(null, file)
  })
}

exports.html = function (conf) {
  processConf(conf)
  var tagReg = buildHtmlTagRegex()
  var attrReg = buildHtmlAttrRegex()
  return through.obj(function (file, encoding, cb) {
    if (file.isStream()) {
      return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'))
    }
    autoHtmlUrl(file, tagReg, attrReg)
    cb(null, file)
  })
}
