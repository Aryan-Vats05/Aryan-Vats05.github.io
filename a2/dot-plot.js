let year_founded;
let valuation;

function preload(){
    data = loadTable('data.csv', 'csv', 'header');
}

function setup(){
    let canvas = createCanvas(900, 700);
    canvas.parent('chart');
    background(210);
    year_founded = [... new Set(data.getColumn('Year Founded'))];
    console.log(year_founded);

    valuation = data.getColumn('Valuation');
    console.log(valuation);
}

function draw(){
    background(210);
    fill(0);

    //creating and labeling axes
    line(50, 35, 50, height - 70);      //y-axis
    line(50, height - 70, width - 90, height - 70);     //x-axis
    text('Year Founded', 30, 20);
    text('Valuation', width - 80, height - 68);

    let year_arr = [];
    for(let i = 1920; i <= 2020; i += 10){      
        year_arr.push(i);
    }

    let val_arr = [];
    for(let j = 0; j <= 185; j += 15){
        val_arr.push(j);
    }

    for(let y = 1; y <= year_arr.length; y++){
        text(`${year_arr[y - 1]}`, 15, height - 60 - y * 53);       //y-axis labels, seperation is 53 units
    }

    for(let x = 1; x <= val_arr.length; x++){
        text(`$${val_arr[x - 1]}B`, x * 59, height - 50);           //x-axis labels, seperation is 59 units
    }

    fill(75, 156, 211, 200);
    for(let i = 0; i < data.getRowCount(); i++){        //the main circle part
        let raw = data.getString(i, 'Valuation');
        let year = int(data.getString(i, 'Year Founded'));
        let val = raw.replace("$", "").replace("B", "");

        let dot_X = 51 + (val / 15) * 59;
        let dot_Y = height - 60 - ((year - 1910 ) / 10) * 53;

        circle(dot_X, dot_Y, 7);
        
        if (dist(mouseX, mouseY, dot_X, dot_Y) < 5) {       //hovering around the circle interactively
            fill(175, 156, 200);
            rect(mouseX - 5, mouseY - 20, 240, 18);
            fill(0);
            text(`${data.getString(i, 'Company')}: $${val}B (${year})`, mouseX + 10, mouseY - 5);   //formatting
            fill(75, 156, 211, 200);    //makes the color back to the dot for frame redraw
        }
    }

    for(let i = 1; i <= val_arr.length; i++){
            strokeWeight(0.05);
            line(i * 59, height - 60, i * 59, 30);
            line(15, height - 60 - i * 53, width - 90, height - 60 - i * 53);
    }
    strokeWeight(0.5);
}