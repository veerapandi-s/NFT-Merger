const { get } = require('https');
const { createWriteStream } = require('fs');
const fs = require('fs');
const sharp = require('sharp');

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// For Downloading and storing in the local directory 
function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            } else {
                // Consume response data to free up memory
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
            }
        });
    });
}

// Deletes Meta Data
const deleteMetaData = () => {
    let dir = "./meta_data";
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
    }
}

// Deletes Generated Image
const deleteProcessed_image = () => {
    let dir = "./processed_image";
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
    }
}

// Deletes Raw Image
const deleteRaw_image = () => {
    let dir = "./raw_image";
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
    }
}

// Deletes Raw Image, Meta Data, Generated Image
const deleteAllData = () => {
    deleteMetaData();
    deleteProcessed_image();
    deleteRaw_image();
}

// Saves Meta Data
const saveJSON = async (obj, fileDir, fileName) => {
    if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
    }
    const filePath = `${fileDir}/${fileName}`;
    let json = JSON.stringify(obj);
    fs.writeFile(filePath, json, 'utf8', (err) => {
        console.error(err);
    });
    return filePath;
}

const getProperties = (layers_data, name, description) => {
    let property = [];
    for (let index = 0; index < layers_data.length; index++) {
        const element = layers_data[index];
        const elementString = element['input']
        let fileName = elementString.split('layers/')[1];
        let propertySring = fileName.split('/')[0];
        let propertyValueString = fileName.split('/')[1]
        let propertyName = propertySring.split('_')[2];
        let propertyValue = propertyValueString.split('.')[0];
        let name = capitalizeFirstLetter(propertyName)
        let value = capitalizeFirstLetter(propertyValue.replace(/_/g, " "));
        property.push({
            "trait_type": name,
            "value": value
        })
    }

    let obj = {
        name,
        description,
        attributes: property
    }
    return obj;
}

const mergeImageAndSave = async (layers, fileDir, fileName) => {
    try {
        if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir, { recursive: true });
        }
        const filePath = `${fileDir}/${fileName}`;
        await sharp(layers[0].input).composite(layers).toFile(filePath);
        return filePath;
    } catch (error) {
        console.error("Error in generation", error)
    }
}

const getLocalDir = async (name, urls) => {
    let imagePromise = [];
    let localDir = [];
    for (let index = 0; index < urls.length; index++) {
        const element = urls[index];
        const elementSplit = element.split("/");
        const layerName = elementSplit[elementSplit.length - 2];
        const fileName = elementSplit[elementSplit.length - 1]

        let dir = `assets/${name}/raw_image/layers/${layerName}`;
        let filePath = `${dir}/${fileName}`;
        if (fs.existsSync(filePath)) {

        } else {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            let promise = downloadImage(element, filePath)
            imagePromise.push(promise);
        }
        localDir.push(filePath)
    }
    try {
        await Promise.all(imagePromise)
        return localDir;
    } catch (error) {
        console.error("Error", error);
        return Promise.reject({ message: "Error in getting image", rawError: error })
    }

}

const getLocalDirRandom = async (collectionName, layers) => {
    const newLayers = [];
    for (let index = 0; index < layers.length; index++) {
        const urls = layers[index];
        try {
            // Downloads the NFT Pieces locally and provides a array of location
            const layersData = await getLocalDir(collectionName, urls);
            newLayers.push(layersData);
        } catch (error) {
            console.log("Error", error);
        }
    }
    return newLayers;
}


module.exports = {
    capitalizeFirstLetter,
    downloadImage,
    deleteAllData,
    deleteMetaData,
    deleteProcessed_image,
    deleteRaw_image,
    saveJSON,
    getProperties,
    mergeImageAndSave,
    getLocalDir,
    getLocalDirRandom
}