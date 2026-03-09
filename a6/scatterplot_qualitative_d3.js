// scatterplot - games.csv
// x = avg critic score, y = total sales, color = genre (qualitative)
// aggregated by title, ColorBrewer Paired scale

d3.csv("games.csv", d3.autoType).then(function(data) {

    let byTitle = {};
    data.forEach(function(d) {
        if (!byTitle[d.title]) {
            byTitle[d.title] = { title: d.title, genre: d.genre, total_sales: 0, scores: [] };
        }
        byTitle[d.title].total_sales += (d.total_sales || 0);
        if (d.critic_score !== null) byTitle[d.title].scores.push(d.critic_score);
    });

    const games = Object.values(byTitle).map(function(g) {
        return {
            title: g.title,
            genre: g.genre,
            total_sales: g.total_sales,
            avg_critic: g.scores.length > 0 ? d3.mean(g.scores) : null
        };
    }).filter(d => d.avg_critic !== null && d.total_sales > 0);

    const genres = [...new Set(games.map(d => d.genre))].sort();

    const colorScale = d3.scaleOrdinal()
        .domain(genres)
        .range(d3.schemePaired);

    const svgWidth = 1100;
    const svgHeight = 620;
    const margin = { top: 80, right: 220, bottom: 70, left: 90 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const scaleX = d3.scaleLinear()
        .domain([d3.min(games, d => d.avg_critic) - 0.3, 10.3])
        .range([0, width]);

    const scaleY = d3.scaleLinear()
        .domain([0, d3.max(games, d => d.total_sales) * 1.1])
        .nice()
        .range([height, 0]);

    chart.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(scaleX).ticks(10));

    chart.append("text")
        .attr("x", width / 2)
        .attr("y", height + 50)
        .attr("text-anchor", "middle")
        .text("Average Critic Score (out of 10)");

    chart.append("g")
        .call(d3.axisLeft(scaleY).ticks(8).tickFormat(d => d + "M"));

    chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", -70)
        .attr("text-anchor", "middle")
        .text("Total Sales Across All Platforms (Millions)");

    chart.append("text")
        .attr("x", width / 2)
        .attr("y", -45)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("font-weight", "bold")
        .text("Video Game Sales vs. Critic Score by Genre");

    chart.append("text")
        .attr("x", width / 2)
        .attr("y", -22)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#777")
        .text("Color = genre — Qualitative ColorBrewer Paired scale");

    chart.selectAll("circle")
        .data(games)
        .enter()
        .append("circle")
        .attr("cx", d => scaleX(d.avg_critic))
        .attr("cy", d => scaleY(d.total_sales))
        .attr("r", 5)
        .attr("fill", d => colorScale(d.genre))
        .attr("opacity", 0.7)
        .attr("stroke", "white")
        .attr("stroke-width", 0.5);

    const legend = d3.legendColor()
        .shapeWidth(15)
        .shapeHeight(15)
        .orient("vertical")
        .title("Genre")
        .scale(colorScale);

    svg.append("g")
        .attr("transform", `translate(${svgWidth - margin.right + 20}, ${margin.top})`)
        .call(legend);

});
