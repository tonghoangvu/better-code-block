const gulp = require('gulp')
const gulpClean = require('gulp-clean')
const gulpReplace = require('gulp-replace')
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
		.src(['src/**/*', '!src/**/*.+(html|css|js)', '!src/manifest.json'])
		.pipe(gulp.dest('dist'))
		.on('end', callback)
}

function copyManifest(profile, callback) {
	// Add suffix to extension name (key "name" in manifest.json)
	const suffix = profile === 'prod' ? '' : ' (' + profile + ')'
	return gulp
		.src('src/manifest.json')
		.pipe(gulpReplace(/"name": "(.+)"/g, '"name": "$1' + suffix + '"'))
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

function build(profile, callback) {
	return gulp.parallel(
		copySrc,
		callback => copyManifest(profile, callback),
		processHtml,
		processCss,
		processJs
	)(callback)
}

exports.clean = clean
exports.dev = gulp.series(clean, callback => build('dev', callback))
exports.prod = gulp.series(clean, callback => build('prod', callback))
