Promise.all([
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json"),
    d3.csv("Education2023.csv")
]).then(function([us, raw]) {

    const bachelorByFips = {};
    const nameByFips = {};

    raw.forEach(function(d) {
        const fips = +d["FIPS Code"];
        if (fips > 0 && fips % 1000 !== 0) {
            nameByFips[fips] = d["Area name"] + ", " + d["State"];
            if (d["Attribute"] === "Percent of adults with a bachelor's degree or higher, 2019-23") {
                bachelorByFips[fips] = +d["Value"];
            }
        }
    });

    const values = Object.values(bachelorByFips);
    const colorScale = d3.scaleSequential()
        .domain([d3.min(values), d3.max(values)])
        .interpolator(d3.interpolateBlues);

    const width = 960, height = 620;

    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const projection = d3.geoAlbersUsa()
        .scale(1300)
        .translate([480, 300]);

    const path = d3.geoPath().projection(projection);

    const tooltip = d3.select("body").append("div")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("padding", "6px 10px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("display", "none")
        .style("box-shadow", "0 2px 6px rgba(0,0,0,0.12)");

    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.counties).features)
        .join("path")
        .attr("d", path)
        .attr("fill", function(d) {
            const val = bachelorByFips[+d.id];
            return val !== undefined ? colorScale(val) : "#ddd";
        })
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.3)
        .on("mouseover", function(event, d) {
            d3.select(this).attr("stroke", "#333").attr("stroke-width", 1);
            const val = bachelorByFips[+d.id];
            tooltip.style("display", null)
                .html("<strong>" + (nameByFips[+d.id] || "Unknown") + "</strong><br/>Bachelor's+: " + (val !== undefined ? val.toFixed(1) + "%" : "N/A"));
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 12) + "px").style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).attr("stroke", "#fff").attr("stroke-width", 0.3);
            tooltip.style("display", "none");
        });

    svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
        .attr("fill", "none")
        .attr("stroke", "#999")
        .attr("stroke-width", 0.8)
        .attr("d", path);

    const legendWidth = 240, legendHeight = 12;
    const legendX = 30, legendY = height - 50;
    const minVal = d3.min(values), maxVal = d3.max(values);

    const defs = svg.append("defs");
    const grad = defs.append("linearGradient").attr("id", "legend-grad");
    grad.selectAll("stop")
        .data(d3.range(7).map(function(i) { return i / 6; }))
        .join("stop")
        .attr("offset", function(d) { return (d * 100) + "%"; })
        .attr("stop-color", function(d) { return colorScale(minVal + d * (maxVal - minVal)); });

    svg.append("rect")
        .attr("x", legendX).attr("y", legendY)
        .attr("width", legendWidth).attr("height", legendHeight)
        .attr("fill", "url(#legend-grad)");

    const legendScale = d3.scaleLinear()
        .domain([minVal, maxVal])
        .range([legendX, legendX + legendWidth]);

    svg.append("g")
        .attr("transform", "translate(0," + (legendY + legendHeight) + ")")
        .call(d3.axisBottom(legendScale).ticks(5).tickFormat(function(d) { return d + "%"; }))
        .select(".domain").remove();

    svg.append("text")
        .attr("x", legendX)
        .attr("y", legendY - 6)
        .attr("font-size", "11px")
        .attr("fill", "#333")
        .text("% Adults with Bachelor's Degree or Higher");
});
