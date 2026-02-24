d3.csv("fish.csv", d3.autoType).then(function(data) {

    let measurements = Object.keys(data[0]).filter(k => k !== "Species");

    let grouped = d3.group(data, d => d.Species);
    let speciesList = Array.from(grouped.keys());
    let avgData = [];
    grouped.forEach(function(values, species) {
        for (let j = 0; j < measurements.length; j++) {
            avgData.push({ species: species, measure: measurements[j], value: d3.mean(values, d => d[measurements[j]]) });
        }
    });

    const svgWidth = 700;
    const svgHeight = 450;
    const margin = { top: 50, right: 30, bottom: 60, left: 110 };

    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const scaleX = d3.scaleBand()
        .domain(measurements)
        .range([0, width])
        .padding(0.05);

    const scaleY = d3.scaleBand()
        .domain(speciesList)
        .range([0, height])
        .padding(0.05);

    const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, d3.max(avgData, d => d.value)]);

    chart.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(scaleX));

    chart.append("g")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(scaleY));

    chart.append("text")
        .attr("x", width / 2)
        .attr("y", height + 45)
        .attr("text-anchor", "middle")
        .text("Measurement");

    chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -95)
        .attr("text-anchor", "middle")
        .text("Species");

    chart.append("text")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text("Average Fish Measurements by Species");

    const tooltip = d3.select("#tooltip")
        .style("position", "absolute")
        .style("pointer-events", "none")
        .style("opacity", 0);

    chart.selectAll(".cell")
        .data(avgData)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("x", d => scaleX(d.measure))
        .attr("y", d => scaleY(d.species))
        .attr("width", scaleX.bandwidth())
        .attr("height", scaleY.bandwidth())
        .attr("fill", d => colorScale(d.value))
        .on("mouseover", function(event, d) {
            tooltip.style("opacity", 1).html(`<b>${d.species}</b><br>${d.measure}: ${d.value.toFixed(2)}`);
        })
        .on("mousemove", function(event) {
            tooltip.style("left", event.pageX + 12 + "px").style("top", event.pageY - 30 + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0);
        });
});
