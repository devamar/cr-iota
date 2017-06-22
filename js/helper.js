function drawSVGLine(container, x1, y1, x2, y2, stroke, stroke_width, opacity) {
  container.append('line')
    .attr('x1', x1)
    .attr('y1', y1)
    .attr('x2', x2)
    .attr('y2', y2)
    .attr('stroke', stroke)
    .attr('stroke-width', stroke_width)
    .attr('opacity', opacity);
}

function createGridLabelX(container, x, y, text, color) {
  var label_dummy = container.append('text')
    .attr('opacity', 0)
    .text(text)

  var label_offset = label_dummy.node().getComputedTextLength() / 2;

  container.append('text')
    .attr('x', x - label_offset)
    .attr('y', y)
    .attr('class', 'grid-label')
    .text(text)
    .attr('fill', color)

  label_dummy.remove();
}

function getSVGTextHeight(container) {
  var label_dummy = container.append('text')
    .attr('opacity', 0)
    .attr('class', 'grid-label')
    .text('0')
  return label_dummy.node().getBBox().height;
}
