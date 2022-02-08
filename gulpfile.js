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

function processManifest(profile, callback) {
	const suffix = profile === null ? '' : ` (${profile})`
	return gulp
		.src(`${SOURCE_DIR}/manifest.json`)
		.pipe(
			// Look at key "name" in manifest.json
			// Extract only the extension name and append suffix
			// The extension name only contains \w and \s, and must end with \w
			gulpReplace(/"name": "([\w\s]*\w).*"/, `"name": "$1${suffix}"`),
		)
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
		callback => processManifest(profile, callback),
		processHtml,
		processCss,
		processJs,
	)(callback)
}

exports.clean = clean
exports.dev = gulp.series(clean, callback => build('development', callback))
exports.prod = gulp.series(clean, callback => build(null, callback)) // Production profile
