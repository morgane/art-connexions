
var width = 1000,
    height = 10000,
    padding = 100;

var dateArray = [];

var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g");

var mindate = new Date(1400, 0, 1),
    maxdate = new Date(2012, 0, 31);

var yScale = d3.time.scale()
                    .range([padding, height - (padding * 2)])
                    .domain([mindate, maxdate]);

var yAxis = d3.svg.axis()
                  .orient("left")
                  .scale(yScale);

var force = d3.layout.force()
                     .size([width, height])
                     .charge(-300)
                     .linkDistance(100)
                     .on("tick", tick);

var drag = force.drag()
                .on("dragstart", dragstart);

var link = svg.selectAll(".link"),
    node = svg.selectAll(".node");

d3.json("connexions.json", function(error, graph) {
  if (error) throw error;

  graph.nodes.forEach(function(d) {
    date = new Date(d.date, 0);
    d.date = date;
  });

  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  link = link.data(graph.links)
             .enter().append("line")
             .attr("class", "link")
             .style("stroke", "black");

  node = node.data(graph.nodes)
             .enter().append("g")
             .attr("class", "node")
             .on("dblclick", dblclick)
             .call(drag);

  node.append("circle")
    .attr("r", 40)
    .attr("x", 0)
    .attr("y", 0)
    .attr("stroke", "black")
    .attr("fill", "white");

  node.append("text")
      .attr("dx", 0)
      .attr("dy", 0)
      .text(function(d) { return d.name });

});

function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(element) { return yScale(element.source.date); })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(element) { return yScale(element.target.date); });

  node.attr("transform", function(d) { return "translate(" + d.x + "," + yScale(d.date) + ")"; });
}

function dblclick(d) {
  d3.select(this).classed("fixed", d.fixed = false);
}

function dragstart(d) {
  d3.select(this).classed("fixed", d.fixed = true);
}

svg.append("g")
 .attr("class", "yaxis")
 .attr("transform", "translate("+padding+", 0)")
 .call(yAxis);
