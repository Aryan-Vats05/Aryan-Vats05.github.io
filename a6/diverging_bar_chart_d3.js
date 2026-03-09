// diverging bar chart - games.csv
// x = genre, y = avg critic score deviation from overall mean
// color = diverging ColorBrewer RdBu scale

d3.csv("games.csv", d3.autoType).then(function(data) {

    const filtered = data.filter(d => d.critic_score !== null && d.genre);
    const globalMean = d3.mean(filtered, d => d.critic_score);

    let byGenre = {};
    filtered.forEach(function(d) {
        if (!byGenre[d.genre]) byGenre[d.genre] = [];
        byGenre[d.genre].push(d.critic_score);
    });

    const genres = Object.entries(byGenre).map(function([genre, scores]) {
        const avg = d3.mean(scores);
        return { genre: genre, avg: avg, deviation: avg - globalMean };
    }).sort((a, b) => b.deviation - a.deviation);

    const svgWidth = 1000;
    const svgHeight = 520;
    const margin = { top: 80, right: 200, bottom: 100, left: 80 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const scaleX = d3.scaleBand()
        .domain(genres.map(d => d.genre))
        .range([0, width])
        .padding(0.2);

    const maxDev = d3.max(genres, d => Math.abs(d.deviation));
    const scaleY = d3.scaleLinear()
        .domain([-maxDev * 1.2, maxDev * 1.2])
        .nice()
        .range([height, 0]);

    const colorScale = d3.scaleDiverging(d3.interpolateRdBu)
        .domain([-maxDev, 0, maxDev]);

    chart.append("line")
        .attr("x1", 0).attr("x2", width)
        .attr("y1", scaleY(0)).attr("y2", scaleY(0))
        .attr("stroke", "#333").attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "4 2");

    chart.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(scaleX))
        .selectAll("text")
        .attr("transform", "rotate(-35)")
        .attr("text-anchor", "end")
        .attr("dx", "-0.5em")
        .attr("dy", "0.5em");

    chart.append("text")
        .attr("x", width / 2)
        .attr("y", height + 90)
        .attr("text-anchor", "middle")
        .text("Genre");

    chart.append("g")
        .call(d3.axisLeft(scaleY).ticks(8).tickFormat(d => d.toFixed(1)));

    chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", -62)
        .attr("text-anchor", "middle")
        .text("Avg Critic Score Deviation from Mean");

    chart.append("text")
        .attr("x", width / 2)
        .attr("y", -45)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("font-weight", "bold")
        .text("Critic Score Deviation by Genre");

    chart.append("text")
        .attr("x", width / 2)
        .attr("y", -22)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#777")
        .text(`Deviation from overall mean (${globalMean.toFixed(2)}) — Diverging RdBu ColorBrewer scale`);

    chart.selectAll("rect")
        .data(genres)
        .enter()
        .append("rect")
        .attr("x", d => scaleX(d.genre))
        .attr("y", d => d.deviation >= 0 ? scaleY(d.deviation) : scaleY(0))
        .attr("width", scaleX.bandwidth())
        .attr("height", d => Math.abs(scaleY(0) - scaleY(d.deviation)))
        .attr("fill", d => colorScale(d.deviation));

    const legendScale = d3.scaleSequential(d3.interpolateRdBu)
        .domain([-maxDev, maxDev]);

    const legend = d3.legendColor()
        .shapeWidth(20)
        .shapeHeight(15)
        .cells(7)
        .orient("vertical")
        .title("Score Deviation")
        .scale(legendScale);

    svg.append("g")
        .attr("transform", `translate(${svgWidth - margin.right + 20}, ${margin.top})`)
        .call(legend);

});
