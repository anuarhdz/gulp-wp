const { src, dest, watch, series, parallel } = require("gulp");
const path = require("path");
const os = require("os");
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const cleancss = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const del = require("del");
const browserSync = require("browser-sync").create();

// cms path
const themeDirectory = "cms/wp-content/themes/k-theme";
const themeCSS = "cms/wp-content/themes/k-theme/assets/css";
const themeJS = "cms/wp-content/themes/k-theme/assets/js";
const themeIMG = "cms/wp-content/themes/k-theme/assets/img";
//const craftfonts = "cms/wp-content/themes/k-theme/assets/fonts";
const themeAssets = "cms/wp-content/themes/k-theme/assets/";
const wpcss = "!cms/wp-content/themes/k-theme/style.css";
const lib = "!cms/wp-content/themes/k-theme/lib/theme_support.php";

// dev path
const imgfiles = "dev/assets/img/**/*.+(png|jpg|gif|svg)";
const fontfiles = "dev/assets/fonts/**/*.+(eot|svg|ttf|woff)";
const cssfiles = "dev/assets/scss/**/*.scss";
const jsfiles = "dev/assets/js/**/*.js";
const htmlfiles = "dev/templates/**/*.php";
const wpcssdev = "dev/templates/style.css";
const mainjs = "main.js";
const maincss = "dev/assets/scss/main.scss";
const devjs = "dev/assets/js/";


// get all js files to compile - check scripts function
const alljsfiles = [mainjs];

const vHost = "VHost here";

// clean cms assets and templates
function clean(done) {
  console.log("clean assets and templates process...");
  return del([
    "cms/wp-content/themes/k-theme/assets",
    "cms/wp-content/themes/k-theme/**/*.php",
  ]);
  done();
}

// assets - img process
function graphics(done) {
  console.log("assets process...");
  return src(imgfiles).pipe(dest(themeIMG));
  done();
}

// assets - fonts process
// function fonts(done) {
//   console.log("fonts process...");
//   return src(fontfiles).pipe(dest(craftfonts));
//   done();
// }

// compilando templates
function pages(done) {
  console.log("templates process...");
  return src([htmlfiles, wpcssdev]).pipe(dest(themeDirectory));
  done();
}

// compilando scss
function css(done) {
  console.log("sass process...");
  return src(maincss)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(cleancss())
    .pipe(dest(themeCSS));
  done();
}

// compilando js
function scripts(done) {
  console.log("compiling scripts...");
  alljsfiles.map(function (entry) {
    return browserify({
      entries: [devjs + entry],
    })
      .transform(babelify, { presets: ["@babel/preset-env"] })
      .bundle()
      .pipe(source(entry))
      .pipe(rename({ extname: ".min.js" }))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
      .pipe(sourcemaps.write())
      .pipe(dest(themeJS));
  });
  done();
}

function server(done) {
  browserSync.init({
    //https:true,
    proxy: vHost,
    reloadDelay: 2000,
  });
  done();
}


function reload(done) {
  browserSync.reload();
  done();
}

function dev() {
  watch(
    [cssfiles, jsfiles, htmlfiles, imgfiles, fontfiles],
    series(clean, parallel(css, scripts, graphics, fonts, pages, reload))
  );
}

const watchtasks = series(
  clean,
  css,
  scripts,
  fonts,
  graphics,
  pages,
  server,
  dev
);

const buildtasks = series(
  clean,
  css,
  scripts,
  fonts,
  graphics,
  pages
);

// exports and commands
exports.fonts = fonts;
exports.graphics = graphics;
exports.scripts = scripts;
exports.css = css;
exports.pages = pages;
exports.clean = clean;
exports.default = watchtasks;
exports.blackmagic = watchtasks;
exports.buildingspell = buildtasks;
exports.build = buildtasks;
