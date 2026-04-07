const stateCentroids = [
    {lat: 33.2588817, lng: -86.8295337, state: "Alabama"},
    {lat: 64.4459613, lng: -149.680909, state: "Alaska"},
    {lat: 34.395342, lng: -111.7632755, state: "Arizona"},
    {lat: 35.2048883, lng: -92.4479108, state: "Arkansas"},
    {lat: 36.7014631, lng: -118.7559974, state: "California"},
    {lat: 38.7251776, lng: -105.6077167, state: "Colorado"},
    {lat: 41.6500201, lng: -72.7342163, state: "Connecticut"},
    {lat: 38.6920451, lng: -75.4013315, state: "Delaware"},
    {lat: 27.7567667, lng: -81.4639835, state: "Florida"},
    {lat: 32.3293809, lng: -83.1137366, state: "Georgia"},
    {lat: 21.2160437, lng: -157.975203, state: "Hawaii"},
    {lat: 43.6447642, lng: -114.0154071, state: "Idaho"},
    {lat: 40.0796606, lng: -89.4337288, state: "Illinois"},
    {lat: 40.3270127, lng: -86.1746933, state: "Indiana"},
    {lat: 41.9216734, lng: -93.3122705, state: "Iowa"},
    {lat: 38.27312, lng: -98.5821872, state: "Kansas"},
    {lat: 37.5726028, lng: -85.1551411, state: "Kentucky"},
    {lat: 30.8703881, lng: -92.007126, state: "Louisiana"},
    {lat: 45.709097, lng: -68.8590201, state: "Maine"},
    {lat: 39.5162234, lng: -76.9382069, state: "Maryland"},
    {lat: 42.3788774, lng: -72.032366, state: "Massachusetts"},
    {lat: 43.6211955, lng: -84.6824346, state: "Michigan"},
    {lat: 45.9896587, lng: -94.6113288, state: "Minnesota"},
    {lat: 32.9715645, lng: -89.7348497, state: "Mississippi"},
    {lat: 38.7604815, lng: -92.5617875, state: "Missouri"},
    {lat: 47.3752671, lng: -109.6387579, state: "Montana"},
    {lat: 41.7370229, lng: -99.5873816, state: "Nebraska"},
    {lat: 39.5158825, lng: -116.8537227, state: "Nevada"},
    {lat: 43.4849133, lng: -71.6553992, state: "New Hampshire"},
    {lat: 40.0757384, lng: -74.4041622, state: "New Jersey"},
    {lat: 34.5708167, lng: -105.993007, state: "New Mexico"},
    {lat: 42.6588992, lng: -80.2590355, state: "New York"},
    {lat: 35.6729639, lng: -79.0392919, state: "North Carolina"},
    {lat: 47.6201461, lng: -100.540737, state: "North Dakota"},
    {lat: 40.2253569, lng: -82.6881395, state: "Ohio"},
    {lat: 34.9550817, lng: -97.2684063, state: "Oklahoma"},
    {lat: 43.9792797, lng: -120.737257, state: "Oregon"},
    {lat: 40.9699889, lng: -77.7278831, state: "Pennsylvania"},
    {lat: 41.7962409, lng: -71.5992372, state: "Rhode Island"},
    {lat: 33.6874388, lng: -80.4363743, state: "South Carolina"},
    {lat: 44.6471761, lng: -100.348761, state: "South Dakota"},
    {lat: 35.7730076, lng: -86.2820081, state: "Tennessee"},
    {lat: 31.8160381, lng: -99.5120986, state: "Texas"},
    {lat: 39.4225192, lng: -111.7143584, state: "Utah"},
    {lat: 44.5990718, lng: -72.5002608, state: "Vermont"},
    {lat: 37.1232245, lng: -78.4927721, state: "Virginia"},
    {lat: 47.2868352, lng: -120.2126139, state: "Washington"},
    {lat: 38.4758406, lng: -80.8408415, state: "West Virginia"},
    {lat: 44.4308975, lng: -89.6884637, state: "Wisconsin"},
    {lat: 42.9015609, lng: -109.2539886, state: "Wyoming"}
];

Promise.all([
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"),
    d3.csv("expensive-states.csv")
]).then(function([us, data]) {

    const sorted = data.slice().sort(function(a, b) { return +a.costRank - +b.costRank; });
    const top10Names = new Set(sorted.slice(0, 10).map(function(d) { return d.State; }));

    const costByState = {};
    data.forEach(function(d) {
        costByState[d.State] = {
            costIndex: +d.costIndex,
            costRank: +d.costRank,
            housingCost: +d.housingCost,
            groceryCost: +d.groceryCost
        };
    });

    const merged = stateCentroids.map(function(c) {
        return Object.assign({}, c, costByState[c.state] || {});
    }).filter(function(d) { return d.costIndex; });

    const width = 960, height = 620;

    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const projection = d3.geoAlbersUsa()
        .scale(1300)
        .translate([480, 300]);

    const path = d3.geoPath().projection(projection);

    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .join("path")
        .attr("d", path)
        .attr("fill", "#f5f5f5")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 0.8);

    const rScale = d3.scaleSqrt()
        .domain([d3.min(merged, function(d) { return d.costIndex; }), d3.max(merged, function(d) { return d.costIndex; })])
        .range([5, 35]);

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

    merged.sort(function(a, b) { return b.costIndex - a.costIndex; });

    svg.append("g")
        .selectAll("circle")
        .data(merged)
        .join("circle")
        .attr("cx", function(d) {
            const proj = projection([d.lng, d.lat]);
            return proj ? proj[0] : -999;
        })
        .attr("cy", function(d) {
            const proj = projection([d.lng, d.lat]);
            return proj ? proj[1] : -999;
        })
        .attr("r", function(d) { return rScale(d.costIndex); })
        .attr("fill", function(d) { return top10Names.has(d.state) ? "#f28e2b" : "#4e79a7"; })
        .attr("fill-opacity", 0.7)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .on("mouseover", function(event, d) {
            d3.select(this).attr("stroke", "#333").attr("fill-opacity", 0.95);
            tooltip.style("display", null)
                .html("<strong>" + d.state + "</strong><br/>Cost Index: " + d.costIndex + "<br/>Rank: #" + d.costRank + "<br/>Housing: " + d.housingCost + "<br/>Grocery: " + d.groceryCost);
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 12) + "px").style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).attr("stroke", "#fff").attr("fill-opacity", 0.7);
            tooltip.style("display", "none");
        });

    const lgX = 30, lgY = height - 60;

    svg.append("circle").attr("cx", lgX + 10).attr("cy", lgY).attr("r", 8).attr("fill", "#f28e2b").attr("fill-opacity", 0.7);
    svg.append("text").attr("x", lgX + 24).attr("y", lgY + 5).attr("font-size", "12px").text("Top 10 Most Expensive States");
    svg.append("circle").attr("cx", lgX + 10).attr("cy", lgY + 22).attr("r", 8).attr("fill", "#4e79a7").attr("fill-opacity", 0.7);
    svg.append("text").attr("x", lgX + 24).attr("y", lgY + 27).attr("font-size", "12px").text("Other States");

    const sizeLgX = 30, sizeLgY = lgY - 80;
    svg.append("text").attr("x", sizeLgX).attr("y", sizeLgY - 8).attr("font-size", "11px").attr("fill", "#333").text("Cost Index (size)");

    const sizeLgVals = [87, 110, 150, 193];
    let curX = sizeLgX + 10;
    sizeLgVals.forEach(function(v) {
        const r = rScale(v);
        curX += r;
        svg.append("circle")
            .attr("cx", curX).attr("cy", sizeLgY + 28)
            .attr("r", r)
            .attr("fill", "none")
            .attr("stroke", "#666")
            .attr("stroke-width", 1);
        svg.append("text")
            .attr("x", curX).attr("y", sizeLgY + 28 + r + 13)
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .text(v);
        curX += r + 10;
    });
});
