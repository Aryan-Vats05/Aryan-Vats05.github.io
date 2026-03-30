d3.csv("network.csv").then(function(data) {

    const nodesData = data.filter(function(d) { return d.dataset === "1" && d.type === "node"; });
    const edgesData = data.filter(function(d) { return d.dataset === "1" && d.type === "edge"; });

    const width = 860, height = 860;
    const radius = 320;

    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const g = svg.append("g")
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

    const hierarchy = {
        name: "root",
        children: nodesData.map(function(n) { return { name: n.id, data: n }; })
    };

    const root = d3.hierarchy(hierarchy);
    d3.cluster().size([2 * Math.PI, radius])(root);

    const nodeById = {};
    root.leaves().forEach(function(d) { nodeById[d.data.name] = d; });

    const filteredEdges = edgesData.filter(function(e) {
        return nodeById[e.source] && nodeById[e.target];
    });

    const linkGroup = g.append("g");
    const nodeGroup = g.append("g");

    function drawLinks(tension) {
        const line = d3.lineRadial()
            .curve(d3.curveBundle.beta(tension))
            .radius(function(d) { return d.y; })
            .angle(function(d) { return d.x; });

        linkGroup.selectAll("path")
            .data(filteredEdges)
            .join("path")
            .attr("d", function(d) { return line(nodeById[d.source].path(nodeById[d.target])); })
            .attr("fill", "none")
            .attr("stroke", "#4e79a7")
            .attr("stroke-width", 1)
            .attr("stroke-opacity", 0.4)
            .attr("class", "edge-path");
    }

    drawLinks(0.85);

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

    nodeGroup.selectAll("circle")
        .data(root.leaves())
        .join("circle")
        .attr("transform", function(d) {
            return "rotate(" + (d.x * 180 / Math.PI - 90) + ") translate(" + d.y + ",0)";
        })
        .attr("r", 5)
        .attr("fill", "#4e79a7")
        .on("mouseover", function(event, d) {
            const id = d.data.name;
            d3.select(this).attr("fill", "#f28e2b").attr("r", 8);
            tooltip.style("display", null)
                .html(d.data.data.name)
                .style("left", (event.pageX + 12) + "px")
                .style("top", (event.pageY - 24) + "px");
            linkGroup.selectAll(".edge-path")
                .attr("stroke-opacity", function(e) { return (e.source === id || e.target === id) ? 0.9 : 0.04; })
                .attr("stroke", function(e) { return (e.source === id || e.target === id) ? "#f28e2b" : "#4e79a7"; })
                .attr("stroke-width", function(e) { return (e.source === id || e.target === id) ? 2 : 1; });
        })
        .on("mouseout", function() {
            d3.select(this).attr("fill", "#4e79a7").attr("r", 5);
            tooltip.style("display", "none");
            linkGroup.selectAll(".edge-path")
                .attr("stroke-opacity", 0.4)
                .attr("stroke", "#4e79a7")
                .attr("stroke-width", 1);
        });

    nodeGroup.selectAll("text")
        .data(root.leaves())
        .join("text")
        .attr("dy", "0.31em")
        .attr("transform", function(d) {
            return "rotate(" + (d.x * 180 / Math.PI - 90) + ") translate(" + (d.y + 10) + ",0)" + (d.x >= Math.PI ? " rotate(180)" : "");
        })
        .attr("text-anchor", function(d) { return d.x >= Math.PI ? "end" : "start"; })
        .attr("font-size", "11px")
        .attr("fill", "#333")
        .text(function(d) {
            const name = d.data.data.name;
            return name.length > 18 ? name.slice(0, 16) + "\u2026" : name;
        });

    d3.select("#tension-slider").on("input", function() {
        const val = +this.value;
        d3.select("#tension-value").text(val.toFixed(2));
        drawLinks(val);
    });

});
