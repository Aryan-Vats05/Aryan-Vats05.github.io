// scatterplot matrix - games.csv
// 3x3 matrix: critic score vs total sales vs release year
// top 500 games aggregated by title

d3.csv("games.csv", d3.autoType).then(function(data) {

    // release_date is M/D/YYYY so need to extract year manually
    data.forEach(function(d) {
        if (d.release_date) {
            const p = d.release_date.split("/");
            d.release_year = p.length === 3 ? +p[2] : null;
        } else {
            d.release_year = null;
        }
    });

    // same aggregation approach as the bubble chart
    let byTitle = {};
    data.forEach(function(d) {
        const t = d.title;
        if (!byTitle[t]) {
            byTitle[t] = { title: t, genre: d.genre, total_sales: 0,
                           scores: [], release_year: null };
        }
        byTitle[t].total_sales += (d.total_sales || 0);
        if (d.critic_score !== null) byTitle[t].scores.push(d.critic_score);
        if (d.release_year && (byTitle[t].release_year === null || d.release_year < byTitle[t].release_year)) {
            byTitle[t].release_year = d.release_year;
        }
    });

    let allGames = Object.values(byTitle).map(function(g) {
        return {
            title: g.title,
            genre: g.genre,
            total_sales: g.total_sales,
            avg_critic: g.scores.length > 0 ? d3.mean(g.scores) : null,
            release_year: g.release_year
        };
    });

    allGames = allGames.filter(d => d.avg_critic !== null && d.total_sales > 0 &&
                                    d.release_year !== null && d.release_year >= 1990)
                       .sort((a, b) => b.total_sales - a.total_sales)
                       .slice(0, 500);

    const cols = ["avg_critic", "total_sales", "release_year"];
    const colLabels = { avg_critic: "Critic Score", total_sales: "Total Sales (M)", release_year: "Release Year" };
    const N = cols.length;
    const cellSize = 185;
    const pad = 25;

    const genres = [...new Set(allGames.map(d => d.genre))].sort();
    const colorPalette = ["#4e79a7","#f28e2b","#e15759","#76b7b2","#59a14f","#edc948","#b07aa1",
                          "#ff9da7","#9c755f","#bab0ac","#86bcb6","#d4a6c8","#f1ce63","#a0cbe8","#ffbe7d"];
    const colorScale = d3.scaleOrdinal().domain(genres).range(colorPalette);

    const svgWidth = N * cellSize + 80 + 160;
    const svgHeight = N * cellSize + 95 + 50;
    const margin = { top: 95, right: 160, bottom: 50, left: 80 };

    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // one x and y scale per variable
    const xScales = {}, yScales = {};
    cols.forEach(function(v) {
        const ext = d3.extent(allGames, d => d[v]);
        xScales[v] = d3.scaleLinear().domain(ext).nice().range([pad / 2, cellSize - pad / 2]);
        yScales[v] = d3.scaleLinear().domain(ext).nice().range([cellSize - pad / 2, pad / 2]);
    });

    // x-axis along the bottom row
    cols.forEach(function(varX, j) {
        chart.append("g")
            .attr("transform", `translate(${j * cellSize}, ${N * cellSize})`)
            .call(d3.axisBottom(xScales[varX]).ticks(5));
        chart.append("text")
            .attr("x", j * cellSize + cellSize / 2)
            .attr("y", N * cellSize + 40)
            .attr("text-anchor", "middle")
            .attr("font-size", "11px")
            .text(colLabels[varX]);
    });

    // y-axis along the left column
    cols.forEach(function(varY, i) {
        chart.append("g")
            .attr("transform", `translate(0, ${i * cellSize})`)
            .call(d3.axisLeft(yScales[varY]).ticks(5));
        chart.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -(i * cellSize + cellSize / 2))
            .attr("y", -62)
            .attr("text-anchor", "middle")
            .attr("font-size", "11px")
            .text(colLabels[varY]);
    });

    // draw all 9 cells
    for (let row = 0; row < N; row++) {
        for (let col = 0; col < N; col++) {
            const isDiag = row === col;
            const cellG = chart.append("g")
                .attr("transform", `translate(${col * cellSize}, ${row * cellSize})`);

            cellG.append("rect")
                .attr("x", pad / 2).attr("y", pad / 2)
                .attr("width", cellSize - pad).attr("height", cellSize - pad)
                .attr("fill", isDiag ? "#f0f4f8" : "white")
                .attr("stroke", "#ccc").attr("stroke-width", 1);

            if (isDiag) {
                cellG.append("text")
                    .attr("x", cellSize / 2).attr("y", cellSize / 2)
                    .attr("text-anchor", "middle").attr("dominant-baseline", "middle")
                    .attr("font-size", "13px").attr("font-weight", "bold")
                    .text(colLabels[cols[row]]);
            } else {
                const varX = cols[col];
                const varY = cols[row];

                cellG.append("g")
                    .attr("class", "dots-" + row + "-" + col)
                    .selectAll("circle")
                    .data(allGames)
                    .enter()
                    .append("circle")
                    .attr("cx", d => xScales[varX](d[varX]))
                    .attr("cy", d => yScales[varY](d[varY]))
                    .attr("r", 2.5)
                    .attr("fill", d => colorScale(d.genre))
                    .attr("opacity", 0.5);
            }
        }
    }

    chart.append("text")
        .attr("x", (N * cellSize) / 2).attr("y", -58)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px").attr("font-weight", "bold")
        .text("Video Game Statistics: Scatterplot Matrix");

    chart.append("text")
        .attr("x", (N * cellSize) / 2).attr("y", -35)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px").attr("fill", "#777")
        .text("Top 500 games by total sales \u2013 colored by genre");

    // small color legend on the right
    const legendG = chart.append("g").attr("transform", `translate(${N * cellSize + 16}, 0)`);
    legendG.append("text").attr("font-size", "12px").attr("font-weight", "bold").text("Genre");
    genres.forEach(function(genre, i) {
        const g = legendG.append("g").attr("transform", `translate(0, ${i * 18 + 16})`);
        g.append("circle").attr("cx", 6).attr("cy", 0).attr("r", 5).attr("fill", colorScale(genre)).attr("opacity", 0.85);
        g.append("text").attr("x", 16).attr("y", 4).attr("font-size", "10px").text(genre);
    });

});
