const { deleteAllData } = require("./helper/util");
const { apiFunction } = require("./image_generator");
const { randomImageFunction } = require("./random_image_generator");


const callSingleImageGenerate = () => {
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
    apiFunction(name, description, urls);
}



const callRandomImageFunction = () => {
    // Number of NFT to generate
    const noOfNFT = 5;

    // Collection Name
    const collectionName = "Test";
    const description = "This is a dummy description";
    // Layers location Local
    // const layers = [
    //     layer1 = [
    //         'layers/layer_1_skin/Cricket_Player_Badger.png',
    //         'layers/layer_1_skin/Pirate_Badger_black.png',
    //         'layers/layer_1_skin/Pirate_Badger_gold.png',
    //         'layers/layer_1_skin/Pirate_Badger_grey.png',
    //         'layers/layer_1_skin/Pirate_Badger_white.png',
    //         'layers/layer_1_skin/Thanos.png'
    //     ],
    //     layer2 = [
    //         'layers/layer_2_wepaon/Cricket_Player_Badger.png',
    //         'layers/layer_2_wepaon/Game_Of_Thrones_Badger.png',
    //         'layers/layer_2_wepaon/Harry-potter.png',
    //         'layers/layer_2_wepaon/Pirate_Badger_black.png',
    //         'layers/layer_2_wepaon/Pirate-Badger_white.png',
    //         'layers/layer_2_wepaon/Thanos.png'
    //     ],
    //     layer3 = [
    //         'layers/layer_3_pant/Cricket_Player_Badger.png',
    //         'layers/layer_3_pant/Game_Of_Thrones_Badger.png',
    //         'layers/layer_3_pant/Harry-potter.png',
    //         'layers/layer_3_pant/Pirate_Badger.png',
    //         'layers/layer_3_pant/Thanos.png'
    //     ],
    //     layer4 = [
    //         'layers/layer_4_shirt/Cricket_Player_Badger.png',
    //         'layers/layer_4_shirt/Game_Of_Thrones_Badger.png',
    //         'layers/layer_4_shirt/Harry-potter.png',
    //         'layers/layer_4_shirt/Pirate_Badger.png',
    //         'layers/layer_4_shirt/Thanos.png'
    //     ],
    //     layer5 = [
    //         'layers/layer_5_head_piece/Cricket_Player_Badger.png',
    //         'layers/layer_5_head_piece/Game_Of_Thrones_Badger.png',
    //         'layers/layer_5_head_piece/Harry-potter.png',
    //         'layers/layer_5_head_piece/Ninja .png',
    //         'layers/layer_5_head_piece/Pirate_Badger.png',
    //         'layers/layer_5_head_piece/Thanos.png'
    //     ],
    //     layer6 = [
    //         'layers/layer_6_gloves/Cricket_Player_Badger_Thanos.png',
    //         'layers/layer_6_gloves/Cricket_Player_Badger_white.png',
    //         'layers/layer_6_gloves/Game_Of_Thrones_Badger.png',
    //         'layers/layer_6_gloves/Harry-potter.png',
    //         'layers/layer_6_gloves/Pirate_Badger_zombie.png',
    //         'layers/layer_6_gloves/Pirate-Badger_galactic.png'
    //     ],
    //     layer7 = [
    //         'layers/layer_7_base/Cricket_Player_Badger.png'
    //     ],
    //     layer8 = [
    //         'layers/layer_8_boot/Cricket_Player_Badger.png',
    //         'layers/layer_8_boot/Game_Of_Thrones_Badger.png',
    //         'layers/layer_8_boot/Harry-potter.png',
    //         'layers/layer_8_boot/Pirate_Badger.png',
    //         'layers/layer_8_boot/Pirate-Badger.png',
    //         'layers/layer_8_boot/Thanos.png'
    //     ],
    // ]

    // Layers in URL
    const layers = [
        layer1 = [
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_1_skin/Cricket_Player_Badger.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_1_skin/Pirate_Badger_black.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_1_skin/Pirate_Badger_gold.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_1_skin/Pirate_Badger_grey.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_1_skin/Pirate_Badger_white.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_1_skin/Thanos.png'
        ],
        layer2 = [
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_2_wepaon/Cricket_Player_Badger.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_2_wepaon/Game_Of_Thrones_Badger.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_2_wepaon/Harry-potter.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_2_wepaon/Pirate_Badger_black.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_2_wepaon/Pirate-Badger_white.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_2_wepaon/Thanos.png'
        ],
        layer3 = [
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_3_pant/Cricket_Player_Badger.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_3_pant/Game_Of_Thrones_Badger.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_3_pant/Harry-potter.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_3_pant/Pirate_Badger.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_3_pant/Thanos.png'
        ],
        layer4 = [
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_4_shirt/Cricket_Player_Badger.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_4_shirt/Game_Of_Thrones_Badger.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_4_shirt/Harry-potter.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_4_shirt/Pirate_Badger.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_4_shirt/Thanos.png'
        ],
        layer5 = [
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_5_head_piece/Cricket_Player_Badger.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_5_head_piece/Game_Of_Thrones_Badger.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_5_head_piece/Harry-potter.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_5_head_piece/Ninja .png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_5_head_piece/Pirate_Badger.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_5_head_piece/Thanos.png'
        ],
        layer6 = [
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_6_gloves/Cricket_Player_Badger_Thanos.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_6_gloves/Cricket_Player_Badger_white.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_6_gloves/Game_Of_Thrones_Badger.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_6_gloves/Harry-potter.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_6_gloves/Pirate_Badger_zombie.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_6_gloves/Pirate-Badger_galactic.png'
        ],
        layer7 = [
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_7_base/Cricket_Player_Badger.png'
        ],
        layer8 = [
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_8_boot/Cricket_Player_Badger.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_8_boot/Game_Of_Thrones_Badger.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_8_boot/Harry-potter.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_8_boot/Pirate_Badger.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_8_boot/Pirate-Badger.png',
            'https://storage.googleapis.com/rage-infinetnft.appspot.com/layers/layer_8_boot/Thanos.png'
        ],
    ]
    // Weightage for layers
    const choice = [
        layer1 = [1, 2, 3, 2, 1, 1],
        layer2 = [1, 2, 3, 2, 1, 1],
        layer3 = [1, 2, 3, 1, 1],
        layer4 = [1, 2, 3, 1, 1],
        layer5 = [1, 2, 3, 2, 1, 1],
        layer6 = [1, 2, 3, 2, 1, 1],
        layer7 = [1],
        layer8 = [1, 2, 3, 2, 1, 1]
    ]

    randomImageFunction(noOfNFT, collectionName, description, layers, choice)
}


// callRandomImageFunction();

// callSingleImageGenerate();
// deleteAllData();