let industries;
let cities;

function preload(){
    data = loadTable('data.csv', 'csv', 'header');
}

function setup(){
    let canvas = createCanvas(1200, 700);
    canvas.parent('chart');
    background(210);
    industries = ["Artificial intelligence", "E-commerce & direct-to-consumer",  //manually writing arrays since
    "Fintech", "Health", "Internet software & services",                            //only need a few entries
    "Other", "Supply chain, logistics, & delivery"];
    console.log(industries);
    cities = ["Beijing", "London", "New York", "San Francisco", "Shenzhen"];
    console.log(cities);
}

function draw(){
    stroke(0.05);
    background(210);
    fill(50);

    //creating and labeling axes
    line(200, 100, 200, height - 50);      //y-axis
    line(200, 100 , width - 360, 100);     //x-axis
    text('City', width - 350, 100);
    text('Industry', 0, 60);


    for(let y = 1; y <= industries.length; y++){     //y-axis labels     
        text(`${industries[y - 1]}`, 1, y * 75 + 100);    //Note: y-axis Seperation is 75 units
    }

    for(let x = 1; x <= cities.length; x++){
        text(`${cities[x - 1]}`,100 + x * 126 , 80);
    }

    noStroke();
    let hoverInfo = [];
    for(r = 0; r < industries.length; r++){
        for(c = 0; c < cities.length; c++){
            let total = 0;

            for(i = 0; i < data.getRowCount(); i++){
                if(data.getString(i, 'Industry') == industries[r] && //this data is loaded from csv
                   data.getString(i, 'City') == cities[c]){
                    total += int(data.getString(i, 'Valuation').replace("$", "").replace("B", ""));
                   }
            }
            let intensity = map(total, 1, 150, 208, 130);  //the coloring range from 0 to 150 as input and 200 to 130 as output
            if(total == 0){
                fill(170, 240, 240);    //very light teal for empty cells
            } else {
                fill(intensity / 2, intensity, intensity);
            } 
            rect(210 + c * 120, 110 + r * 75, 120, 75);
            if(mouseX > 210 + c * 120 && mouseX < 330 + c * 120 && mouseY > 110 + r * 75 && mouseY < 185 + r * 75){
            hoverInfo = [industries[r], cities[c], total];}
        }
    }
    if(hoverInfo.length > 0){
        fill(253, 170, 72);
        rect(mouseX - 5, mouseY - 20, 300, 18);
        fill(0);
        text(`${hoverInfo[0]}, ${hoverInfo[1]}, $${hoverInfo[2]}B`, mouseX + 10, mouseY - 5);
    }
}