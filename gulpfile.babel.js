import path from 'path'
import fs from 'fs'
import del from 'rimraf'
import gulp from 'gulp'
import plumber from 'gulp-plumber'
import newer from 'gulp-newer'
import babel from 'gulp-babel'
import gutil from 'gulp-util'
import optimizejs from 'gulp-optimize-js'

const dist = 'lib'
const src = 'src'
const srcFiles = `${src}/**/*.{js,jsx}`
const assets = `${src}/**/*.{ejs,json,applescript}`

const babelRc = JSON.parse(fs.readFileSync(path.join(__dirname, '.babelrc'), 'utf8'))

const transform = cb => gulp.src(srcFiles)
  .pipe(plumber({
    errorHandler (err) {
      gutil.log(err.stack)
    }
  }))
  .pipe(newer(dist))
  .pipe(babel(babelRc))
  .pipe(optimizejs())
  .pipe(gulp.dest(dist))

const copy = cb => gulp.src(assets)
  .pipe(newer(dist))
  .pipe(gulp.dest(dist))

const watch = cb => {
  gulp.watch(srcFiles, transform)
  gulp.watch(assets, copy)
}

gulp.task('clean', cb => del(dist, cb))
gulp.task('build', gulp.parallel(transform, copy))
gulp.task(watch)
gulp.task('default', gulp.series('clean', 'build'))
