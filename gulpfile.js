"use strict";
var gulp = require('gulp'),
	plugins = require('gulp-load-plugins')(),
	del = require('del');
	//路径
var resDest = 'dist/',
	resSrc = 'src/',
	jsSrc = 'src/paging.js',
	jsMinName = 'paging.min.js',
	scssSrc = 'src/paging.scss',
	cssSrc = 'src/paging.css',
	cssMinName = 'paging.min.css';
gulp.task('js',function () {
	return gulp.src(jsSrc)
		.pipe(gulp.dest(resDest))
		.pipe(plugins.rename(jsMinName))
		.pipe(plugins.uglify())
		.pipe(gulp.dest(resDest));
});
gulp.task('scss',function () {
	return gulp.src(scssSrc)
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.sass().on('error', plugins.sass.logError))
		.pipe(plugins.sourcemaps.write())
		.pipe(gulp.dest(resSrc));
});
gulp.task('css',['scss'],function () {
	return gulp.src(cssSrc)
		.pipe(gulp.dest(resDest))
		.pipe(plugins.cleanCss({
			advanced: false,
			compatibility: 'ie8',
			keepSpecialComments: '*',
            format:{
                breaks: {
                    afterRuleEnds: true // controls if a line break comes after a rule ends; defaults to `false`
                }
			}
		}))
		.pipe(plugins.rename(cssMinName))
		.pipe(gulp.dest(resDest));
});
gulp.task('dev', function() {
	gulp.watch(scssSrc,['scss']);
});
gulp.task('build',['css','js']);
