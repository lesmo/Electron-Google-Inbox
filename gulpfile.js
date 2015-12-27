'use strict';

var gulp = require('gulp');
var path = require('path');
var resolve = path.resolve;

gulp.task('clean-dist', function() {
    return require('rimraf').sync(resolve(__dirname, 'dist'));
});

gulp.task('build', ['clean-dist'], function() {
    var electron = require('gulp-electron');
    var packageJson = require('./package.json');
    
    return gulp.src('')
        .pipe(electron({
            src: './src/',
            packageJson: packageJson,
            release: './dist',
            cache: './cache',
            version: 'v0.36.2',
            packaging: true,
            asar: true,
            platforms: [
                'win32-ia32',
                'darwin-x64',
                'linux-ia32'
            ],
            platformResources: {
                darwin: {
                    CFBundleDisplayName: packageJson.name,
                    CFBundleIdentifier: packageJson.name,
                    CFBundleName: packageJson.name,
                    CFBundleVersion: packageJson.version
                },
                win: {
                    'version-string': packageJson.version,
                    'file-version': packageJson.version,
                    'product-version': packageJson.version
                }
            }
        }))
        .pipe(gulp.dest(''));
});
