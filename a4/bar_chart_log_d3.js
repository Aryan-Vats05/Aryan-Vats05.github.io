d3.csv("fish.csv", d3.autoType).then(function(data) {

    let grouped = d3.group(data, d => d.Species);
    let avgWeights = [];
    grouped.forEach(function(values, species) {
        avgWeights.push({ species: species, avgWeight: d3.mean(values, d => d.Weight) });
    });
    let speciesList = Array.from(grouped.keys());

    const svgWidth = 700;
    const svgHeight = 450;
    const margin = { top: 40, right: 30, bottom: 60, left: 80 };

    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const scaleX = d3.scaleBand()
        .domain(speciesList)
        .range([0, width])
        .padding(0.2);

    const scaleY = d3.scaleLog()
        .base(10)
        .domain([1, d3.max(avgWeights, d => d.avgWeight) * 1.5])
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
        .text("Species");

    chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -65)
        .attr("text-anchor", "middle")
        .text("Average Weight (g) - Log Scale");

    chart.append("text")
        .attr("x", width / 2)
        .attr("y", -15)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text("Average Fish Weight by Species (Log Scale)");

    const tooltip = d3.select("#tooltip")
        .style("position", "absolute")
        .style("pointer-events", "none")
        .style("opacity", 0);

    chart.selectAll(".bar")
        .data(avgWeights)
        .enter()
        .append("rect")
        .attr("x", d => scaleX(d.species))
        .attr("y", d => scaleY(d.avgWeight))
        .attr("width", scaleX.bandwidth())
        .attr("height", d => scaleY(1) - scaleY(d.avgWeight))
        .attr("fill", "steelblue")
        .on("mouseover", function(event, d) {
            tooltip.style("opacity", 1).html(`<b>${d.species}</b><br>Avg Weight: ${d.avgWeight.toFixed(1)} g`);
        })
        .on("mousemove", function(event) {
            tooltip.style("left", event.pageX + 12 + "px").style("top", event.pageY - 30 + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0);
        });

    chart.selectAll(".label")
        .data(avgWeights)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => scaleX(d.species) + scaleX.bandwidth() / 2)
        .attr("y", d => scaleY(d.avgWeight) - 5)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text(d => d.avgWeight.toFixed(1));
});
