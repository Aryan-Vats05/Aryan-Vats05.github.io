d3.csv("network.csv").then(function(data) {

    const nodesData = data.filter(function(d) { return d.dataset === "2" && d.type === "node"; });
    const edgesData = data.filter(function(d) { return d.dataset === "2" && d.type === "edge"; });

    const colorMap = { A: "#4e79a7", B: "#f28e2b" };

    const fWidth = 500, fHeight = 500;

    const fSvg = d3.select("#force-container")
        .append("svg")
        .attr("width", fWidth)
        .attr("height", fHeight)
        .style("border", "1px solid #ddd");

    const fG = fSvg.append("g");

    fSvg.call(d3.zoom().scaleExtent([0.5, 5]).on("zoom", function(e) {
        fG.attr("transform", e.transform);
    }));

    const links = edgesData.map(function(d) {
        return { source: d.source, target: d.target };
    });

    const sim = d3.forceSimulation(nodesData)
        .force("link", d3.forceLink(links).id(function(d) { return d.id; }).distance(50))
        .force("charge", d3.forceManyBody().strength(-120))
        .force("center", d3.forceCenter(fWidth / 2, fHeight / 2));

    const fLink = fG.append("g")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke", "#aaa")
        .attr("stroke-width", 1);

    const fTooltip = d3.select("body").append("div")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("padding", "5px 10px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("display", "none")
        .style("box-shadow", "0 2px 6px rgba(0,0,0,0.1)");

    const fNode = fG.append("g")
        .selectAll("circle")
        .data(nodesData)
        .join("circle")
        .attr("r", 10)
        .attr("fill", function(d) { return colorMap[d.group]; })
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .on("mouseover", function(event, d) {
            d3.select(this).attr("r", 13);
            fTooltip.style("display", null)
                .html(d.name + " (Group " + d.group + ")")
                .style("left", (event.pageX + 12) + "px")
                .style("top", (event.pageY - 24) + "px");
        })
        .on("mousemove", function(event) {
            fTooltip.style("left", (event.pageX + 12) + "px")
                .style("top", (event.pageY - 24) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).attr("r", 10);
            fTooltip.style("display", "none");
        })
        .call(d3.drag()
            .on("start", function(event, d) {
                if (!event.active) sim.alphaTarget(0.3).restart();
                d.fx = d.x; d.fy = d.y;
            })
            .on("drag", function(event, d) {
                d.fx = event.x; d.fy = event.y;
            })
            .on("end", function(event, d) {
                if (!event.active) sim.alphaTarget(0);
                d.fx = null; d.fy = null;
            })
        );

    const fLabels = fG.append("g")
        .selectAll("text")
        .data(nodesData)
        .join("text")
        .attr("font-size", "9px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("fill", "#fff")
        .attr("pointer-events", "none")
        .text(function(d) { return d.id; });

    sim.on("tick", function() {
        fLink
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
        fNode.attr("cx", function(d) { return d.x; }).attr("cy", function(d) { return d.y; });
        fLabels.attr("x", function(d) { return d.x; }).attr("y", function(d) { return d.y; });
    });

    const adjacency = new Set();
    edgesData.forEach(function(d) {
        adjacency.add(d.source + "," + d.target);
        adjacency.add(d.target + "," + d.source);
    });

    const cellSize = 16;
    const mN = nodesData.length;
    const mMargin = { top: 60, right: 20, bottom: 20, left: 60 };
    const mSize = mN * cellSize;

    const mSvg = d3.select("#matrix-container")
        .append("svg")
        .attr("width", mSize + mMargin.left + mMargin.right)
        .attr("height", mSize + mMargin.top + mMargin.bottom);

    const mG = mSvg.append("g")
        .attr("transform", "translate(" + mMargin.left + "," + mMargin.top + ")");

    const mTooltip = d3.select("body").append("div")
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
            mG.append("rect")
                .attr("x", j * cellSize)
                .attr("y", i * cellSize)
                .attr("width", cellSize - 1)
                .attr("height", cellSize - 1)
                .attr("fill", connected ? colorMap[rowNode.group] : (i === j ? "#888" : "#eee"));
        });
    });

    const rowHighlight = mG.append("rect")
        .attr("x", 0).attr("width", mSize).attr("height", cellSize)
        .attr("fill", "#59a14f").attr("opacity", 0).attr("pointer-events", "none");

    const colHighlight = mG.append("rect")
        .attr("y", 0).attr("height", mSize).attr("width", cellSize)
        .attr("fill", "#59a14f").attr("opacity", 0).attr("pointer-events", "none");

    const mOverlay = mG.append("g");
    nodesData.forEach(function(rowNode, i) {
        nodesData.forEach(function(colNode, j) {
            const connected = adjacency.has(rowNode.id + "," + colNode.id);
            mOverlay.append("rect")
                .attr("x", j * cellSize)
                .attr("y", i * cellSize)
                .attr("width", cellSize - 1)
                .attr("height", cellSize - 1)
                .attr("fill", "transparent")
                .on("mouseover", function(event) {
                    rowHighlight.attr("y", i * cellSize).attr("opacity", 0.35);
                    colHighlight.attr("x", j * cellSize).attr("opacity", 0.35);
                    mTooltip.style("display", null)
                        .html("<strong>" + rowNode.name + "</strong> \u2014 <strong>" + colNode.name + "</strong>" + (connected ? "<br/>Connected" : ""))
                        .style("left", (event.pageX + 12) + "px")
                        .style("top", (event.pageY - 24) + "px");
                })
                .on("mousemove", function(event) {
                    mTooltip.style("left", (event.pageX + 12) + "px")
                        .style("top", (event.pageY - 24) + "px");
                })
                .on("mouseout", function() {
                    rowHighlight.attr("opacity", 0);
                    colHighlight.attr("opacity", 0);
                    mTooltip.style("display", "none");
                });
        });
    });

    nodesData.forEach(function(d, i) {
        mG.append("text")
            .attr("x", -4).attr("y", i * cellSize + cellSize / 2)
            .attr("text-anchor", "end").attr("dominant-baseline", "middle")
            .attr("font-size", "9px").text(d.id);
    });

    nodesData.forEach(function(d, j) {
        mG.append("text")
            .attr("transform", "translate(" + (j * cellSize + cellSize / 2) + ", -4) rotate(-60)")
            .attr("text-anchor", "start").attr("font-size", "9px").text(d.id);
    });

});
