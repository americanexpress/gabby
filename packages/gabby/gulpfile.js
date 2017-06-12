const gulp = require('gulp');
const nodemon = require('nodemon');
const ts = require('gulp-typescript');
const merge = require('merge2');

const tsProject = ts.createProject('tsconfig.json');

const SRC = './src/**/*.ts*';
const DEST = './build';

gulp.task('ts', function() {
	const tsResult = gulp.src(SRC)
		.pipe(tsProject());

	return merge([
		// typings
		tsResult.dts.pipe(gulp.dest(DEST)),
		// built js
		tsResult.js.pipe(gulp.dest(DEST))
	]);
});

gulp.task('watch:build', ['ts'], function() {
	gulp.watch(SRC, ['ts']);
});

gulp.task('watch', ['ts'], function() {
	gulp.watch(SRC, ['ts']);

	nodemon({
		script: './build/index.js',
		ext: 'js json'
	});

	nodemon.on('start', function () {
		console.log('App has started');
	}).on('quit', function () {
		console.log('App has quit');
	}).on('restart', function (files) {
		console.log('App restarted due to: ', files);
	});
});
