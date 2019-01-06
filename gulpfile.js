var gulp = require("gulp");
var minifyCSS = require("gulp-minify-css");
var less = require("gulp-less");
var concat = require("gulp-concat");
var merge = require("merge-stream");
var uglify = require("gulp-uglify");

gulp.task("swUglifyJS", function () {
    var stream1 = gulp
        .src(["./service-worker-nm.js"])
        .pipe(uglify())
        .pipe(gulp.dest("./"));

    return merge(stream1);
});

gulp.task("compileCSS", [], function () {
    var stream1 = gulp
        .src(["./app_react/views/react_core/css/common.less", "./app_react/views/home/css/index.less"])
        .pipe(less())
        .pipe(concat("eb.home.css"))
        .pipe(minifyCSS())
        .pipe(gulp.dest("./public/css/"));

    return merge(stream1);
});

gulp.task("default", ["compileCSS"]);