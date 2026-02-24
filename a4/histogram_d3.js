d3.csv("fish.csv", d3.autoType).then(function(data) {

    const svgWidth = 700;
    const svgHeight = 450;
    const margin = { top: 40, right: 30, bottom: 60, left: 60 };

    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const scaleX = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Weight)]).nice()
        .range([0, width]);

    const bins = d3.bin()
        .value(d => d.Weight)
        .domain(scaleX.domain())
        .thresholds(12)(data);

    const scaleY = d3.scaleLinear()
        .domain([0, d3.max(bins, b => b.length)])
        .nice()
        .range([height, 0]);

    chart.append("g")
        .attr("class", "axis axis-x")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(scaleX));

    chart.append("g")
        .attr("class", "axis axis-y")
        .call(d3.axisLeft(scaleY).ticks(6));

    chart.append("text")
        .attr("x", width / 2)
        .attr("y", height + 45)
        .attr("text-anchor", "middle")
        .text("Weight (g)");

    chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -45)
        .attr("text-anchor", "middle")
        .text("Count");

    chart.append("text")
        .attr("x", width / 2)
        .attr("y", -15)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text("Distribution of Fish Weight");

    const tooltip = d3.select("#tooltip")
        .style("position", "absolute")
        .style("pointer-events", "none")
        .style("opacity", 0);

    chart.selectAll(".bar")
        .data(bins)
        .enter()
        .append("rect")
        .attr("x", b => scaleX(b.x0) + 1)
        .attr("y", b => scaleY(b.length))
        .attr("width", b => scaleX(b.x1) - scaleX(b.x0) - 1)
        .attr("height", b => height - scaleY(b.length))
        .attr("fill", "steelblue")
        .on("mouseover", function(event, b) {
            tooltip.style("opacity", 1).html(`Range: ${b.x0}-${b.x1} g<br>Count: ${b.length}`);
        })
        .on("mousemove", function(event) {
            tooltip.style("left", event.pageX + 12 + "px").style("top", event.pageY - 30 + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0);
        });
});
