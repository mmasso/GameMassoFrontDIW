const gulp = require("gulp");
const concat = require('gulp-concat');

const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const uglify = require("gulp-uglify");

const htmlmin = require("gulp-htmlmin");

const postcss = require("gulp-postcss");
const cssnano = require("cssnano");

const imagemin = require("gulp-imagemin");

const del = require("del");

// To prevent rewriting the source and build folder locations
const paths = {
  source: "./src",
  build: "./dist/src"
};

function javascriptBuild() {
    return gulp
      .src(`${paths.source}/js/*.js`)
      .pipe((concat('bundle.js'))
      .pipe(source("./js/*.js"))
      // Turn it into a buffer!
      .pipe(buffer())
      // And uglify
      .pipe(uglify())
      .pipe(gulp.dest(`${paths.build}/js`))
  );
}

// Write our html task in a seperate function
function htmlBuild() {
  return gulp
    .src(`${paths.source}/*.html`)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(paths.build));
}

function htmlHackBuild() {
    return gulp
      .src(`${paths.source}/resources/*.html`)
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest("dist/src/resources"));
  }

function cssBuild() {
  return gulp
    .src(`${paths.source}/styles/*.css`)
    .pipe(postcss([cssnano()]))
    .pipe(gulp.dest(`${paths.build}/styles`));
}

//image minifier
function imgSquash() {
  return gulp
    .src("./src/assets/img/*")
    //.pipe(imagemin())
    .pipe(gulp.dest("./dist/src/assets/img"));
}

function font() {
    return gulp
        .src('./src/assets/fonts/*.{ttf,otf}')
        .pipe(gulp.dest('./dist/src/assets/fonts'));
}
 
font.description = 'Generate web font package from ttf and otf files.';

function cleanup() {
  // Simply execute del with the build folder path
  return del([paths.build]);
}

// We have to change our exposed task, these functions can be ran in parallel as they do not depend on eachother.
// If your functions should run synchronously use gulp.series()

// We have to run the cleanup task first, after which we can run the build tasks
exports.build = gulp.series(
  cleanup,
  htmlBuild,
  gulp.parallel(javascriptBuild, cssBuild, imgSquash, font, htmlHackBuild)
);

exports.clean = gulp.series(
    cleanup
  );