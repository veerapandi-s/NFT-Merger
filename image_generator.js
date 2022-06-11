import sharp from 'sharp';
import fs from 'fs';
import { createWriteStream } from 'fs';
import { get } from 'https';


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
            continue
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
    } catch (error) {
        console.error("Error in generation", error)
    }
}


const prepareImageData = async (urls, name, description) => {
    const layersData = await localURL(name, urls);
    const layers = layersData.map(file => ({ input: file }));
    const metaData = getProperties(layers, name, description);
    saveJSON(metaData, name, name);
    generateImage(layers, name, `${name}.png`)
}

const apiFunction = () => {
    // Collection Name
    const name = "Test Collection";
    // Collection Description
    const description = "This is a dummy description";
    // Layer URL
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

    prepareImageData(urls, name, description);
}
// apiFunction();


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