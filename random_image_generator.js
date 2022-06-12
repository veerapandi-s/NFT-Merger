const sharp = require('sharp');
const fs = require('fs');
const { pickWeighted } = require("./weighted_random");


const layers = [
    layer1 = [
        'layers/layer_1_skin/Cricket_Player_Badger.png',
        'layers/layer_1_skin/Pirate_Badger_black.png',
        'layers/layer_1_skin/Pirate_Badger_gold.png',
        'layers/layer_1_skin/Pirate_Badger_grey.png',
        'layers/layer_1_skin/Pirate_Badger_white.png',
        'layers/layer_1_skin/Thanos.png'
    ],
    layer2 = [
        'layers/layer_2_wepaon/Cricket_Player_Badger.png',
        'layers/layer_2_wepaon/Game_Of_Thrones_Badger.png',
        'layers/layer_2_wepaon/Harry-potter.png',
        'layers/layer_2_wepaon/Pirate_Badger_black.png',
        'layers/layer_2_wepaon/Pirate-Badger_white.png',
        'layers/layer_2_wepaon/Thanos.png'
    ],
    layer3 = [
        'layers/layer_3_pant/Cricket_Player_Badger.png',
        'layers/layer_3_pant/Game_Of_Thrones_Badger.png',
        'layers/layer_3_pant/Harry-potter.png',
        'layers/layer_3_pant/Pirate_Badger.png',
        'layers/layer_3_pant/Thanos.png'
    ],
    layer4 = [
        'layers/layer_4_shirt/Cricket_Player_Badger.png',
        'layers/layer_4_shirt/Game_Of_Thrones_Badger.png',
        'layers/layer_4_shirt/Harry-potter.png',
        'layers/layer_4_shirt/Pirate_Badger.png',
        'layers/layer_4_shirt/Thanos.png'
    ],
    layer5 = [
        'layers/layer_5_head_piece/Cricket_Player_Badger.png',
        'layers/layer_5_head_piece/Game_Of_Thrones_Badger.png',
        'layers/layer_5_head_piece/Harry-potter.png',
        'layers/layer_5_head_piece/Ninja .png',
        'layers/layer_5_head_piece/Pirate_Badger.png',
        'layers/layer_5_head_piece/Thanos.png'
    ],
    layer6 = [
        'layers/layer_6_gloves/Cricket_Player_Badger_Thanos.png',
        'layers/layer_6_gloves/Cricket_Player_Badger_white.png',
        'layers/layer_6_gloves/Game_Of_Thrones_Badger.png',
        'layers/layer_6_gloves/Harry-potter.png',
        'layers/layer_6_gloves/Pirate_Badger_zombie.png',
        'layers/layer_6_gloves/Pirate-Badger_galactic.png'
    ],
    layer7 = [
        'layers/layer_7_base/Cricket_Player_Badger.png'
    ],
    layer8 = [
        'layers/layer_8_boot/Cricket_Player_Badger.png',
        'layers/layer_8_boot/Game_Of_Thrones_Badger.png',
        'layers/layer_8_boot/Harry-potter.png',
        'layers/layer_8_boot/Pirate_Badger.png',
        'layers/layer_8_boot/Pirate-Badger.png',
        'layers/layer_8_boot/Thanos.png'
    ],
]

const choice = [
    layer1 = [1,2,3,2,1,1],
    layer2 = [1,2,3,2,1,1],
    layer3 = [1,2,3,1,1],
    layer4 = [1,2,3,1,1],
    layer5 = [1,2,3,2,1,1],
    layer6 = [1,2,3,2,1,1],
    layer7 = [1],
    layer8 = [1,2,3,2,1,1]
]
let finalLayer = []
for (let index = 0; index < 100; index++) {
    let process_layer = [];
    for (let layerIndex = 0; layerIndex < layers.length; layerIndex++) {
        const layerWeight = choice[layerIndex];
        const layersOption = layers[layerIndex];
        process_layer.push(pickWeighted(layersOption,layerWeight));
    }
    finalLayer.push(process_layer)
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const getProperties = (layers_data, name, description) => {
    let property = [];
    layers_data = layers_data.map(file => ({ input: file }));
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

const saveJSON = async (obj, name, fileName) => {
    // Directory Name For Stroring MetaData
    const dir = `meta_data`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    const filePath = `${dir}/${fileName}.json`;
    let json = JSON.stringify(obj);
    fs.writeFile(filePath, json, 'utf8', (err) => {
        console.error(err);
    });
}

const generateImage = async (layers, name, fileName) => {
    try {
        // Directory Name For Stroring NFT
        const dir = `processed_image`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const filePath = `${dir}/${fileName}`;
        layers = layers.map(file => ({ input: file }));
        await sharp(layers[0].input).composite(layers).toFile(filePath);
        return filePath;
    } catch (error) {
        console.error("Error in generation", error)
    }
}
for (let index = 0; index < finalLayer.length; index++) {
    const description = "This is a dummy description";

    const element = finalLayer[index];
    generateImage(element,index,`${index}.png`);
    // Getting meta data from the file directory
    const metaData = getProperties(element, index, description);
    // Storing the JSON
    saveJSON(metaData, index, `${index}`);
}