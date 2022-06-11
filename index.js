
import sharp from 'sharp';
import fs from 'fs';


const name = "Test Collection";
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

import { createWriteStream } from 'fs';
import { get } from 'https';

export function downloadImage(url, filepath) {
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

let localDir = [];

let imagePromise = [];

for (let index = 0; index < urls.length; index++) {
    const element = urls[index];
    const elementSplit = element.split("/");
    const layerName = elementSplit[elementSplit.length - 2];
    const fileName = elementSplit[elementSplit.length - 1]

    let dir = `raw_image/${name}/layers/${layerName}`;
    let filePath = `${dir}/${fileName}`;
    if (fs.existsSync(filePath)) {
        console.log("exist");
    } else {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        console.log("Not Exist");
        let promise = downloadImage(element, filePath)
        imagePromise.push(promise);
    }
    localDir.push(filePath)
}
Promise.all(imagePromise).then(console.log("All Images have been downloaded")).catch("Error in image")
const layers = [
    './layers/layer_1_skin/Cricket_Player_Badger.png',
    './layers/layer_2_wepaon/Cricket_Player_Badger.png',
    './layers/layer_3_pant/Cricket_Player_Badger.png',
    './layers/layer_4_shirt/Cricket_Player_Badger.png',
    './layers/layer_5_head_piece/Cricket_Player_Badger.png',
    './layers/layer_6_gloves/Cricket_Player_Badger_Thanos.png',
    './layers/layer_7_base/Cricket_Player_Badger.png',
    './layers/layer_8_boot/Cricket_Player_Badger.png'
].map(file => ({ input: file }));


const generateImage = async () => {
    try {
        await sharp(layers[0].input).composite(layers).toFile('final.png');
        console.log("Image Generated");
    } catch (error) {
        console.error("Error in generation", error)
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const getProperties = (layers_data, index, name, description) => {
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
        console.log(`Index is ${index} / ${layers_data.length}`);
        console.log(`propertyName is : ${name}`);
        console.log(`propertyValue : ${value}`);
    }

    console.log(`Property is `, property);

    // Directory Name For Stroring MetaData
    let dir = `${name}/metadata`;


    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    let obj = {
        name,
        description,
        attributes: property
    }
    let json = JSON.stringify(obj);

    fs.writeFile(`./${name}/${index}.json`, json, 'utf8', (err) => {
        console.log(err);
    });

}
// getProperties(layers, 1, "Test Collection", "This is a test description");
// generateImage();

