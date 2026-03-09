// line chart - games.csv
// x = year, y = total sales per year per genre
// top 6 genres as separate lines, ColorBrewer Set1 qualitative scale

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
                    sales: salesByYearGenre[yr + "_" + genre] || 0
                };
            })
        };
    });

    const svgWidth = 1000;
    const svgHeight = 560;
    const margin = { top: 80, right: 200, bottom: 65, left: 80 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const scaleX = d3.scaleTime()
        .domain([new Date(2000, 0, 1), new Date(2018, 0, 1)])
        .range([0, width]);

    const maxSales = d3.max(series, s => d3.max(s.values, d => d.sales));
    const scaleY = d3.scaleLinear()
        .domain([0, maxSales * 1.1])
        .nice()
        .range([height, 0]);

    const colorScale = d3.scaleOrdinal()
        .domain(topGenres)
        .range(d3.schemeSet1);

    chart.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(scaleX).ticks(d3.timeYear.every(2)).tickFormat(d3.timeFormat("%Y")));

    chart.append("text")
        .attr("x", width / 2)
        .attr("y", height + 50)
        .attr("text-anchor", "middle")
        .text("Year");

    chart.append("g")
        .call(d3.axisLeft(scaleY).ticks(8).tickFormat(d => d + "M"));

    chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", -62)
        .attr("text-anchor", "middle")
        .text("Total Sales of Games Released That Year (Millions)");

    chart.append("text")
        .attr("x", width / 2)
        .attr("y", -45)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("font-weight", "bold")
        .text("Video Game Sales Trends by Genre (2000\u20132018)");

    chart.append("text")
        .attr("x", width / 2)
        .attr("y", -22)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#777")
        .text("Color = genre — Qualitative ColorBrewer Set1 scale");

    const lineGen = d3.line()
        .x(d => scaleX(d.year))
        .y(d => scaleY(d.sales));

    series.forEach(function(s) {
        chart.append("path")
            .datum(s.values)
            .attr("fill", "none")
            .attr("stroke", colorScale(s.genre))
            .attr("stroke-width", 2.5)
            .attr("d", lineGen);
    });

    const legend = d3.legendColor()
        .shapeWidth(25)
        .shapeHeight(3)
        .orient("vertical")
        .title("Genre")
        .scale(colorScale);

    svg.append("g")
        .attr("transform", `translate(${svgWidth - margin.right + 18}, ${margin.top + 20})`)
        .call(legend);

});
