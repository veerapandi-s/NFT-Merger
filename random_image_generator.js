const { pickWeighted } = require("./weighted_random");
const { saveJSON, getProperties, mergeImageAndSave, getLocalDir, getLocalDirRandom } = require('./helper/util');
const { uploadFile } = require("./upload");




const createCollectionNFT = async (req, res) => {

    const { noOfNFT, collectionName, description, urls, choice } = req.body;

    let finalLayer = []
    let layers = await getLocalDirRandom(collectionName, urls);
    for (let index = 0; index < noOfNFT; index++) {
        let process_layer = [];
        for (let layerIndex = 0; layerIndex < layers.length; layerIndex++) {
            const layerWeight = choice[layerIndex];
            const layersOption = layers[layerIndex];
            process_layer.push(pickWeighted(layersOption, layerWeight));
        }
        finalLayer.push(process_layer)
    }
    const nftLinks = [];
    const jsonData = [];
    for (let index = 0; index < finalLayer.length; index++) {
        let element = finalLayer[index];
        element = element.map(file => ({ input: file }));
        const fileDirImage = `assets/${collectionName}/processed_image/`;
        const fileNameImage = `${index}.png`
        const localNFTPath = await mergeImageAndSave(element, fileDirImage, `${fileNameImage}`);
        const cloud_url = await uploadFile(localNFTPath, localNFTPath);
        // Getting meta data from the file directory
        const metaData = getProperties(element, index, description);
        nftLinks.push(cloud_url);
        jsonData.push({ image: cloud_url, ...metaData })
        const fileDirJson = `assets/${collectionName}/meta_data/`;
        const fileNameJson = `${index}.json`;
        // Storing the JSON
        saveJSON(metaData, fileDirJson, `${fileNameJson}`);
    }

    return res.status(200).send({
        status : true,
        result: {
            nfts: nftLinks,
            metaData: jsonData
        }

    })
}


module.exports = {
    createCollectionNFT
}