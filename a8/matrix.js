d3.csv("network.csv").then(function(data) {

    const nodesData = data.filter(function(d) { return d.dataset === "1" && d.type === "node"; });
    const edgesData = data.filter(function(d) { return d.dataset === "1" && d.type === "edge"; });

    const adjacency = new Set();
    edgesData.forEach(function(d) {
        adjacency.add(d.source + "," + d.target);
        adjacency.add(d.target + "," + d.source);
    });

    const cellSize = 28;
    const N = nodesData.length;
    const margin = { top: 160, right: 20, bottom: 20, left: 170 };
    const size = N * cellSize;

    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", size + margin.left + margin.right)
        .attr("height", size + margin.top + margin.bottom);

    const g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const tooltip = d3.select("body").append("div")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("padding", "5px 10px")
        .style("font-size", "11px")
        .style("pointer-events", "none")
        .style("display", "none")
        .style("box-shadow", "0 2px 6px rgba(0,0,0,0.1)");

    nodesData.forEach(function(rowNode, i) {
        nodesData.forEach(function(colNode, j) {
            const connected = adjacency.has(rowNode.id + "," + colNode.id);
            g.append("rect")
                .attr("x", j * cellSize)
                .attr("y", i * cellSize)
                .attr("width", cellSize - 1)
                .attr("height", cellSize - 1)
                .attr("fill", connected ? "#4e79a7" : (i === j ? "#888" : "#eee"));
        });
    });

    const rowHighlight = g.append("rect")
        .attr("x", 0).attr("width", size).attr("height", cellSize)
        .attr("fill", "#f28e2b").attr("opacity", 0).attr("pointer-events", "none");

    const colHighlight = g.append("rect")
        .attr("y", 0).attr("height", size).attr("width", cellSize)
        .attr("fill", "#f28e2b").attr("opacity", 0).attr("pointer-events", "none");

    const overlay = g.append("g");
    nodesData.forEach(function(rowNode, i) {
        nodesData.forEach(function(colNode, j) {
            const connected = adjacency.has(rowNode.id + "," + colNode.id);
            overlay.append("rect")
                .attr("x", j * cellSize)
                .attr("y", i * cellSize)
                .attr("width", cellSize - 1)
                .attr("height", cellSize - 1)
                .attr("fill", "transparent")
                .on("mouseover", function(event) {
                    rowHighlight.attr("y", i * cellSize).attr("opacity", 0.3);
                    colHighlight.attr("x", j * cellSize).attr("opacity", 0.3);
                    tooltip.style("display", null)
                        .html("<strong>" + rowNode.name + "</strong> \u2014 <strong>" + colNode.name + "</strong>" + (connected ? "<br/>Connected" : ""))
                        .style("left", (event.pageX + 12) + "px")
                        .style("top", (event.pageY - 24) + "px");
                })
                .on("mousemove", function(event) {
                    tooltip.style("left", (event.pageX + 12) + "px")
                        .style("top", (event.pageY - 24) + "px");
                })
                .on("mouseout", function() {
                    rowHighlight.attr("opacity", 0);
                    colHighlight.attr("opacity", 0);
                    tooltip.style("display", "none");
                });
        });
    });

    nodesData.forEach(function(d, i) {
        g.append("text")
            .attr("x", -6)
            .attr("y", i * cellSize + cellSize / 2)
            .attr("text-anchor", "end")
            .attr("dominant-baseline", "middle")
            .attr("font-size", "11px")
            .text(d.name.length > 18 ? d.name.slice(0, 16) + "\u2026" : d.name);
    });

    nodesData.forEach(function(d, j) {
        g.append("text")
            .attr("transform", "translate(" + (j * cellSize + cellSize / 2) + ", -6) rotate(-55)")
            .attr("text-anchor", "start")
            .attr("font-size", "11px")
            .text(d.name.length > 18 ? d.name.slice(0, 16) + "\u2026" : d.name);
    });

});
