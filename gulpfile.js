var gulp  = require('gulp'),
    gutil = require('gulp-util');

//client task
gulp.task("client", function () {
    var src = "./dist/**";
    dest = "./release";
    return gulp.src(src)
        .pipe(gulp.dest(dest));
});
//assets
gulp.task("assets", function () {
    var src = "./assets/**";
    dest = "./release/assets";
    return gulp.src(src)
        .pipe(gulp.dest(dest));
});
//server tasks
gulp.task("main", function () {
    var src = ["./myapp/app.js", './myapp/package.json','./myapp/config/url.js'],
        dest = "./release";
    return gulp.src(src)
        .pipe(gulp.dest(dest));
});

gulp.task("server", function () {
    var src = './myapp/**/*.js',
        dest = "./release/myapp";
    return gulp.src(src)
        .pipe(gulp.dest(dest));
});
gulp.task("default",['client','assets','main','server'],function () {
    console.log('finished!');
});