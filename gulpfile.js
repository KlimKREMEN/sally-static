var gulp            = require('gulp'),
    sass            = require('gulp-sass'),
    browserSync     = require('browser-sync'),
    concat          = require('gulp-concat'),
    uglify          = require('gulp-uglify'),
    rename          = require('gulp-rename'),
    cssnano         = require('gulp-cssnano'),
    del             = require('del'),
    autoprefixer    = require('gulp-autoprefixer'),
    spritesmith     = require('gulp.spritesmith'),
    //phantomjssmith  = require('phantomjssmith');,
    merge           = require('merge-stream'),
    buffer          = require('vinyl-buffer'),
    imagemin        = require('gulp-imagemin'),
    csso            = require('gulp-csso'),
    sourcemaps      = require('gulp-sourcemaps');

gulp.task('sass', function(){
    return gulp.src('app/sass/**/*.scss')
        //.pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: false }))
        //.pipe(sourcemaps.write('../css', {addComment: false}))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync',function(){
    browserSync({
        server: "./app"
    });
});

gulp.task('scripts', function() {
    return gulp.src([
        // 'app/libs/modernizr.js',
        'app/libs/jquery/dist/jquery.min.js',
        'app/libs/tether/dist/js/tether.min.js',
        'app/libs/bootstrap/dist/js/bootstrap.min.js',
        'app/libs/OwlCarousel2/dist/owl.carousel.min.js',
        'app/libs/gsap/src/minified/TweenMax.min.js',
        'app/libs/seiyria-bootstrap-slider/dist/bootstrap-slider.js',
        'app/libs/dropzone/dist/dropzone.js',
        'app/libs/select2/dist/js/select2.full.js'
        ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));
});

gulp.task('css-libs', ['sass'], function() {
    return gulp.src('app/css/libs.css')
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'));
});

gulp.task('sprite', function () {
    // Generate our spritesheet
    var spriteData = gulp.src('app/images/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: '_sprite.scss'
    }));

    // Pipe image stream through image optimizer and onto disk
    var imgStream = spriteData.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
        //.pipe(buffer())
        //.pipe(imagemin())
        .pipe(gulp.dest('app/images/sprites/'));

    // Pipe CSS stream through CSS optimizer and onto disk
    var cssStream = spriteData.css
        //.pipe(csso())
        .pipe(gulp.dest('app/sass/'));

    // Return a merged stream to handle both `end` events
    return merge(imgStream, cssStream);
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
    gulp.watch('app/sass/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

// ----------------------Дефолтный таск gulp --------------------------------

gulp.task('default', ['watch']);