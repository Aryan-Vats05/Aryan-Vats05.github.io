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

    const series = topGenres.map(function(genre) {
        return {
            genre: genre,
            values: years.map(function(yr) {
                return {
                    year: new Date(yr, 0, 1),
                    yr: yr,
                    sales: salesByYearGenre[yr + "_" + genre] || 0
                };
            })
        };
    });

    const colorScale = d3.scaleOrdinal()
        .domain(topGenres)
        .range(d3.schemeSet1);

    const cols = 3;
    const cellW = 290;
    const cellH = 220;
    const cellMargin = { top: 48, right: 20, bottom: 48, left: 58 };
    const innerW = cellW - cellMargin.left - cellMargin.right;
    const innerH = cellH - cellMargin.top  - cellMargin.bottom;
    const gapX   = 24;
    const gapY   = 44;
    const leftPad  = 38;
    const topPad   = 52;

    const rows      = Math.ceil(topGenres.length / cols);
    const svgWidth  = cols * cellW + (cols - 1) * gapX + leftPad + 20;
    const legendH   = 50;
    const svgHeight = topPad + rows * cellH + (rows - 1) * gapY + legendH + 20;

    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    svg.append("text")
        .attr("x", svgWidth / 2)
        .attr("y", 28)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("font-weight", "bold")
        .text("Small Multiples \u2014 Video Game Sales by Genre (2000\u20132018)");

    const scaleX = d3.scaleTime()
        .domain([new Date(2000, 0, 1), new Date(2018, 0, 1)])
        .range([0, innerW]);

    const bisect = d3.bisector(d => d.year).left;

    const tooltip = d3.select("body").append("div")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("padding", "7px 10px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("display", "none")
        .style("box-shadow", "0 2px 5px rgba(0,0,0,0.12)");

    series.forEach(function(s, i) {
        const col = i % cols;
        const row = Math.floor(i / cols);

        const cellX = leftPad + col * (cellW + gapX);
        const cellY = topPad  + row * (cellH + gapY);

        const tx = cellX + cellMargin.left;
        const ty = cellY + cellMargin.top;

        const maxSales = d3.max(s.values, d => d.sales);
        const scaleY = d3.scaleLinear()
            .domain([0, maxSales * 1.18])
            .nice()
            .range([innerH, 0]);

        const panel = svg.append("g")
            .attr("transform", `translate(${tx},${ty})`);

        panel.append("rect")
            .attr("width", innerW)
            .attr("height", innerH)
            .attr("fill", "#f7f7f7")
            .attr("stroke", "#ddd");

        panel.append("g")
            .attr("transform", `translate(0,${innerH})`)
            .call(d3.axisBottom(scaleX)
                .ticks(d3.timeYear.every(4))
                .tickFormat(d3.timeFormat("%Y")));

        panel.append("g")
            .call(d3.axisLeft(scaleY).ticks(4).tickFormat(d => d + "M"));

        panel.append("text")
            .attr("x", innerW / 2)
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .attr("font-size", "13px")
            .attr("font-weight", "bold")
            .attr("fill", colorScale(s.genre))
            .text(s.genre);

        const lineGen = d3.line()
            .x(d => scaleX(d.year))
            .y(d => scaleY(d.sales))
            .curve(d3.curveMonotoneX);

        panel.append("path")
            .datum(s.values)
            .attr("fill", "none")
            .attr("stroke", colorScale(s.genre))
            .attr("stroke-width", 2)
            .attr("d", lineGen);

        const guideLine = panel.append("line")
            .attr("stroke", "#aaa")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "3,3")
            .attr("y1", 0)
            .attr("y2", innerH)
            .style("display", "none");

        const dot = panel.append("circle")
            .attr("r", 4)
            .attr("fill", colorScale(s.genre))
            .attr("stroke", "white")
            .attr("stroke-width", 1.5)
            .style("display", "none");

        panel.append("rect")
            .attr("width", innerW)
            .attr("height", innerH)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .on("mousemove", function(event) {
                const [mx] = d3.pointer(event);
                const mouseDate = scaleX.invert(mx);

                let idx = bisect(s.values, mouseDate);
                if (idx > 0 && idx < years.length) {
                    const before = s.values[idx - 1].year;
                    const after  = s.values[idx].year;
                    idx = mouseDate - before < after - mouseDate ? idx - 1 : idx;
                }
                idx = Math.max(0, Math.min(idx, years.length - 1));
                const pt = s.values[idx];

                guideLine
                    .attr("x1", scaleX(pt.year))
                    .attr("x2", scaleX(pt.year))
                    .style("display", null);

                dot
                    .attr("cx", scaleX(pt.year))
                    .attr("cy", scaleY(pt.sales))
                    .style("display", null);

                tooltip
                    .style("display", null)
                    .style("left", (event.pageX + 14) + "px")
                    .style("top",  (event.pageY - 36) + "px")
                    .html(`<strong style="color:${colorScale(s.genre)}">${s.genre}</strong><br/>${pt.yr}: ${pt.sales.toFixed(2)}M`);
            })
            .on("mouseleave", function() {
                guideLine.style("display", "none");
                dot.style("display", "none");
                tooltip.style("display", "none");
            });
    });

    const legend = d3.legendColor()
        .shapeWidth(14)
        .shapeHeight(14)
        .shapePadding(55)
        .orient("horizontal")
        .title("Genre")
        .scale(colorScale);

    svg.append("g")
        .attr("transform", `translate(${leftPad}, ${svgHeight - legendH + 4})`)
        .call(legend);

});
