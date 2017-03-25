"use strict";
var gulp = require('gulp'),
	plugins = require('gulp-load-plugins')(),
	del = require('del');
	//路径
var releasePath = 'gh-pages/release/',
	releaseSrc = 'dist/*.{css,js}',
	resDest = 'dist/',
	resSrc = 'src/',
	jsSrc = 'src/paging.js',
	jsMinName = 'paging.min.js',
	scssSrc = 'src/paging.scss',
	cssSrc = 'src/paging.css',
	cssMinName = 'paging.min.css';
gulp.task('jshint', function() {
	return gulp.src(jsSrc)
		.pipe(plugins.jshint())
		.pipe(plugins.jshint.reporter('default'));
});
gulp.task('js',function () {
	return gulp.src(jsSrc)
		.pipe(plugins.jshint())
		.pipe(plugins.jshint.reporter('default'))
		.pipe(gulp.dest(resDest))
		.pipe(plugins.rename(jsMinName))
		.pipe(plugins.uglify())
		.pipe(gulp.dest(resDest));
});
gulp.task('scss',function () {
	return gulp.src(scssSrc)
		.pipe(plugins.scssLint({
			'config': 'scsslint.yml'
		}))
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.sass({outputStyle:'expanded'}).on('error', plugins.sass.logError))
		.pipe(plugins.autoprefixer({
			browsers:[
				'Android 2.3',
				'Android >= 4',
				'Chrome >= 20',
				'Firefox >= 24',
				'Explorer >= 8',
				'iOS >= 6',
				'Opera >= 12',
				'Safari >= 6'
			],
			cascade: true,
			remove:true
		}))
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
                    afterRuleEnds: true
                }
			}
		}))
		.pipe(plugins.rename(cssMinName))
		.pipe(gulp.dest(resDest));
});
gulp.task('dev', function() {
	//gulp.watch(scssSrc,['scss']);
	gulp.watch(jsSrc,['jshint']);
});
gulp.task('deploy-html',function () {
	return gulp.src('demo/*.html')
		.pipe(plugins.replace(/\.\.\/src/g,'src'))
		.pipe(gulp.dest('gh-pages/'));
});
gulp.task('deploy-res',function () {
	return gulp.src('dist/*')
		.pipe(gulp.dest('gh-pages/src/'));
});
gulp.task('deploy-rely',function () {
	return gulp.src('rely/*')
		.pipe(gulp.dest('gh-pages/rely/'));
});
gulp.task('release',['css','js'],function() {
	return gulp.src(releaseSrc)
		.pipe(plugins.zip('paging.zip'))
		.pipe(gulp.dest(releasePath));
});
gulp.task('build',['css','js','release']);
gulp.task('deploy',['deploy-html','deploy-res','deploy-rely'],function () {
	return gulp.src('./gh-pages/**/*')
		.pipe(plugins.ghPages());
});
