import gulp from 'gulp';
const { src, dest, series, watch, parallel, symlink } = gulp;

import browserSync from 'browser-sync';
import fs from 'fs';
import path from 'path';
import gulpIf from 'gulp-if';
import data from 'gulp-data';
import gulpSass from 'gulp-sass';
import * as sass from 'sass';
const sassCompiler = gulpSass(sass);
import sourcemaps from 'gulp-sourcemaps';
import gulpPug from 'gulp-pug';
import { deleteAsync } from 'del';
import plumber from 'gulp-plumber';

const ROOT = './src';
const DIST = './dist';

const PATH = {
    HTML: `${ROOT}/html`,
    PUG: `${ROOT}/pug`,
    CSS: `${ROOT}/css`,
    SCSS: `${ROOT}/scss`,
    JS: `${ROOT}/js`,
    FONT: `${ROOT}/font`,
    IMG: `${ROOT}/img`,
};

// scss options
const scssOptions = {
    outputStyle: 'expanded',
    indentType: 'space',
    indentWidth: 2,
    sourceComments: true,
};

// Sass 컴파일
export function compileSass() {
    return src(`${PATH.SCSS}/**/*.scss`)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sassCompiler.sync(scssOptions).on('error', sassCompiler.logError))
        .pipe(sourcemaps.write('./map'))
        .pipe(gulp.dest(PATH.CSS))
        .pipe(browserSync.reload({ stream: true }));
}

// Pug 컴파일
export function pugTask() {
    return src(`${PATH.PUG}/*.pug`)
        .pipe(plumber())
        .pipe(
            data((file) => {
                const filename = path.basename(file.path, '.pug'); // 파일 이름 추출
                return { filename }; // 단순히 파일명만 전달
            }),
        )
        .pipe(gulpPug({ pretty: true })) // Pug 파일을 HTML로 변환
        .pipe(dest(PATH.HTML)) // 변환된 HTML을 HTML 폴더에 저장
        .pipe(browserSync.reload({ stream: true }));
}

// 서버 실행
export function server(done) {
    browserSync.init({
        server: {
            baseDir: './src', // 프로젝트의 루트 폴더
        },
        startPath: '/html/guide_inputfield.html',
    });
    done();
}

// html, css clean
export function clean(done) {
    const delFiles = [`${PATH.HTML}/**`, `${PATH.CSS}/**`];
    deleteAsync(delFiles).then(() => {
        done();
    });
}

// dist 폴더 clean
export function distClean(done) {
    const delFiles = [`${DIST}/**`];
    deleteAsync(delFiles).then(() => {
        done();
    });
}

export function reload(done) {
    browserSync.reload();
    done();
}

// dist build
export function fontBuild() {
    return src(`${PATH.FONT}/*`).pipe(dest(`${DIST}/font`));
}

export function imgBuild() {
    return src(`${PATH.IMG}/**/*`).pipe(dest(`${DIST}/img`));
}

export function htmlBuild() {
    return src(`${PATH.HTML}/*.html`).pipe(dest(`${DIST}/html`));
}

export function rootFiles() {
    return src([`${ROOT}/index.html`, `${ROOT}/w_board.json`]).pipe(
        dest(`${DIST}`),
    );
}

export function cssBuild() {
    return src(`${PATH.CSS}/*.css`).pipe(dest(`${DIST}/css`));
}

export function jsBuild() {
    return src(`${PATH.JS}/**`).pipe(dest(`${DIST}/js`));
}

// watching
export function watching() {
    watch([`${PATH.PUG}/**`], pugTask);
    watch(`${PATH.SCSS}/**`, compileSass);
    watch(`${PATH.JS}/**`, reload);
}

export const dev = series(
    clean,
    pugTask,
    compileSass,
    server,
    parallel(watching),
); // 작업용
export const build = series(
    distClean,
    fontBuild,
    imgBuild,
    htmlBuild,
    rootFiles,
    cssBuild,
    jsBuild,
); // 빌드용
