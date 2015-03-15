var gulp        = require('gulp'),
    semver      = require('semver'),
    shell       = require('gulp-shell'),
    watch       = require('gulp-watch'),
    bump        = require('gulp-bump'),
    pkg         = require('./package.json');

gulp.task('deploy-master', function(){
  var newVer = semver.inc(pkg.version, 'patch');
  return gulp.src(['./package.json'])
    .pipe(bump({version: newVer}))
    .pipe(gulp.dest('./'))
    .on('end', shell.task([
            'jspm bundle-sfx --minify lib/index',
            'rm -rf ./build',
            'mkdir build && cp -f ./build.js ./build/',
            'git add --all',
            'git commit -m "' + newVer + '"', 
            'git tag -a "' + newVer + '" -m "' + newVer + '"',
            'git push origin master', 
            'git push origin --tags'
           ]));

});

gulp.task('link', function(cb) {
  watch(['lib/**/*'], shell.task(['jspm link github:toddmoore/mylib@dev -y']));
});