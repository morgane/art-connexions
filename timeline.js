/* Extremely big canvas: the timeline is gonna be long! */
var width = 1200,
    height = 10000,
    padding = 100;

/* Set up D3 */
var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g");

/* The date range for the timeline */
var mindate = new Date(1400, 0, 1),
    maxdate = new Date(2012, 0, 31);

/* Set up the timeline scale */
var yScale = d3.time.scale()
                    .range([padding, height - (padding * 2)])
                    .domain([mindate, maxdate]);

/* Make timeline vertical and on the leftside */
var yAxis = d3.svg.axis()
                  .orient("left")
                  .scale(yScale);

/* Set up force layout: this will place nodes and let us drag them around */
var force = d3.layout.force()
                     .size([width, height])
                     .charge(-300)
                     .linkDistance(100);

/* A necessary and mysterious step */
var drag = force.drag()
                .on("dragstart", dragstart);

/* Get/set these ahead of time */
var link = svg.selectAll(".link"),
    node = svg.selectAll(".node"),
    edges = [];

/* Read the JSON file! */
d3.json("connexions.json", function(error, graph) {
  if (error) throw error;

  /* A necessary and mysterious step */
  graph.nodes.forEach(function(d) {
    date = new Date(d.date, 0);
    d.date = date;
  });

  /* Get links based on artist names, not numerical index */
  graph.links.forEach(function(e) {
    var sourceNode = graph.nodes.filter(function(n) {
      return n.name === e.source;
    })[0],
      targetNode = graph.nodes.filter(function(n) {
        return n.name === e.target;
      })[0];

    edges.push({
      source: sourceNode,
      target: targetNode,
      value: e.Value
    });
  });

  /* Hook up the links and nodes to the layout */
  force
      .nodes(graph.nodes)
      .links(edges)
      .start();

  /* Get the links and style them */
  link = link.data(edges)
             .enter().append("line")
             .attr("class", "link")
             .style("stroke", "black");

  /* Get the nodes and set them up to have labels, be draggable, etc */
  node = node.data(graph.nodes)
             .enter().append("g")
             .attr("class", "node")
             .on("dblclick", dblclick)
             .call(drag);

  /* Style the nodes as simple circles for now */
  node.append("circle")
    .attr("r", 40)
    .attr("x", 0)
    .attr("y", 0)
    .attr("stroke", "black")
    .attr("fill", "white");

  /* Add names to the nodes */
  node.append("text")
      .attr("dx", 0)
      .attr("dy", 0)
      .text(function(e) { return e.name });

  /* Place the nodes and their links */
  force.on("tick", function() {
    link.attr("x1", function(e) { return e.source.x; })
        .attr("y1", function(e) { return yScale(e.source.date); })
        .attr("x2", function(e) { return e.target.x; })
        .attr("y2", function(e) { return yScale(e.target.date); });

    node.attr("transform", function(e) { return "translate(" + e.x + "," + yScale(e.date) + ")"; });
  });
});

/* Function for dragging around nodes */
function dblclick(d) {
  d3.select(this).classed("fixed", d.fixed = false);
}

/* Function for dragging around nodes */
function dragstart(d) {
  d3.select(this).classed("fixed", d.fixed = true);
}

/* A mysterious and necessary step */
svg.append("g")
 .attr("class", "yaxis")
 .attr("transform", "translate("+padding+", 0)")
 .call(yAxis);
