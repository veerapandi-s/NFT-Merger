const { pickWeighted } = require("./weighted_random");
const { saveJSON, getProperties, mergeImageAndSave } = require('./helper/util');




const randomImageFunction = async (noOfNFT,collectionName,description,layers,choice) => {

    let finalLayer = []
    
    for (let index = 0; index < noOfNFT; index++) {
        let process_layer = [];
        for (let layerIndex = 0; layerIndex < layers.length; layerIndex++) {
            const layerWeight = choice[layerIndex];
            const layersOption = layers[layerIndex];
            process_layer.push(pickWeighted(layersOption, layerWeight));
        }
        finalLayer.push(process_layer)
    }

    for (let index = 0; index < finalLayer.length; index++) {
        let element = finalLayer[index];
        element = element.map(file => ({ input: file }));
        const fileDirImage = `processed_image`;
        const fileNameImage = `${index}.png`
        mergeImageAndSave(element, fileDirImage, `${fileNameImage}`);
        // Getting meta data from the file directory
        const metaData = getProperties(element, index, description);
        const fileDirJson = `meta_data/${collectionName}`;
        const fileNameJson = `${index}.json`;
        // Storing the JSON
        saveJSON(metaData, fileDirJson, `${fileNameJson}`);
    }
}


module.exports = {
    randomImageFunction
}