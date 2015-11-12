'use strict';

var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var jshint 		= require('gulp-jshint');
var nodemon     = require('gulp-nodemon');

gulp.task('serve', ['nodemon']);

// Browser reloading
gulp.task('browser-sync', ['nodemon'], function() {
    var port = 5000;
    browserSync.init({
        proxy : 'http://localhost:4000',
        port : port
    });

    gulp.watch('./views/*.jade').on('change', browserSync.reload);
    //gulp.watch('js/*.js').on('change', browserSync.reload);
});

// Inspect javascript files with jshint and report errors
gulp.task('inspect', function() {
	return gulp.src(['./**/*.js', '!node_modules/**/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// Start server and restart on changes
gulp.task('nodemon', function (cb) {
    
    var started = false;
    
    return nodemon({
        script: 'bin/www',
        env: {'NODE_ENV': 'development'}
    }).on('start', function () {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            cb();
            started = true;
        } 
    });
});

gulp.task('default', ['inspect', 'test', 'serve']);

