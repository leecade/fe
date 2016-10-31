import path from 'path'
import fs from 'fs'
import del from 'rimraf'
import gulp from 'gulp'
import plumber from 'gulp-plumber'
import newer from 'gulp-newer'
import babel from 'gulp-babel'
// import watch from 'gulp-watch'
import gutil from 'gulp-util'
import optimizejs from 'gulp-optimize-js'

const dist = 'lib'
const src = 'src/**/*.js'

const babelRc = JSON.parse(fs.readFileSync(path.join(__dirname, '.babelrc'), 'utf8'))

// gulp.task('default', gulp.series('build', 'ws', 'watch'))

gulp.task('clean', cb => del(dist, cb))

const build = cb => gulp.src(src)
  .pipe(plumber({
    errorHandler (err) {
      gutil.log(err.stack)
    }
  }))
  .pipe(newer(dist))
  .pipe(babel(babelRc))
  .pipe(optimizejs())
  .pipe(gulp.dest(dist))

const watch = cb => gulp.watch(src, build)
gulp.task(build)
gulp.task(watch)
gulp.task('default', gulp.series('clean', 'build'))
