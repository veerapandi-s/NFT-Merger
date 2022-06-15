const archiver = require('archiver');
const fs = require('fs');

/**
 * @param {String} sourceDir: /some/folder/to/compress
 * @param {String} outPath: /path/to/created.zip
 * @returns {Promise}
 */
function zipDirectory(sourceDir, outPath) {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = fs.createWriteStream(outPath);

    return new Promise((resolve, reject) => {
        archive
            .directory(sourceDir, false)
            .on('error', err => reject(err))
            .pipe(stream)
            ;

        stream.on('close', () => resolve({outPath}));
        archive.finalize();
    });
}

/**
 * @param {[String]} sourceDir: [/some/folder/to/compress]
 * @param {String} outPath: /path/to/created.zip
 * @returns {Promise}
 */
function zipDirectories(sourceDirs, outPath) {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = fs.createWriteStream(outPath);

    return new Promise((resolve, reject) => {
        var result = archive;
        sourceDirs.forEach(sourceDir => {
            result = result.directory(sourceDir, false);
        });
        result
            .on('error', err => reject(err))
            .pipe(stream)
            ;

        stream.on('close', () => resolve({outPath}));
        archive.finalize();
    });
}

module.exports = {
    zipDirectory,
    zipDirectories
}