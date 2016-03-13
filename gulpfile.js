
var gulp = require('gulp');
var sync = require('browser-sync').create();

var notify = require('gulp-notify');

var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var stylus = require('gulp-stylus');
var jade = require('gulp-jade');

var sourcemaps = require('gulp-sourcemaps');

var path = require('path');
var fs = require('fs');
var cp = require('child_process');
var gutil = require('gulp-util');

var objectus = require('objectus');

objectus('dat/', function(error, result) {
  if (error) {
    notify(error);
  }
  data = result;
});

gulp.task('objectus', function() {
  objectus('dat/', function(error, result) {

    if (error) {
      notify(error);
    }

    data = result;

  });
  return true;
});

gulp.task('vendors', function() {

  gulp.src([
    'bower_components/jquery/dist/jquery.js',
    'bower_components/jquery.scrollTo/jquery.scrollTo.js',
  ])
  .pipe(sourcemaps.init())
  .pipe(uglify())
  .pipe(concat('vendor.min.js'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('pub/jst/lib'));

});

gulp.task('coffee', function() {
  gulp.src('cof/**/*.coffee')
    .pipe(sourcemaps.init())
    .pipe(coffee({bare: true})
      .on('error', notify.onError(function(error) {
        return {title: "Coffee error", message: error.message + "\r\n" + error.filename + ':' + error.location.first_line, sound: 'Pop'};
      }))
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('pub/jst'))
    .pipe(sync.stream());
});

gulp.task('stylus', function() {

  gulp.src('sty/main.styl')

    .pipe(sourcemaps.init())
    .pipe(stylus({ rawDefine: { data: data } })
    .on('error', notify.onError(function(error) {
      return {title: "Stylus error: " + error.name, message: error.message, sound: 'Pop' };
    })))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('pub/css'))
    .pipe(sync.stream());
});


gulp.task('jade', function() {

  gulp.src('tpl/**/index.jade')
    .pipe(jade({pretty: true, locals: {data: data}})
      .on('error', notify.onError(function(error) {
        return {title: "Jade error: " + error.name, message: error.message, sound: 'Pop' };
      }))
      .on('error', function(error) {
        console.log(error);
      })
    )
    .pipe(gulp.dest('pub'))
    .pipe(sync.stream());

});

var imgwatch;

gulp.task('sync', function() {
  sync.init({
    notify: false,
    open: false,
    server: {
      baseDir: 'pub/',
    },
    ghostMode: {
      clicks: true,
      forms: true,
      scroll: false
    },
    scrollProportionally: false,
    scrollRestoreTechnique: 'cookie'
  });

  gulp.watch('dat/**/*', ['objectus','stylus','jade']);
  gulp.watch('cof/**/*.coffee', ['coffee']);
  gulp.watch('sty/**/*.styl', ['stylus']);
  gulp.watch('tpl/**/*.jade', ['jade']);
  gulp.watch('pub/svg/**/*.svg', ['jade']);
  gulp.watch('pub/img/**/*', ['jade']);
  gulp.start('mogrify:start');

});

gulp.task('mogrify:start', function() {

  if (!imgwatch) {
    imgwatch = gulp.watch('pub/img/lrg/**/*');
    imgwatch.on('change', mogrify);
  }

});

gulp.task('mogrify:stop', function() {

  if (imgwatch) {
    imgwatch.end();
    imgwatch = null;
   }

});


function mogrify(data) {

  gulp.start('mogrify:stop');

  var images = ['.jpeg','.jpg','.png'];
  var sizes = ['2880','1440','1000'];

  if (['added','changed', 'renamed'].indexOf(data.type) != -1) {

    if (path.extname(data.path).length > 0 && images.indexOf(path.extname(data.path)) != -1) {

      dirname = path.dirname(data.path);

      for (var i = 0, l = sizes.length; i < l; i++) {

        if (dirname.match(sizes[i]) !== null) {
          gutil.log(gutil.colors.red('Image size matched in dir name, aborting'), dirname);
          return true;
        }

        // check if directory exists, if it doesnt, make it
        var sizeDir = dirname + '/' + sizes[i];

        if (fs.existsSync(sizeDir) === false) {
          gutil.log('Making directory', '\'' + gutil.colors.cyan(sizeDir) + '\'');
          cp.execSync('mkdir ' + sizeDir);
        }

        cp.execSync('cp ' + data.path + ' ' + sizeDir + '/');

        cp.execSync('mogrify -geometry ' + sizes[i] + 'x ' + sizeDir + '/' + path.basename(data.path));
        gutil.log('Scaling image ', '\'' + gutil.colors.cyan(path.basename(data.path)) + '\'', 'to ' + gutil.colors.magenta(sizes[i] + 'x'));

      }

    }

  }

  gulp.start('mogrify:start');
  return true;

}

gulp.task('watch', function() {
  gulp.watch('dat/**/*', ['objectus','stylus','jade']);
  gulp.watch('cof/**/*.coffee', ['coffee']);
  gulp.watch('sty/**/*.styl', ['stylus']);
  gulp.watch('tpl/**/*.jade', ['jade']);
});

gulp.task('default', ['objectus','coffee', 'stylus', 'jade', 'vendors']);
