// bar chart - games.csv
// x = genre, y = total sales
// color = sequential ColorBrewer YlOrRd scale based on total sales

d3.csv("games.csv", d3.autoType).then(function(data) {

    let genreSales = {};
    data.forEach(function(d) {
        if (d.total_sales > 0 && d.genre) {
            genreSales[d.genre] = (genreSales[d.genre] || 0) + d.total_sales;
        }
    });

    const genres = Object.entries(genreSales)
        .map(d => ({ genre: d[0], sales: d[1] }))
        .sort((a, b) => b.sales - a.sales);

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

    const maxSales = d3.max(genres, d => d.sales);
    const scaleY = d3.scaleLinear()
        .domain([0, maxSales * 1.1])
        .nice()
        .range([height, 0]);

    const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
        .domain([0, maxSales]);

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
        .call(d3.axisLeft(scaleY).ticks(8).tickFormat(d => d + "M"));

    chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", -62)
        .attr("text-anchor", "middle")
        .text("Total Sales (Millions)");

    chart.append("text")
        .attr("x", width / 2)
        .attr("y", -45)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("font-weight", "bold")
        .text("Total Video Game Sales by Genre");

    chart.append("text")
        .attr("x", width / 2)
        .attr("y", -22)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#777")
        .text("Color encodes total sales — Sequential YlOrRd ColorBrewer scale");

    chart.selectAll("rect")
        .data(genres)
        .enter()
        .append("rect")
        .attr("x", d => scaleX(d.genre))
        .attr("y", d => scaleY(d.sales))
        .attr("width", scaleX.bandwidth())
        .attr("height", d => height - scaleY(d.sales))
        .attr("fill", d => colorScale(d.sales));

    const legend = d3.legendColor()
        .shapeWidth(20)
        .shapeHeight(15)
        .cells(7)
        .orient("vertical")
        .title("Total Sales (M)")
        .scale(colorScale);

    svg.append("g")
        .attr("transform", `translate(${svgWidth - margin.right + 20}, ${margin.top})`)
        .call(legend);

});
