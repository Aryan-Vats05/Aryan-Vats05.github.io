let data;
let lengths;
let species;
let speciesKeys;
let jitterValues = [];

function preload() {
    data = loadTable('fish.csv', 'csv', 'header');
}

function setup() {
    let canvas = createCanvas(900, 700);
    canvas.parent('chart');
    background(210);

    // Load columns
    let rawLen  = data.getColumn('Length1');
    let rawSpec = data.getColumn('Species');

    // Filter out bad rows
    lengths = [];
    species = [];
    for (let i = 0; i < rawLen.length; i++) {
        let v = parseFloat(rawLen[i]);
        if (!isNaN(v) && v > 0) {
            lengths.push(v);
            species.push(rawSpec[i]);
        }
    }

    // Get unique species names (in order of appearance)
    speciesKeys = [];
    for (let i = 0; i < species.length; i++) {
        if (!speciesKeys.includes(species[i])) {
            speciesKeys.push(species[i]);
        }
    }

    textSize(14);
    textAlign(CENTER, CENTER);

    // Store jitter values once so dots don't move every frame
    for (let i = 0; i < lengths.length; i++) {
        jitterValues.push(random(-20, 20));
    }

}

function draw() {
    background(210);

    // Axes
    stroke(0);
    strokeWeight(1);
    line(35, 50, 35, height - 70);                   // y-axis
    line(35, height - 70, width - 50, height - 70);  // x-axis

    // Axis labels
    noStroke();
    fill(0);
    text('Length1 (cm)', 30, 40);
    text('Species',      width / 2, height - 76);
    text('Strip Chart – Fish Body Length', width / 2, 25);

    // Y-axis ticks and faint grid lines
    for (let i = 10; i <= 70; i += 10) {
        let y = map(i, 0, 75, height - 70, 50);

        fill(0);
        noStroke();
        text(i, 20, y);

        stroke(155);
        strokeWeight(1);
        line(35, y, width - 50, y);
    }

    // X spacing — one column per species
    let numGroups   = speciesKeys.length;
    let groupWidth  = (width - 85) / numGroups;

    // Draw x-axis species labels
    for (let i = 0; i < numGroups; i++) {
        let centerX = 35 + groupWidth * i + groupWidth / 2;
        noStroke();
        fill(0);
        textAlign(CENTER, CENTER);
        text(speciesKeys[i], centerX, height - 50);
    }

    // Draw dots with jitter
    let tooltipSpecies = '';
    let tooltipValue   = 0;
    let tooltipX       = 0;
    let tooltipY       = 0;
    let showTooltip    = false;

    for (let i = 0; i < lengths.length; i++) {
        let sp  = species[i];
        let val = lengths[i];

        let groupIndex = speciesKeys.indexOf(sp);
        let centerX = 35 + groupWidth * groupIndex + groupWidth / 2;
        let centerY = map(val, 0, 75, height - 70, 50);

        // Jitter: stored in setup so dots stay still every frame
        let jitter = jitterValues[i];

        // Check if mouse is near this dot
        if (dist(mouseX, mouseY, centerX + jitter, centerY) < 6) {
            // Save tooltip info for later, draw on top after all dots
            tooltipSpecies = sp;
            tooltipValue   = val;
            tooltipX       = centerX + jitter;
            tooltipY       = centerY;
            showTooltip    = true;

            fill(173, 216, 230);
            stroke(0);
            strokeWeight(0.5);
            ellipse(centerX + jitter, centerY, 9, 9);
        } else {
            fill(173, 216, 230);
            stroke(0);
            strokeWeight(0.5);
            ellipse(centerX + jitter, centerY, 9, 9);
        }
    }

    // Draw tooltip last so it appears on top of all dots
    if (showTooltip) {
        fill(253, 170, 72);
        noStroke();
        rect(mouseX - 40, mouseY - 55, 150, 25);
        fill(0);
        textAlign(CENTER, CENTER);
        text(tooltipSpecies + ': ' + tooltipValue.toFixed(1) + ' cm', mouseX + 35, mouseY - 42);
    }
}