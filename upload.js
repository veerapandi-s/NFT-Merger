const { Storage } = require('@google-cloud/storage');

const storage = new Storage({ keyFilename: "./config/key.json" });

const bucketName = 'rage-infinetnft.appspot.com';


async function uploadFile(filePath, destFileName) {
    await storage.bucket(bucketName).upload(filePath, {
        destination: destFileName,
    });
    let url = `https://storage.googleapis.com/rage-infinetnft.appspot.com/${destFileName}`
    return url;
}

module.exports = {
    uploadFile
}