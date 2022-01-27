const gulp = require('gulp')
const gulpClean = require('gulp-clean')
const gulpHtmlMin = require('gulp-htmlmin')
const gulpAutoPrefixer = require('gulp-autoprefixer')
const gulpCleanCss = require('gulp-clean-css')
const gulpUglify = require('gulp-uglify')

function clean(callback) {
	return gulp
		.src('dist', {
			read: false,
			allowEmpty: true,
		})
		.pipe(gulpClean())
		.on('end', callback)
}

function copySrc(callback) {
	return gulp
		.src(['src/**/*', '!src/**/*.+(html|css|js)'])
		.pipe(gulp.dest('dist'))
		.on('end', callback)
}

function processHtml(callback) {
	return gulp
		.src('src/**/*.html')
		.pipe(gulpHtmlMin({ collapseWhitespace: true }))
		.pipe(gulp.dest('dist'))
		.on('end', callback)
}

function processCss(callback) {
	return gulp
		.src('src/**/*.css')
		.pipe(gulpAutoPrefixer())
		.pipe(gulpCleanCss())
		.pipe(gulp.dest('dist'))
		.on('end', callback)
}

function processJs(callback) {
	return gulp
		.src('src/**/*.js')
		.pipe(gulpUglify())
		.pipe(gulp.dest('dist'))
		.on('end', callback)
}

function build(callback) {
	return gulp.parallel(copySrc, processHtml, processCss, processJs)(callback)
}

exports.clean = clean
exports.build = build
exports.default = gulp.series(clean, build)
