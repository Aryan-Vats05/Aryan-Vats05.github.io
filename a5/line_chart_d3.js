// line chart - games.csv
// x = year (time axis), y = total sales per year per genre
// shows top 6 genres as separate lines

d3.csv("games.csv", d3.autoType).then(function(data) {

    // extract year from release_date string (format M/D/YYYY)
    data.forEach(function(d) {
        if (d.release_date) {
            const parts = d.release_date.split("/");
            d.release_year = parts.length === 3 ? +parts[2] : null;
        } else {
            d.release_year = null;
        }
    });

    // only keep rows with a valid year in range and nonzero sales
    const filtered = data.filter(d => d.release_year >= 2000 && d.release_year <= 2018 && d.total_sales > 0);

    // figure out which 6 genres sold the most overall
    let genreSums = {};
    filtered.forEach(function(d) {
        genreSums[d.genre] = (genreSums[d.genre] || 0) + d.total_sales;
    });
    const topGenres = Object.entries(genreSums)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(d => d[0]);

    // sum sales by year and genre for the top 6 genres
    let salesByYearGenre = {};
    filtered.filter(d => topGenres.includes(d.genre)).forEach(function(d) {
        const key = d.release_year + "_" + d.genre;
        salesByYearGenre[key] = (salesByYearGenre[key] || 0) + d.total_sales;
    });

    const years = d3.range(2000, 2019);

    // build one array of {year, sales} per genre
    const series = topGenres.map(function(genre) {
        return {
            genre: genre,
            values: years.map(function(yr) {
                return {
                    year: new Date(yr, 0, 1),
                    sales: salesByYearGenre[yr + "_" + genre] || 0,
                    yr: yr
                };
            })
        };
    });

    const svgWidth = 1000;
    const svgHeight = 560;
    const margin = { top: 80, right: 175, bottom: 65, left: 80 };

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
        .range(d3.schemeTableau10);

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
        .text("Total lifetime sales of games released each year, by genre");

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

    const legendG = chart.append("g").attr("transform", `translate(${width + 18}, 20)`);

    legendG.append("text").attr("font-size", "13px").attr("font-weight", "bold").text("Genre");

    topGenres.forEach(function(genre, i) {
        const g = legendG.append("g").attr("transform", `translate(0, ${i * 27 + 20})`);
        g.append("line").attr("x1", 0).attr("y1", 0).attr("x2", 25).attr("y2", 0)
         .attr("stroke", colorScale(genre)).attr("stroke-width", 2.5);
        g.append("circle").attr("cx", 12).attr("cy", 0).attr("r", 5)
         .attr("fill", colorScale(genre)).attr("stroke", "white").attr("stroke-width", 1.5);
        g.append("text").attr("x", 32).attr("y", 4).attr("font-size", "12px").text(genre);
    });

});
