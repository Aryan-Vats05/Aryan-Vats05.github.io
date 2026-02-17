let data;
let weights;

let q1, median, q3;
let lowerBound, upperBound;
let outliers = [];

function preload() {
    data = loadTable('fish.csv', 'csv', 'header');
}

function setup() {
    let canvas = createCanvas(900, 700);
    canvas.parent('chart');
    background(210);

    // Load Weight column, skip blanks/zeros
    let raw = data.getColumn('Weight');
    weights = [];
    for (let i = 0; i < raw.length; i++) {
        let v = parseFloat(raw[i]);
        if (!isNaN(v) && v > 0) {
            weights.push(v);
        }
    }

    // Sort so quantile math works
    weights.sort((a, b) => a - b);

    // Compute box plot stats
    q1     = quantile(weights, 0.25);
    median = quantile(weights, 0.50);
    q3     = quantile(weights, 0.75);

    let iqr    = q3 - q1;
    lowerBound = q1 - 1.5 * iqr;
    upperBound = q3 + 1.5 * iqr;

    // Collect outliers
    for (let i = 0; i < weights.length; i++) {
        if (weights[i] < lowerBound || weights[i] > upperBound) {
            outliers.push(weights[i]);
        }
    }

    textSize(14);
    textAlign(CENTER, CENTER);
}

function draw() {
    background(210);

    // Axes
    stroke(0);
    strokeWeight(1);
    line(80, 50, 80, height - 70);                    // y-axis
    line(80, height - 70, width - 50, height - 70);   // x-axis

    // Axis labels
    noStroke();
    fill(0);
    text('Weight (g)', 35, 40);
    text('Weight Distribution', width / 2, 25);

    // Y-axis ticks and faint grid lines
    for (let i = 200; i <= 1800; i += 200) {
        let y = map(i, 0, 1900, height - 70, 50);

        fill(0);
        noStroke();
        text(i, 45, y);

        stroke(155);
        strokeWeight(1);
        line(80, y, width - 50, y);
    }

    // Box centred on canvas
    let centerX = width / 2;
    let boxWidth = 100;

    // Map stats to y pixel positions
    let yQuartile1 = map(q1,     0, 1900, height - 70, 50);
    let yQuartile3 = map(q3,     0, 1900, height - 70, 50);
    let yMedian    = map(median, 0, 1900, height - 70, 50);

    // Min and max are the closest values to the bounds that are not outliers
    let minWeight = weights.find(v => v >= lowerBound);
    let maxWeight = [...weights].reverse().find(v => v <= upperBound);
    let yMinWeight = map(minWeight, 0, 1900, height - 70, 50);
    let yMaxWeight = map(maxWeight, 0, 1900, height - 70, 50);

    // Lines from min to Q1 and from Q3 to max
    stroke(0);
    strokeWeight(1.5);
    line(centerX, yMinWeight, centerX, yQuartile1);
    line(centerX, yQuartile3, centerX, yMaxWeight);

    // Caps at min and max
    line(centerX - 20, yMinWeight, centerX + 20, yMinWeight);
    line(centerX - 20, yMaxWeight, centerX + 20, yMaxWeight);

    // IQR box
    fill(173, 216, 230);
    stroke(0);
    strokeWeight(1.5);
    rect(centerX - boxWidth / 2, yQuartile3, boxWidth, yQuartile1 - yQuartile3);

    // Median line (red)
    stroke(200, 60, 60);
    strokeWeight(3);
    line(centerX - boxWidth / 2, yMedian, centerX + boxWidth / 2, yMedian);

    // Outlier dots
    for (let i = 0; i < outliers.length; i++) {
        let yOutlier = map(outliers[i], 0, 1900, height - 70, 50);
        fill(255, 80, 60);
        stroke(0);
        strokeWeight(1);
        ellipse(centerX, yOutlier, 10, 10);
    }

   
    noStroke();
    fill(0);
    textAlign(LEFT, CENTER);
    textSize(13);
    text('Max: '    + maxWeight.toFixed(1) + ' g', centerX + boxWidth / 2 + 12, yMaxWeight);
    text('Q3: '     + q3.toFixed(1) + ' g',        centerX + boxWidth / 2 + 12, yQuartile3);
    text('Median: ' + median.toFixed(1) + ' g',    centerX + boxWidth / 2 + 12, yMedian);
    text('Q1: '     + q1.toFixed(1) + ' g',        centerX + boxWidth / 2 + 12, yQuartile1);
    text('Min: '    + minWeight.toFixed(1) + ' g', centerX + boxWidth / 2 + 12, yMinWeight);


    if (mouseX > centerX - boxWidth / 2 && mouseX < centerX + boxWidth / 2 &&
        mouseY > yQuartile3 && mouseY < yQuartile1) {
        fill(253, 170, 72);
        rect(mouseX - 40, mouseY - 20, 140, 25);
        fill(0);
        textAlign(CENTER, CENTER);
        text('IQR: ' + q1.toFixed(1) + '–' + q3.toFixed(1) + ' g', mouseX + 30, mouseY - 7);
    }


    for (let i = 0; i < outliers.length; i++) {
        let yOutlier = map(outliers[i], 0, 1900, height - 70, 50);
        if (dist(mouseX, mouseY, centerX, yOutlier) < 8) {
            fill(253, 170, 72);
            rect(mouseX - 40, mouseY - 20, 140, 25);
            fill(0);
            textAlign(CENTER, CENTER);
            text('Outlier: ' + outliers[i].toFixed(1) + ' g', mouseX + 30, mouseY - 7);
        }
    }
}

function quantile(sorted, p) {
    let idx = p * (sorted.length - 1);
    let lo  = Math.floor(idx);
    let hi  = Math.ceil(idx);
    if (lo === hi) return sorted[lo];
    return sorted[lo] + (idx - lo) * (sorted[hi] - sorted[lo]);
}