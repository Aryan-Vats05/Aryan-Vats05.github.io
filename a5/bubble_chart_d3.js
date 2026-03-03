// bubble chart - games.csv
// x = avg critic score, y = total sales, size = # platforms, color = genre

d3.csv("games.csv", d3.autoType).then(function(data) {

    // games.csv has one row per platform per game, so group by title first
    let byTitle = {};
    data.forEach(function(d) {
        const t = d.title;
        if (!byTitle[t]) {
            byTitle[t] = { title: t, genre: d.genre, publisher: d.publisher,
                           total_sales: 0, scores: [], consoles: [] };
        }
        byTitle[t].total_sales += (d.total_sales || 0);
        if (d.critic_score !== null) byTitle[t].scores.push(d.critic_score);
        byTitle[t].consoles.push(d.console);
    });

    let games = Object.values(byTitle).map(function(g) {
        return {
            title: g.title,
            genre: g.genre,
            publisher: g.publisher,
            total_sales: g.total_sales,
            avg_critic: g.scores.length > 0 ? d3.mean(g.scores) : null,
            platform_count: g.consoles.length,
            consoles: [...new Set(g.consoles)].join(", ")
        };
    });

    games = games.filter(d => d.avg_critic !== null && d.total_sales > 0)
                 .sort((a, b) => b.total_sales - a.total_sales)
                 .slice(0, 200);

    const svgWidth = 1100;
    const svgHeight = 680;
    const margin = { top: 80, right: 260, bottom: 75, left: 90 };

    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const genres = [...new Set(games.map(d => d.genre))].sort();
    const colors = ["#4e79a7","#f28e2b","#e15759","#76b7b2","#59a14f","#edc948","#b07aa1",
                    "#ff9da7","#9c755f","#bab0ac","#86bcb6","#d4a6c8","#f1ce63","#a0cbe8","#ffbe7d"];
    const colorScale = d3.scaleOrdinal().domain(genres).range(colors);

    const sizeScale = d3.scaleSqrt()
        .domain([1, d3.max(games, d => d.platform_count)])
        .range([4, 22]);

    const scaleX = d3.scaleLinear()
        .domain([d3.min(games, d => d.avg_critic) - 0.5, 10.3])
        .range([0, width]);

    const scaleY = d3.scaleLinear()
        .domain([0, d3.max(games, d => d.total_sales) * 1.1])
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
        .text("Top 200 Video Games: Critic Score vs. Total Sales");

    chart.append("text")
        .attr("x", width / 2)
        .attr("y", -22)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#777")
        .text("Size = # of platforms | Color = genre");

    const tooltip = d3.select("#tooltip")
        .style("position", "absolute")
        .style("pointer-events", "none")
        .style("opacity", 0);

    function drawBubbles(filteredGames) {
        chart.selectAll("circle.bubble").remove();

        chart.selectAll("circle.bubble")
            .data(filteredGames)
            .enter()
            .append("circle")
            .attr("class", "bubble")
            .attr("cx", d => scaleX(d.avg_critic))
            .attr("cy", d => scaleY(d.total_sales))
            .attr("r", d => sizeScale(d.platform_count))
            .attr("fill", d => colorScale(d.genre))
            .attr("opacity", 0.7)
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .on("mouseover", function(_event, d) {
                d3.select(this).raise().attr("opacity", 1).attr("stroke", "#333").attr("stroke-width", 2);
                tooltip.style("opacity", 1).html(`<b>${d.title}</b><br>Genre: ${d.genre}<br>Publisher: ${d.publisher}<br>Critic Score: ${d.avg_critic.toFixed(1)} / 10<br>Total Sales: ${d.total_sales.toFixed(2)}M<br>Platforms (${d.platform_count}): ${d.consoles}`);
            })
            .on("mousemove", function(event) {
                tooltip.style("left", event.pageX + 12 + "px").style("top", event.pageY - 30 + "px");
            })
            .on("mouseout", function() {
                d3.select(this).attr("opacity", 0.7).attr("stroke", "white").attr("stroke-width", 1);
                tooltip.style("opacity", 0);
            });
    }

    drawBubbles(games);

    const legendG = chart.append("g").attr("transform", `translate(${width + 20}, 0)`);

    legendG.append("text").attr("y", -8).attr("font-size", "13px").attr("font-weight", "bold").text("Genre");

    genres.forEach(function(genre, i) {
        const row = legendG.append("g").attr("transform", `translate(0, ${i * 22 + 20})`);
        row.append("circle").attr("cx", 7).attr("r", 7).attr("fill", colorScale(genre));
        row.append("text").attr("x", 20).attr("y", 4).attr("font-size", "12px").text(genre);
    });

});
