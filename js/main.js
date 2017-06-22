function setup() {
  noCanvas();

  var svg_width = window.innerWidth;
  var svg_height = window.innerHeight;
  var centerx = svg_width / 2;
  var centery = svg_height / 2;

  var body = d3.select('body');

  var svg = body.append('svg')
    .attr('width', svg_width)
    .attr('height', svg_height)
    .attr('id', 'main-svg')


  gr = new Graph(svg, 1000);
  gr.draw();
}

function draw() {

}
