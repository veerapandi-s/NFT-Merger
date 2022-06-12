
const pickWeighted = (array, weights) => {
    let sum = weights.reduce((previouseValue, currentValue) => previouseValue + currentValue, 0);
    const roll = Math.random() * sum;
    for (let index = 0; index < array.length; index++) {
        sum -= weights[index];
        if (roll >= sum) {
            return array[index]
        }        
    }
}

module.exports = {
    pickWeighted
}