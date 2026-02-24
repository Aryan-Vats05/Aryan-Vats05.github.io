d3.csv("fish.csv", d3.autoType).then(function(data) {

    let speciesList = [...new Set(data.map(d => d.Species))];
    const colorPalette = ["steelblue", "orange", "green", "red", "purple", "brown", "pink"];
    let speciesColor = {};
    speciesList.forEach((s, i) => { speciesColor[s] = colorPalette[i % colorPalette.length]; });

    const svgWidth = 800;
    const svgHeight = 450;
    const margin = { top: 40, right: 160, bottom: 60, left: 80 };

    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const scaleX = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Length1)).nice()
        .range([0, width]);

    const scaleY = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Weight)]).nice()
        .range([height, 0]);

    chart.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(scaleX));

    chart.append("g")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(scaleY).ticks(5));

    chart.append("text")
        .attr("x", width / 2)
        .attr("y", height + 45)
        .attr("text-anchor", "middle")
        .text("Length (cm)");

    chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -65)
        .attr("text-anchor", "middle")
        .text("Weight (g)");

    chart.append("text")
        .attr("x", width / 2)
        .attr("y", -15)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text("Fish Weight vs. Length by Species");

    const tooltip = d3.select("#tooltip")
        .style("position", "absolute")
        .style("pointer-events", "none")
        .style("opacity", 0);

    chart.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => scaleX(d.Length1))
        .attr("cy", d => scaleY(d.Weight))
        .attr("r", 5)
        .attr("fill", d => speciesColor[d.Species])
        .attr("opacity", 0.75)
        .on("mouseover", function(event, d) {
            tooltip.style("opacity", 1).html(`<b>${d.Species}</b><br>Length: ${d.Length1} cm<br>Weight: ${d.Weight} g`);
        })
        .on("mousemove", function(event) {
            tooltip.style("left", event.pageX + 12 + "px").style("top", event.pageY - 30 + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0);
        });

    const legend = chart.append("g").attr("transform", `translate(${width + 20}, 0)`);
    speciesList.forEach((species, i) => {
        legend.append("circle").attr("cx", 0).attr("cy", i * 22).attr("r", 6).attr("fill", speciesColor[species]);
        legend.append("text").attr("x", 12).attr("y", i * 22 + 5).attr("font-size", "13px").text(species);
    });
});
