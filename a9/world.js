const happinessData = [
    {id: 4, name: "Afghanistan", value: 2.63},
    {id: 12, name: "Algeria", value: 5.14},
    {id: 24, name: "Angola", value: 3.83},
    {id: 32, name: "Argentina", value: 5.97},
    {id: 36, name: "Australia", value: 7.19},
    {id: 40, name: "Austria", value: 7.09},
    {id: 50, name: "Bangladesh", value: 5.29},
    {id: 56, name: "Belgium", value: 6.91},
    {id: 64, name: "Bhutan", value: 5.08},
    {id: 68, name: "Bolivia", value: 5.71},
    {id: 72, name: "Botswana", value: 4.38},
    {id: 76, name: "Brazil", value: 6.07},
    {id: 100, name: "Bulgaria", value: 5.05},
    {id: 104, name: "Myanmar", value: 4.38},
    {id: 108, name: "Burundi", value: 3.79},
    {id: 116, name: "Cambodia", value: 4.87},
    {id: 120, name: "Cameroon", value: 5.20},
    {id: 124, name: "Canada", value: 6.96},
    {id: 144, name: "Sri Lanka", value: 3.77},
    {id: 148, name: "Chad", value: 4.42},
    {id: 152, name: "Chile", value: 6.00},
    {id: 156, name: "China", value: 5.82},
    {id: 170, name: "Colombia", value: 6.06},
    {id: 178, name: "Congo", value: 5.60},
    {id: 180, name: "DR Congo", value: 3.17},
    {id: 188, name: "Costa Rica", value: 6.61},
    {id: 191, name: "Croatia", value: 5.89},
    {id: 192, name: "Cuba", value: 5.57},
    {id: 203, name: "Czech Republic", value: 6.90},
    {id: 208, name: "Denmark", value: 7.58},
    {id: 214, name: "Dominican Republic", value: 6.19},
    {id: 218, name: "Ecuador", value: 5.73},
    {id: 818, name: "Egypt", value: 4.32},
    {id: 222, name: "El Salvador", value: 6.08},
    {id: 232, name: "Eritrea", value: 3.91},
    {id: 231, name: "Ethiopia", value: 4.13},
    {id: 246, name: "Finland", value: 7.74},
    {id: 250, name: "France", value: 6.66},
    {id: 266, name: "Gabon", value: 5.20},
    {id: 288, name: "Ghana", value: 4.82},
    {id: 276, name: "Germany", value: 6.67},
    {id: 300, name: "Greece", value: 6.25},
    {id: 320, name: "Guatemala", value: 6.07},
    {id: 332, name: "Haiti", value: 3.98},
    {id: 340, name: "Honduras", value: 5.48},
    {id: 348, name: "Hungary", value: 5.78},
    {id: 352, name: "Iceland", value: 7.53},
    {id: 356, name: "India", value: 4.02},
    {id: 360, name: "Indonesia", value: 5.27},
    {id: 364, name: "Iran", value: 4.47},
    {id: 368, name: "Iraq", value: 4.65},
    {id: 372, name: "Ireland", value: 6.91},
    {id: 376, name: "Israel", value: 7.34},
    {id: 380, name: "Italy", value: 6.40},
    {id: 388, name: "Jamaica", value: 5.68},
    {id: 392, name: "Japan", value: 6.13},
    {id: 400, name: "Jordan", value: 4.63},
    {id: 404, name: "Kenya", value: 4.57},
    {id: 410, name: "South Korea", value: 5.95},
    {id: 414, name: "Kuwait", value: 6.18},
    {id: 418, name: "Laos", value: 4.55},
    {id: 422, name: "Lebanon", value: 2.39},
    {id: 428, name: "Latvia", value: 6.01},
    {id: 434, name: "Libya", value: 5.43},
    {id: 440, name: "Lithuania", value: 5.97},
    {id: 450, name: "Madagascar", value: 4.17},
    {id: 454, name: "Malawi", value: 3.92},
    {id: 458, name: "Malaysia", value: 5.86},
    {id: 466, name: "Mali", value: 4.30},
    {id: 484, name: "Mexico", value: 6.33},
    {id: 504, name: "Morocco", value: 5.15},
    {id: 508, name: "Mozambique", value: 3.28},
    {id: 516, name: "Namibia", value: 5.21},
    {id: 524, name: "Nepal", value: 5.44},
    {id: 528, name: "Netherlands", value: 7.32},
    {id: 554, name: "New Zealand", value: 7.07},
    {id: 558, name: "Nicaragua", value: 6.00},
    {id: 562, name: "Niger", value: 4.20},
    {id: 566, name: "Nigeria", value: 4.54},
    {id: 578, name: "Norway", value: 7.30},
    {id: 586, name: "Pakistan", value: 4.43},
    {id: 591, name: "Panama", value: 6.47},
    {id: 600, name: "Paraguay", value: 5.41},
    {id: 604, name: "Peru", value: 5.86},
    {id: 608, name: "Philippines", value: 5.95},
    {id: 616, name: "Poland", value: 6.13},
    {id: 620, name: "Portugal", value: 6.21},
    {id: 630, name: "Puerto Rico", value: 6.43},
    {id: 642, name: "Romania", value: 6.01},
    {id: 643, name: "Russia", value: 5.66},
    {id: 646, name: "Rwanda", value: 3.97},
    {id: 682, name: "Saudi Arabia", value: 6.37},
    {id: 686, name: "Senegal", value: 4.71},
    {id: 694, name: "Sierra Leone", value: 3.42},
    {id: 702, name: "Singapore", value: 6.59},
    {id: 703, name: "Slovakia", value: 6.44},
    {id: 705, name: "Slovenia", value: 6.48},
    {id: 706, name: "Somalia", value: 3.44},
    {id: 710, name: "South Africa", value: 5.53},
    {id: 724, name: "Spain", value: 6.47},
    {id: 729, name: "Sudan", value: 3.67},
    {id: 752, name: "Sweden", value: 7.36},
    {id: 756, name: "Switzerland", value: 7.24},
    {id: 764, name: "Thailand", value: 5.99},
    {id: 780, name: "Trinidad and Tobago", value: 6.19},
    {id: 788, name: "Tunisia", value: 4.72},
    {id: 792, name: "Turkey", value: 4.61},
    {id: 800, name: "Uganda", value: 4.47},
    {id: 804, name: "Ukraine", value: 5.07},
    {id: 784, name: "United Arab Emirates", value: 6.73},
    {id: 826, name: "United Kingdom", value: 6.72},
    {id: 834, name: "Tanzania", value: 3.70},
    {id: 840, name: "United States", value: 6.89},
    {id: 858, name: "Uruguay", value: 6.13},
    {id: 860, name: "Uzbekistan", value: 6.18},
    {id: 862, name: "Venezuela", value: 4.52},
    {id: 704, name: "Vietnam", value: 5.97},
    {id: 887, name: "Yemen", value: 3.59},
    {id: 894, name: "Zambia", value: 3.59},
    {id: 716, name: "Zimbabwe", value: 3.27}
];

d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(function(world) {

    const dataById = {};
    happinessData.forEach(function(d) { dataById[d.id] = d; });

    const values = happinessData.map(function(d) { return d.value; });
    const colorScale = d3.scaleSequential()
        .domain([d3.min(values), d3.max(values)])
        .interpolator(d3.interpolateYlGn);

    const width = 960, height = 560;

    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const projection = d3.geoNaturalEarth1()
        .scale(160)
        .translate([width / 2, height / 2]);

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

    svg.append("path")
        .datum({type: "Sphere"})
        .attr("d", path)
        .attr("fill", "#d0e8f0")
        .attr("stroke", "#aaa")
        .attr("stroke-width", 0.5);

    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(world, world.objects.countries).features)
        .join("path")
        .attr("d", path)
        .attr("fill", function(d) {
            const entry = dataById[+d.id];
            return entry ? colorScale(entry.value) : "#ddd";
        })
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.3)
        .on("mouseover", function(event, d) {
            d3.select(this).attr("stroke", "#333").attr("stroke-width", 1);
            const entry = dataById[+d.id];
            tooltip.style("display", null)
                .html(entry
                    ? "<strong>" + entry.name + "</strong><br/>Happiness Score: " + entry.value.toFixed(2)
                    : "<strong>No data</strong>");
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 12) + "px").style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).attr("stroke", "#fff").attr("stroke-width", 0.3);
            tooltip.style("display", "none");
        });

    const legendWidth = 240, legendHeight = 12;
    const legendX = 30, legendY = height - 50;
    const minVal = d3.min(values), maxVal = d3.max(values);

    const defs = svg.append("defs");
    const grad = defs.append("linearGradient").attr("id", "world-legend-grad");
    grad.selectAll("stop")
        .data(d3.range(7).map(function(i) { return i / 6; }))
        .join("stop")
        .attr("offset", function(d) { return (d * 100) + "%"; })
        .attr("stop-color", function(d) { return colorScale(minVal + d * (maxVal - minVal)); });

    svg.append("rect")
        .attr("x", legendX).attr("y", legendY)
        .attr("width", legendWidth).attr("height", legendHeight)
        .attr("fill", "url(#world-legend-grad)");

    const legendScale = d3.scaleLinear()
        .domain([minVal, maxVal])
        .range([legendX, legendX + legendWidth]);

    svg.append("g")
        .attr("transform", "translate(0," + (legendY + legendHeight) + ")")
        .call(d3.axisBottom(legendScale).ticks(5).tickFormat(function(d) { return d.toFixed(1); }))
        .select(".domain").remove();

    svg.append("text")
        .attr("x", legendX)
        .attr("y", legendY - 6)
        .attr("font-size", "11px")
        .attr("fill", "#333")
        .text("Happiness Score (0–10)");
});
