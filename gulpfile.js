const gulp = require('gulp')
const gulpClean = require('gulp-clean')
const gulpReplace = require('gulp-replace')
const gulpHtmlMin = require('gulp-htmlmin')
const gulpAutoPrefixer = require('gulp-autoprefixer')
const gulpCleanCss = require('gulp-clean-css')
const gulpUglify = require('gulp-uglify')

const SOURCE_DIR = 'src'
const OUTPUT_DIR = 'dist'

function clean(callback) {
	return gulp
		.src(OUTPUT_DIR, { read: false, allowEmpty: true })
		.pipe(gulpClean())
		.on('end', callback)
}

function copySrc(callback) {
	return gulp
		.src([
			`${SOURCE_DIR}/**/*`,
			`!${SOURCE_DIR}/manifest.json`,
			`!${SOURCE_DIR}/**/*.+(html|css|js)`,
		])
		.pipe(gulp.dest(OUTPUT_DIR))
		.on('end', callback)
}

function copyManifest(profile, callback) {
	// Add suffix to extension name (key "name" in manifest.json)
	const suffix = profile === 'prod' ? '' : ` (${profile})`
	return gulp
		.src(`${SOURCE_DIR}/manifest.json`)
		.pipe(gulpReplace(/"name": "(.+)"/g, `"name": "$1${suffix}"`))
		.pipe(gulp.dest(OUTPUT_DIR))
		.on('end', callback)
}

function processHtml(callback) {
	return gulp
		.src(`${SOURCE_DIR}/**/*.html`)
		.pipe(gulpHtmlMin({ collapseWhitespace: true }))
		.pipe(gulp.dest(OUTPUT_DIR))
		.on('end', callback)
}

function processCss(callback) {
	return gulp
		.src(`${SOURCE_DIR}/**/*.css`)
		.pipe(gulpAutoPrefixer())
		.pipe(gulpCleanCss())
		.pipe(gulp.dest(OUTPUT_DIR))
		.on('end', callback)
}

function processJs(callback) {
	return gulp
		.src(`${SOURCE_DIR}/**/*.js`)
		.pipe(gulpUglify())
		.pipe(gulp.dest(OUTPUT_DIR))
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
