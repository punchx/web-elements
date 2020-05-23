const gulp = require('gulp');
const debug = require('gulp-debug');
const browserSync = require('browser-sync').create();
const flatten = require('gulp-flatten');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('styles', () => {
  const postcss = require('gulp-postcss');
  const autoprefixer = require('autoprefixer');
  const normalize = require('postcss-normalize');

  const plugins = [autoprefixer(), normalize()];

  return gulp
    .src('./src/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss(plugins))
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/'));
});

gulp.task('js', () => {
  return gulp.src('./src/**/*.js').pipe(gulp.dest('./public/'));
});

gulp.task('html', () => {
  const include = require('gulp-file-include');
  return gulp
    .src('./src/*.html')
    .pipe(
      include({
        prefix: '@@',
        basepath: '@file',
      })
    )
    .pipe(gulp.dest('./public'));
});

gulp.task('assets', () => {
  return gulp
    .src('./src/assets/**/*.*', {
      since: gulp.lastRun('assets'),
    })
    .pipe(debug({ title: 'assets processing...' }))
    .pipe(flatten())
    .pipe(gulp.dest('./public/assets/'));
});

gulp.task('components:assets', () => {
  return gulp
    .src('./src/components/**/*.{png,svg,jpg}', {
      since: gulp.lastRun('components:assets'),
    })
    .pipe(debug({ title: 'components:assets processing...' }))
    .pipe(flatten())
    .pipe(gulp.dest('./public/assets/'));
});

gulp.task('clean', () => {
  const del = require('del');
  return del('./public');
});

gulp.task('watch', () => {
  gulp.watch('./src/**/*.html', gulp.series('html'));
  gulp.watch('./src/**/*.js', gulp.series('js'));
  gulp.watch('./src/**/*.*', gulp.series('styles'));
  gulp.watch('./src/assets/*.*', gulp.series('assets'));
  gulp.watch(
    './src/components/**/*.{png,svg,jpg}',
    gulp.series('components:assets')
  );
});

gulp.task('serve', () => {
  browserSync.init({
    server: './public',
  });
  browserSync.watch('./public/**/*.*').on('change', browserSync.reload);
});

gulp.task(
  'build',
  gulp.series(
    gulp.parallel('html', 'styles', 'js', 'assets', 'components:assets')
  )
);

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));
