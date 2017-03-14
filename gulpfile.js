var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    postcss = require('gulp-postcss'),
    mqpacker = require("css-mqpacker"),
    rigger = require('gulp-rigger'),
    replace = require('gulp-string-replace'),
    sourcemaps = require('gulp-sourcemaps'),
    htmlmin = require('gulp-htmlmin');


gulp.task('sass', function() {
    setTimeout(function() {
        return gulp.src('src/scss/**/*.scss')
            .pipe(sourcemaps.init())
            .pipe(sass())
            .pipe(sourcemaps.write())
            .pipe(autoprefixer(['last 5 versions', '> 1%'], { cascade: true }))
            .pipe(postcss([mqpacker()]))
            .pipe(gulp.dest('src/css'))
            .pipe(browserSync.reload({ stream: true }));
    }, 300);
});


// gulp.task('html', function() {
//     gulp.src('src/parts/index.html')
//         .pipe(rigger())
//         .pipe(gulp.dest('src'));
// });

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'src'
        },
        notify: false
    });
});

gulp.task('scripts', function() {
    return gulp.src(['src/js/*.js', '!src/js/*.min.js'])
        .pipe(concat('main.min.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('src/js'));
});

gulp.task('css-min', ['sass'], function() {
    return gulp.src(['src/css/*.css', '!src/css/*min.css'])
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('watch', ['browser-sync', 'sass', 'scripts'], function() {
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/*.html', [browserSync.reload]);
    gulp.watch('src/js/**/*.js', ['scripts', browserSync.reload]);
});

gulp.task('clean', function() {
    return del.sync(['docs']);
});

gulp.task('buildImg', function() {
    return gulp.src('src/img/**/*.+(jpg|png|svg)')
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{ removeViewBox: true }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('docs/img'));
});

gulp.task('buildHtml', function() {
    return gulp.src('src/*.html')
        .pipe(replace('libs/', ''))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('docs'));
})

gulp.task('buildCss', ['css-min'], function() {
    return gulp.src(['src/css/*.min.css', 'src/libs/css/*.css'])
        .pipe(gulp.dest('docs/css'))
})

gulp.task('buildFonts', function() {
    return gulp.src(['src/fonts/*.*'])
        .pipe(gulp.dest('docs/fonts'))
})

gulp.task('buildJs', ['scripts'], function() {
    return gulp.src(['src/js/*.min.js', 'src/libs/js/*.js'])
        .pipe(gulp.dest('docs/js'))
})

gulp.task('build', ['clean', 'buildHtml', 'buildImg', 'buildCss', 'buildJs', 'buildFonts'])

gulp.task('clear', function() {
    return cache.clearAll();
})

gulp.task('default', ['watch']);

// FAVICONS

var realFavicon = require('gulp-real-favicon');
var fs = require('fs');
var FAVICON_DATA_FILE = 'faviconData.json';

gulp.task('generate-favicon', function(done) {
    realFavicon.generateFavicon({
        masterPicture: './src/img/favicon.png',
        dest: './src',
        iconsPath: '',
        design: {
            ios: {
                pictureAspect: 'backgroundAndMargin',
                backgroundColor: '#ffffff',
                margin: '14%',
                src: {
                    ios6AndPriorIcons: false,
                    ios7AndLaterIcons: true,
                    precomposedIcons: false,
                    declareOnlyDefaultIcon: true
                }
            },
            desktopBrowser: {},
            windows: {
                pictureAspect: 'whiteSilhouette',
                backgroundColor: '#a2ca28',
                onConflict: 'override',
                src: {
                    windows80Ie10Tile: false,
                    windows10Ie11EdgeTiles: {
                        small: false,
                        medium: true,
                        big: false,
                        rectangle: false
                    }
                }
            },
            androidChrome: {
                pictureAspect: 'noChange',
                themeColor: '#ffffff',
                manifest: {
                    display: 'standalone',
                    orientation: 'notSet',
                    onConflict: 'override',
                    declared: true
                },
                src: {
                    legacyIcon: false,
                    lowResolutionIcons: false
                }
            },
            safariPinnedTab: {
                pictureAspect: 'silhouette',
                themeColor: '#fd634e'
            }
        },
        settings: {
            compression: 5,
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: false
        },
        markupFile: FAVICON_DATA_FILE
    }, function() {
        done();
    });
});

gulp.task('inject-favicon-markups', function() {
    return gulp.src(['src/parts/index.html'])
        .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
        .pipe(gulp.dest('src/parts'));
});

gulp.task('check-for-favicon-update', function(done) {
    var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
    realFavicon.checkForUpdates(currentVersion, function(err) {
        if (err) {
            throw err;
        }
    });
});


gulp.task('buildFavicons', function() {
    return gulp.src(['src/*.png', 'src/browserconfig.xml', 'src/*.svg', 'src/manifest.json'])
        .pipe(gulp.dest(''))
});