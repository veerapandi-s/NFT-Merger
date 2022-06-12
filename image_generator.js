const sharp = require('sharp');
const fs = require('fs');
const { get } = require('https');
const { createWriteStream } = require('fs');
const { uploadFile } = require('./upload');


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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const saveJSON = async (obj, name, fileName) => {
    // Directory Name For Stroring MetaData
    const dir = `meta_data/${name}`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    const filePath = `${dir}/${fileName}.json`;
    let json = JSON.stringify(obj);
    fs.writeFile(filePath, json, 'utf8', (err) => {
        console.error(err);
    });
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


const localURL = async (name, urls) => {
    let imagePromise = [];
    let localDir = [];
    for (let index = 0; index < urls.length; index++) {
        const element = urls[index];
        const elementSplit = element.split("/");
        const layerName = elementSplit[elementSplit.length - 2];
        const fileName = elementSplit[elementSplit.length - 1]

        let dir = `raw_image/${name}/layers/${layerName}`;
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

const generateImage = async (layers, name, fileName) => {
    try {
        // Directory Name For Stroring NFT
        const dir = `processed_image/${name}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const filePath = `${dir}/${fileName}`;
        await sharp(layers[0].input).composite(layers).toFile(filePath);
        return filePath;
    } catch (error) {
        console.error("Error in generation", error)
    }
}


const prepareImageData = async (urls, name, description) => {
    // Downloads the NFT Pieces locally and provides a array of location
    const layersData = await localURL(name, urls);
    // Layers for processing with sharp
    const layers = layersData.map(file => ({ input: file }));
    // Getting meta data from the file directory
    const metaData = getProperties(layers, name, description);
    // Storing the JSON
    saveJSON(metaData, name, name);
    // Merging pieces into Single NFT
    const filePath = await generateImage(layers, name, `${name}.png`)

    return {
        filePath,
        metaData
    }

}

// TODO Create API
const apiFunction = async () => {
    // NFT Name
    const name = "Test Collection";
    // NFT Description
    const description = "This is a dummy description";
    // NFT Pieces to be merged in the given order
    const urls = [
        'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_1_skin/Cricket_Player_Badger.png',
        'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_2_wepaon/Cricket_Player_Badger.png',
        'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_3_pant/Cricket_Player_Badger.png',
        'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_4_shirt/Cricket_Player_Badger.png',
        'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_5_head_piece/Cricket_Player_Badger.png',
        'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_6_gloves/Cricket_Player_Badger_Thanos.png',
        'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_7_base/Cricket_Player_Badger.png',
        'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_8_boot/Cricket_Player_Badger.png'
    ];

    const { filePath, metaData } = await prepareImageData(urls, name, description);
    const cloud_url = await uploadFile(filePath, filePath)
    return {
        status : true,
        result : {
            url : cloud_url,
            metaData : metaData
        }
    }
}


const deleteMetaData = () => {
    let dir = "./meta_data";
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
    }
}

const deleteProcessed_image = () => {
    let dir = "./processed_image";
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
    }
}

const deleteRaw_image = () => {
    let dir = "./raw_image";
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
    }
}

const deleteData = () => {
    deleteMetaData();
    deleteProcessed_image();
    deleteRaw_image();
}

deleteData();