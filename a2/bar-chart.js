let ind_values;
let valuation;

function preload(){
    data = loadTable('data.csv', 'csv', 'header');
}

function setup(){
    let canvas = createCanvas(900, 700);
    canvas.parent('chart');
    background(210);

    ind_values = [...new Set(data.getColumn('Industry').map(String))];  //array with non-duplicate values
    console.log(ind_values);

    valuation = data.getColumn('Valuation').map(Number);
    console.log(valuation);
}

function draw(){
    background(210);
    fill(0);
    //Drawing and labeling the axes
    line(200, 35, 200, height - 70);      //y-axis
    line(200, height - 70, width - 70, height - 70);     //x-axis
    text('Valuation', width - 60, height - 70);
    text('Industry', 185, 20);

    let val_arr = [];
    for(let j = 1; j <= 256; j *= 2){
        val_arr.push(j);
    }

    for(let i = 1; i <= val_arr.length; i++){       //x-axis labels (log base 2 scale)
        text(`$${val_arr[i - 1]}B`, 140 +  i  * 70, height - 55);    //Note: x-axis Seperation is 70 units
    }

    for(let y = 1; y < ind_values.length; y++){     //y-axis labels     
        text(`${ind_values[y - 1]}`, 1, y * 42);    //Note: y-axis Seperation is 40 units
    }


    fill(75, 156, 211);
    //making the bar charts finally
    for(let ind_iter = 1; ind_iter < ind_values.length; ind_iter++){
        let raw = data.findRow(ind_values[ind_iter - 1], 'Industry').get("Valuation");
        let temp_val = int(raw.replace("$", "").replace("B", ""));

        let barY = 10 + (ind_iter * 40) - 20;       //positioning according to the axis
        let barX = 10 + Math.log2(temp_val) * 70;   

        fill(75, 156, 211);
        rect(200, barY, barX, 40);          // bar drawing

        if (mouseX > 200 && mouseX < 200 + barX &&    // interactive part
            mouseY > barY && mouseY < barY + 40) {
            fill(253, 170, 72);
            rect(mouseX - 5, mouseY - 20, 240, 18);
            fill(0);
            text(`${ind_values[ind_iter-1]}: $${temp_val}B`, mouseX + 10, mouseY - 5);
        }
    }

    for(let i = 1; i <= val_arr.length; i++){
            strokeWeight(0.05);
            line(140 + i * 70, height - 70, 140 + i * 70, 30);
    }
}
    
