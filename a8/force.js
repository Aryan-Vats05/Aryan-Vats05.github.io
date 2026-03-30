d3.csv("network.csv").then(function(data) {

    const nodesData = data.filter(function(d) { return d.dataset === "1" && d.type === "node"; });
    const edgesData = data.filter(function(d) { return d.dataset === "1" && d.type === "edge"; });

    const svgWidth = 960, svgHeight = 700;

    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .style("border", "1px solid #ddd");

    const g = svg.append("g");

    svg.call(d3.zoom().scaleExtent([0.2, 5]).on("zoom", function(e) {
        g.attr("transform", e.transform);
    }));

    const links = edgesData.map(function(d) {
        return { source: d.source, target: d.target };
    });

    const sim = d3.forceSimulation(nodesData)
        .force("link", d3.forceLink(links).id(function(d) { return d.id; }).distance(60))
        .force("charge", d3.forceManyBody().strength(-150))
        .force("center", d3.forceCenter(svgWidth / 2, svgHeight / 2))
        .force("collide", d3.forceCollide(10));

    const link = g.append("g")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke", "#aaa")
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 0.6);

    const tooltip = d3.select("body").append("div")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("padding", "5px 10px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("display", "none")
        .style("box-shadow", "0 2px 6px rgba(0,0,0,0.1)");

    const node = g.append("g")
        .selectAll("circle")
        .data(nodesData)
        .join("circle")
        .attr("r", 6)
        .attr("fill", "#4e79a7")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .on("mouseover", function(event, d) {
            d3.select(this).attr("fill", "#f28e2b").attr("r", 9);
            tooltip.style("display", null)
                .html(d.name)
                .style("left", (event.pageX + 12) + "px")
                .style("top", (event.pageY - 24) + "px");
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 12) + "px")
                .style("top", (event.pageY - 24) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).attr("fill", "#4e79a7").attr("r", 6);
            tooltip.style("display", "none");
        })
        .call(d3.drag()
            .on("start", function(event, d) {
                if (!event.active) sim.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on("drag", function(event, d) {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on("end", function(event, d) {
                if (!event.active) sim.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            })
        );

    const labels = g.append("g")
        .selectAll("text")
        .data(nodesData)
        .join("text")
        .attr("font-size", "9px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("fill", "#fff")
        .attr("pointer-events", "none")
        .text(function(d) { return d.name.length > 12 ? d.name.slice(0, 10) + "\u2026" : d.name; });

    sim.on("tick", function() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
        labels
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; });
    });

});
