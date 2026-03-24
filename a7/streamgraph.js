d3.csv("games.csv", d3.autoType).then(function(data) {

    data.forEach(function(d) {
        if (d.release_date) {
            const parts = d.release_date.split("/");
            d.release_year = parts.length === 3 ? +parts[2] : null;
        } else {
            d.release_year = null;
        }
    });

    const filtered = data.filter(d => d.release_year >= 2000 && d.release_year <= 2018 && d.total_sales > 0);

    let genreSums = {};
    filtered.forEach(function(d) {
        genreSums[d.genre] = (genreSums[d.genre] || 0) + d.total_sales;
    });
    const topGenres = Object.entries(genreSums)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(d => d[0]);

    let salesByYearGenre = {};
    filtered.filter(d => topGenres.includes(d.genre)).forEach(function(d) {
        const key = d.release_year + "_" + d.genre;
        salesByYearGenre[key] = (salesByYearGenre[key] || 0) + d.total_sales;
    });

    const years = d3.range(2000, 2019);

    const wideData = years.map(function(yr) {
        const row = { year: new Date(yr, 0, 1), yr: yr };
        topGenres.forEach(function(g) {
            row[g] = salesByYearGenre[yr + "_" + g] || 0;
        });
        return row;
    });

    const stack = d3.stack()
        .keys(topGenres)
        .offset(d3.stackOffsetWiggle)
        .order(d3.stackOrderInsideOut);

    const stacked = stack(wideData);

    const svgWidth  = 1000;
    const svgHeight = 500;
    const margin = { top: 70, right: 200, bottom: 55, left: 60 };
    const width  = svgWidth  - margin.left - margin.right;
    const height = svgHeight - margin.top  - margin.bottom;

    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const scaleX = d3.scaleTime()
        .domain([new Date(2000, 0, 1), new Date(2018, 0, 1)])
        .range([0, width]);

    const yMin = d3.min(stacked, layer => d3.min(layer, d => d[0]));
    const yMax = d3.max(stacked, layer => d3.max(layer, d => d[1]));
    const scaleY = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([height, 0]);

    const colorScale = d3.scaleOrdinal()
        .domain(topGenres)
        .range(d3.schemeTableau10);

    chart.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(scaleX).ticks(d3.timeYear.every(2)).tickFormat(d3.timeFormat("%Y")));

    chart.append("text")
        .attr("x", width / 2)
        .attr("y", height + 42)
        .attr("text-anchor", "middle")
        .text("Year");

    chart.append("text")
        .attr("x", width / 2)
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("font-weight", "bold")
        .text("Video Game Sales Streamgraph by Genre (2000\u20132018)");

    chart.append("text")
        .attr("x", width / 2)
        .attr("y", -18)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#777")
        .text("Width of each band shows relative yearly sales \u2014 hover a band to inspect it");

    const areaGen = d3.area()
        .x(d => scaleX(d.data.year))
        .y0(d => scaleY(d[0]))
        .y1(d => scaleY(d[1]))
        .curve(d3.curveCatmullRom);

    const tooltip = d3.select("body").append("div")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("padding", "8px 12px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("display", "none")
        .style("box-shadow", "0 2px 6px rgba(0,0,0,0.12)");

    const yearDates = years.map(yr => new Date(yr, 0, 1));

    stacked.forEach(function(layer) {
        const genre = layer.key;

        chart.append("path")
            .datum(layer)
            .attr("class", "stream-band")
            .attr("fill", colorScale(genre))
            .attr("fill-opacity", 0.85)
            .attr("d", areaGen)
            .on("mouseover", function() {
                d3.selectAll(".stream-band").attr("fill-opacity", 0.25);
                d3.select(this).attr("fill-opacity", 0.95);
            })
            .on("mousemove", function(event) {
                const [mx] = d3.pointer(event);
                const mouseDate = scaleX.invert(mx);
                let idx = d3.bisectLeft(yearDates, mouseDate);
                if (idx > 0 && idx < years.length) {
                    const before = yearDates[idx - 1];
                    const after  = yearDates[idx];
                    idx = mouseDate - before < after - mouseDate ? idx - 1 : idx;
                }
                idx = Math.max(0, Math.min(idx, years.length - 1));
                const val = wideData[idx][genre];

                tooltip
                    .style("display", null)
                    .style("left", (event.pageX + 15) + "px")
                    .style("top",  (event.pageY - 40) + "px")
                    .html(`<strong style="color:${colorScale(genre)}">${genre}</strong><br/>${years[idx]}: ${val.toFixed(2)}M`);
            })
            .on("mouseleave", function() {
                d3.selectAll(".stream-band").attr("fill-opacity", 0.85);
                tooltip.style("display", "none");
            });
    });

    const legend = d3.legendColor()
        .shapeWidth(20)
        .shapeHeight(12)
        .orient("vertical")
        .title("Genre")
        .scale(colorScale);

    svg.append("g")
        .attr("transform", `translate(${svgWidth - margin.right + 18}, ${margin.top + 20})`)
        .call(legend);

});
