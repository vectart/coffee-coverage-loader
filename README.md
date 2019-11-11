# zolmeister-coffee-coverage-loader
Webpack coffee-coverage loader to compile and instrument CoffeeScript with sourcemaps support

see https://github.com/jmortlock/coffee-coverage-loader

and https://github.com/vectart/coffee-coverage-loader


Example Karma config

```coffee
module.exports = (config) ->
  config.set
    frameworks: ['mocha']
    browsers: ['ChromeHeadless']
    files: [
      'test/**/*.coffee'
    ]
    preprocessors:
      '**/*.coffee': ['webpack']
    webpack:
      mode: 'development'
      devtool: 'inline-source-map'
      module:
        rules: [
          {
            test: /\.coffee$/
            use: ['zolmeister-coffee-coverage-loader']
          }
        ]
      resolve:
        extensions: ['.coffee', '.js']
    webpackMiddleware:
      noInfo: true
      stats: 'errors-only'
    reporters: ['progress', 'coverage-istanbul']
    coverageIstanbulReporter:
      reports: ['text', 'html', 'json']
      combineBrowserReports: true
      fixWebpackSourcePaths: true
      skipFilesWithNoCoverage: false
      instrumentation:
        excludes: ['**/test/**']
```
