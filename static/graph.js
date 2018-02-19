function showGraph(rnumber) {
    window.location.href = "#drawboard";
    d3.selectAll("svg > *").remove();

    var svg = d3.select("svg"), width = svg.attr("width"), height = svg.attr("height");
    svg = d3.select("svg")
         .attr("width", "1000")
         .attr("height", "1000")
         .call(d3.zoom().on("zoom", function () {
            svg.attr("transform", d3.event.transform)
         }))
         .append("g");


    var simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength(-400))
    .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(30))
    .force("x", d3.forceX(width / 2))
    .force("y", d3.forceY(height / 2))
    .on("tick", ticked);

    var text = { rownumber: rnumber };
    jsonsendtext = JSON.stringify(text);
    console.log(jsonsendtext)

    //d3.json("/static/graph.json", function(error, graph) {
    d3.json("http://localhost:5000/downloadgraph")
        .header("Content-Type", "application/json")
        .post(jsonsendtext, function(error, graph)
         {
            if (error) throw error;
            console.log(graph)
            simulation.nodes(graph.nodes);
            simulation.force("link").links(graph.links);

            link = svg.selectAll(".link")
              .data(graph.links)
              .enter().append("line")
                .attr("class", "link");

            node = svg.selectAll(".node")
              .data(graph.nodes)
              .enter().append("circle")
                .attr("class", "node")
                .attr("r", 12)
                .style("fill", "white")
                .attr("cx",300)
                .attr("cy",300)
                .style("fill", function(d) { return "hsl(" + Math.random() * 360 + ",100%,50%)" });

            label = svg.selectAll(".text")
                .attr("class", "labels")
                .data(graph.nodes)
                .enter().append("text")
                .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'central')
                    .style('font-family','FontAwesome')
                    .style('font-size','20px')
                    .text(function (d) {return d.id;})
        });


    function ticked() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });

      label.attr("x", function(d) { return d.x; })
           .attr("y", function (d) { return d.y; })
    }
}


