let species;
let species_freq;

function preload(){
    data = loadTable('fish.csv', 'csv', 'header');
}

function setup(){
    let canvas = createCanvas(900, 700);
    canvas.parent('chart');
    background(210);

    species = data.getColumn('Species');

    textSize(14);          // uniform text size
    textAlign(CENTER, CENTER);  // center alignment for consistency
}

function draw(){
    background(210);

    // Axes
    stroke(0);
    strokeWeight(1);
    line(35, 70, 35, height - 70);      // y-axis
    line(35, height - 70, width - 85, height - 70);     // x-axis

    // Axis labels
    noStroke();
    fill(0);                     // black text
    text('Count', 30, 60);       // y-axis label
    text('Species', width - 50, height - 76); // x-axis label

    // Count frequencies
    species_freq = {};
    for(let x = 0; x < species.length; x++){
        let key = species[x];
        if(species_freq[key]){
            species_freq[key] += 1;
        } else{
            species_freq[key] = 1;
        }
    }

    // Grid lines and y-axis ticks
    for(let i = 10; i <= 50; i += 10){
        fill(0);                     // keep tick numbers black
        noStroke();
        text(`${i}`, 15, height - 70 - (i * 10.5));

        stroke(155);                  // light gray grid
        strokeWeight(1);
        line(35, height - 70 - (i * 10.5), width - 85, height - 70 - (i * 10.5));
    }

    // Bars and x-axis labels
    let j = -30;     
    for(let species_freq_key in species_freq){
        // Draw x-axis labels
        noStroke();
        fill(0);   // black text
        text(`${species_freq_key}`, j + (780 / 7), height - 50);

        // Draw bars
        stroke(0);
        fill(173, 216, 230);
        rect(j + (455 / 7), height - 70 - (species_freq[species_freq_key] * 10.5),
            110, species_freq[species_freq_key] * 10.5);

        let barWidth = 110;
        let barHeight = species_freq[species_freq_key] * 10.5;

        let barX = j + 455 / 7;
        let barY = height - 70 - barHeight;
            
        if (mouseX > barX && mouseX < barX + barWidth &&    // interactive part
            mouseY > barY && mouseY < barY + barHeight) {
            fill(253, 170, 72);
            rect(mouseX - 40, mouseY - 20, 100, 30);
            fill(0);
            text(`${species_freq_key}: ${species_freq[species_freq_key]}`, mouseX + 10, mouseY - 5);
        }

        j += 780 / 7;
    }
}
