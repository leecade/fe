import path from 'path'
import fs from 'fs'
import del from 'rimraf'
import gulp from 'gulp'
import plumber from 'gulp-plumber'
import newer from 'gulp-newer'
import babel from 'gulp-babel'
import gutil from 'gulp-util'
import optimizejs from 'gulp-optimize-js'
// import ava from 'gulp-ava'

const paths = {
  dist: 'lib',
  src: 'src'
}

const files = {
  src: `${paths.src}/**/*.{js,jsx}`,
  assets: `${paths.src}/**/*.{ejs,json,applescript}`,
  test: 'test/**/*.js',
  babelRc: JSON.parse(fs.readFileSync(path.join(__dirname, '.babelrc'), 'utf8'))
}

const transform = cb => gulp.src(files.src)
  .pipe(plumber({
    errorHandler (err) {
      gutil.log(err.stack)
    }
  }))
  .pipe(newer(paths.dist))
  .pipe(babel(files.babelRc))
  .pipe(optimizejs())
  .pipe(gulp.dest(paths.dist))

const copy = cb => gulp.src(files.assets)
  .pipe(newer(paths.dist))
  .pipe(gulp.dest(paths.dist))

const watch = cb => {
  gulp.watch(files.src, transform)
  gulp.watch(files.assets, copy)
}

gulp.task('clean', cb => del(paths.dist, cb))
gulp.task('build', gulp.parallel(transform, copy))
gulp.task(watch)

/*
gulp.task('test', cb => gulp.src(files.test)
  .pipe(ava({
    // watch: true,
    verbose: false,
    files: files.test,
    concurrency: 50,
    failFast: true,
    powerAssert: false,
    require: [],
    babel: 'inherit'
  })))
*/

gulp.task('default', gulp.series('clean', 'build'))
