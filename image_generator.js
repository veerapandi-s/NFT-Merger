const { uploadFile } = require('./upload');
const { saveJSON, getProperties, getLocalDir, mergeImageAndSave } = require('./helper/util');



const prepareImageData = async (urls, name, description) => {
    // Downloads the NFT Pieces locally and provides a array of location
    const layersData = await getLocalDir(name, urls);
    // Layers for processing with sharp
    const layers = layersData.map(file => ({ input: file }));
    // Getting meta data from the file directory
    const metaData = getProperties(layers, name, description);
    // Storing the JSON
    const fileDirJson = `meta_data/${name}`;
    const fileNameJson = `${name}.json`;
    // Storing the JSON
    saveJSON(metaData, fileDirJson, `${fileNameJson}`);
    const fileDirImage = `processed_image`;
    const fileNameImage = `${name}.png`
    // Merging pieces into Single NFT
    const filePath = await mergeImageAndSave(layers, fileDirImage, `${fileNameImage}`);
    return {
        filePath,
        metaData
    }
}

// TODO Create API
const apiFunction = async (name, description, urls) => {
    const { filePath, metaData } = await prepareImageData(urls, name, description);
    const cloud_url = await uploadFile(filePath, filePath)
    return {
        status: true,
        result: {
            url: cloud_url,
            metaData: metaData
        }
    }
}


module.exports = {
    apiFunction
}