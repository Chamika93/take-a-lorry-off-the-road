var boxes = require('./boxes.json');
var orders = require('./orders.json');

const getCorrectBox = (boxes, iVolume) => {
    const sortedBoxes = boxes
        .map(({volume, ...rest}) => {
            const volumeDiff = volume - iVolume;
            if(volumeDiff < 0) {
                return null;
            }
            return {
                volume: volume - iVolume,
                ...rest,
            }
        })
        .filter(Boolean)
        .sort((a, b) => a.volume - b.volume);
    
    return sortedBoxes[0];
};

getLargestBox = (boxes) => {
   const orderedBoxes =  boxes.sort((a, b) => b.volume - a.volume);
   return orderedBoxes[0];
}

// get the boxes with volumes
const boxesWithVolumes = boxes?.map(({dimensions, ...rest}) =>({
    ...rest,
    volume: Object.values(dimensions)?.reduce(
        (total, value ) => total * value,
        1
    )/1000,
}));

// go through the orders
const result = orders?.map(({id, ingredients}) => {
    // get the full volume
    let volume = ingredients?.reduce(
        (total, {volumeCm3} ) => total + volumeCm3,
        0
    );
    const selectedBox = getCorrectBox(boxesWithVolumes, volume);
    return {
        id,
        selectedBox: selectedBox.id,
        co2FootprintKg: selectedBox.co2FootprintKg,
    }
});

const intelligentCarbonFootPrint = result.reduce(
    (total, {co2FootprintKg} ) => total + co2FootprintKg,
        0
)
console.log('Matched boxes', result);
console.log('Intelligent Carbon Foot Print', intelligentCarbonFootPrint);


const largestBox = getLargestBox(boxesWithVolumes);
const carbonFootPrint = largestBox.co2FootprintKg * orders?.length;

console.log('Carbon Foot Print', carbonFootPrint);