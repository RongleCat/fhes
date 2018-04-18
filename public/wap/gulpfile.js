const gulp = require("gulp"),
  sass = require("gulp-sass"),
  babel = require("gulp-babel"),
  autoprefixer = require("gulp-autoprefixer"),
  minifycss = require("gulp-minify-css"),
  uglify = require("gulp-uglify"),
  rename = require("gulp-rename"),
  notify = require("gulp-notify"),
  sourcemaps = require("gulp-sourcemaps"),
  del = require("del"),
  vinylPaths = require("vinyl-paths"),
  watch = require("gulp-watch"),
  imagemin = require("gulp-imagemin");

const input = "lib/";
const output = "build/";

gulp.task("cleanjs", function () {
  return gulp.src(output + "js/").pipe(vinylPaths(del));
});
gulp.task("cleancss", function () {
  return gulp.src(output + "css/").pipe(vinylPaths(del));
});

// ———————— Scripts ————————

gulp.task("scripts", function () {
  return gulp
    .src(input + "js/*.js")
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(
      babel({
        presets: ["es2015"]
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest(output + "js"));
});

gulp.task("devScripts", function () {
  return (gulp
    .src(input + "js/*.js")
    .pipe(watch(input + "js/*.js"))
    // .pipe(sourcemaps.init())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(
      babel({
        presets: ["es2015"]
      })
    )
    // .pipe(uglify())
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest(output + "js")));
});

// ———————— Styles ————————

gulp.task("styles", function () {
  return gulp
    .src(input + "css/*.css")
    .pipe(
      autoprefixer(
        "last 2 version",
        "safari 5",
        "ie 8",
        "ie 9",
        "opera 12.1",
        "ios 6",
        "android 4"
      )
    )
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(minifycss())
    .pipe(gulp.dest(output + "css/"));
});
gulp.task("devStyles", function () {
  return (gulp
    .src(input + "css/*.css")
    .pipe(watch(input + "css/*.css"))
    // .pipe(sourcemaps.init())
    .pipe(
      autoprefixer(
        "last 2 version",
        "safari 5",
        "ie 8",
        "ie 9",
        "opera 12.1",
        "ios 6",
        "android 4"
      )
    )
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    // .pipe(minifycss())
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest(output + "css/"))
    );
});

gulp.task("sass", function () {
  return gulp
    .src(input + "css/*.scss")
    .pipe(sass())
    .pipe(
      autoprefixer(
        "last 2 version",
        "safari 5",
        "ie 8",
        "ie 9",
        "opera 12.1",
        "ios 6",
        "android 4"
      )
    )
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(minifycss())
    .pipe(gulp.dest(output + "css/"))
    ;
});
gulp.task("devSass", function () {
  return gulp
    .src(input + "css/*.scss")
    .pipe(watch(input + "css/*.scss"))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(
      autoprefixer(
        "last 2 version",
        "safari 5",
        "ie 8",
        "ie 9",
        "opera 12.1",
        "ios 6",
        "android 4"
      )
    )
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(minifycss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(output + "css/"))
    ;
});

gulp.task("imagemin", function () {
  gulp
    .src(input + "images/*.{png,jpg,gif,ico}")
    .pipe(watch(input + "images/*.{png,jpg,gif,ico}"))
    .pipe(imagemin({
      optimizationLevel: 7
    }))
    .pipe(gulp.dest(output + "images"))
});

gulp.task("dev", function () {
  return (process.env.NODE_ENV = "development");
});

gulp.task("pro", function () {
  return (process.env.NODE_ENV = "production");
});

// , ['cleanjs', 'cleancss']
gulp.task("default", function () {
  gulp.start("sass", "styles", "scripts", "imagemin");
});

gulp.task("watch", function () {
  gulp.start("devSass", "devStyles", "devScripts","imagemin");
});