function timeline(domElement) {
  var width = 1000,
      height = 10000,
      padding = 100;

  var ref = firebase.database().ref();
  console.log(ref);

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

  d3.json("art-connexions-export.json", function(data) {
    var date;
    var dateArray = [];

    data.nodes.forEach(function(d) {
      date = new Date(d.date, 0);
      d.date = date;
      dateArray[d.id] = date;
    });

   var line = svg.attr("class", "line")
                 .selectAll("line").data(data.links)
                 .enter().append("line")
                 .style("stroke", "black");

    var node = svg.selectAll(".node")
                  .data(data.nodes)
                  .enter().append("g")
                  .attr("class", "node");

    node.append("circle")
        .attr("stroke", "black")
        .attr("fill", "white")
        .attr("r", 40)
        .attr("cx", 200)
        .attr("cy", function(element) { return yScale(element.date); });

    node.append("text")
        .attr("dx", 200)
        .attr("dy", function(element) { return yScale(element.date); })
        .attr("text-anchor", "middle")
        .text(function(element) {return element.id});

    line.attr("x1", 200)
        .attr("y1", function(element) { return findDate(element.source); })
        .attr("x2", 200)
        .attr("y2", function(element) { return findDate(element.target); });

    function findDate(name) {
      return yScale(dateArray[name]);
    }

    svg.append("g")
       .attr("class", "yaxis")
       .attr("transform", "translate("+padding+", 0)")
       .call(yAxis);
  });
}
