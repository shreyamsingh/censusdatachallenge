var width = 800;
var height = 600;
var container = d3.select('#container')
container.on('scroll.scroller', function() { console.log('scrollTop: ' + container.node().scrollTop); })
console.log('MAX: ' + window.innerHeight)

const eduScale = d3.scaleThreshold().range(["#f5d5d0", "#edaca1", "#ed9485", "#f04326"])
const povScale = d3.scaleThreshold().range(["#cbd3f5", "#a2b1f5", "#6e87fa", "#1d44f5"])
// projection and path generator
var projection = d3.geoAlbersUsa()
.translate([width / 2, height / 2])
.scale([900]);
var path = d3.geoPath()
.projection(projection);

var svg = d3.select("#temp").append("svg")
.attr("width", width)
.attr("height", height);


svg.append('defs')
.append('style')
.attr('type', 'text/css')
.text("@import url('https://fonts.googleapis.com/css2?family=Karla&display=swap');");

svg.append("rect").transition().duration(500)
   .attr("x", 10)
   .attr("y", 10)
   .attr("width", width - 10)
   .attr("height", height - 10)
   .attr("fill", "#323740")
   .attr("fill-opacity", 1)
   .attr("rx", 20)

d3.select('body')
   .append('div')
   .attr('id', 'tooltip')
   .attr('style', "border-radius: 10px; padding: 5px; position: absolute; opacity: 0; color: #343434; background-color: gray; color: white; font-family: Karla;");

let eduMap = d3.map();
let povMap = d3.map();
var url = "https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/us.json"
d3.queue()
   .defer(d3.json, url)
   .defer(d3.csv, "data/race.csv", function(d) {
      var id = d.state.toString() + d.county.toString();
      if (id.length < 5) id = "0" + id;

      eduMap.set(+id, +d.percent);
})
.defer(d3.csv, "data/poverty.csv", function(d) {
   var id = d.state.toString() + d.county.toString();
   if (id.length < 5) id = "0" + id;

   povMap.set(+id, +d.percent)
})
.await(ready);

function ready(error, topology) {
if (error) throw error;
eduScale.domain([0.7, 2.4, 10.3])
povScale.domain([7.3, 10.4, 14.3]) // set to 1st, 2nd, 3rd quartile
var geojson = topojson.feature(topology, topology.objects.counties)
svg.append("g")
   .selectAll("path")
   .data(geojson.features)
   .enter().append("path")
   .attr("d", path)
   .attr("class", "county")
   .style("fill", d => eduScale(eduMap.get(d.id)))
   .style("opacity", 0.5)
   
//.transition().delay(1000).style("fill", d => povScale(povMap.get(d.id)))

svg.append("g")
   .selectAll("path")
   .data(geojson.features)
   .enter().append("path")
   .attr("d", path)
   .attr("class", "county")
   .style("fill", d => povScale(povMap.get(d.id)))
   .style("opacity", 0.5)
   .on("mouseover", function(d) {
      console.log(d.id)
      d3.select('#tooltip').transition().duration(200).style('opacity', 1)
      d3.select('#tooltip').html(eduMap.get(d.id) + "% african-american <br />" + povMap.get(d.id) + "% in poverty")
      d3.select(this).style("stroke", "black")
      .style("stroke-width", 1)
   })
   .on("mouseout", function() {
      d3.select('#tooltip').transition().duration(200).style('opacity', 0)
      d3.select(this).style("stroke", "white")
      .style("stroke-width", 0.2)
   })
   .on('mousemove', function() {
      d3.select('#tooltip').style('left', (d3.event.pageX + 10) + 'px').style('top', (d3.event.pageY + 10) + 'px')
   })
console.log("check 2")
svg.append("path")
   .datum(topojson.mesh(topology, topology.objects.states, function(a, b) {
      return a.id !== b.id;
   }))
   .attr("class", "state")
   .attr("d", path)
d3.select(".spinner-grow").remove()
}
const step = 15;
var counter = 0;

var colors = ['#f04326', '#BC445A', '#87448E',
            '#EDA093', '#b782bd', '#5f5dcf', 
            '#E0D4E3', '#889CF8', '#1d44f5']
var squareGroup = svg.append('g').attr("transform", "translate(680, 520) rotate(-45)");
for (var i = 0; i < 3; i++) {
   for (var j = 0; j < 3; j++) {
      squareGroup.append('rect')
      .attr('x', j*step)
      .attr('y', i*step)
      .attr('width', step)
      .attr('height', step)
      .attr('fill', colors[counter]);
      counter++;
   }
   
}
var povText = svg.append('g').attr("transform", "translate(722, 562) rotate(-45)");
povText.append('text')
   .text('Poverty')
   .style('fill', 'white')
   .style('font-family', 'Karla');

var raceText = svg.append('g').attr("transform", "translate(665, 530) rotate(45)");
raceText.append('text')
   .attr('x', 3)
   .text('African-')
   .style('fill', 'white')
   .style('font-family', 'Karla');
raceText.append('text')
   .attr('y', 10)
   .text('American')
   .style('fill', 'white')
   .style('font-family', 'Karla');

// arrow 1 (race)
var arrow1 = svg.append('g');
arrow1.append('line')
   .style('stroke', '#FFFFFF')
   .style('stroke-width', 2)
   .attr('x1', 712)
   .attr('x2', 680)
   .attr('y1', 552)
   .attr('y2', 520)
arrow1.append('line')
   .style('stroke', '#FFFFFF')
   .style('stroke-width', 2)
   .attr('x1', 680)
   .attr('x2', 690)
   .attr('y1', 520)
   .attr('y2', 522)
arrow1.append('line')
   .style('stroke', '#FFFFFF')
   .style('stroke-width', 2)
   .attr('x1', 680)
   .attr('x2', 682)
   .attr('y1', 520)
   .attr('y2', 530)


// arrow 2 (poverty)
var arrow2 = svg.append('g');
arrow2.append('line')
   .style('stroke', '#FFFFFF')
   .style('stroke-width', 2)
   .attr('x1', 712)
   .attr('x2', 744)
   .attr('y1', 552)
   .attr('y2', 520)

arrow2.append('line')
   .style('stroke', '#FFFFFF')
   .style('stroke-width', 2)
   .attr('x1', 744)
   .attr('x2', 734)
   .attr('y1', 520)
   .attr('y2', 522)
arrow2.append('line')
   .style('stroke', '#FFFFFF')
   .style('stroke-width', 2)
   .attr('x1', 744)
   .attr('x2', 742)
   .attr('y1', 520)
   .attr('y2', 530)