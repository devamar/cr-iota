class Graph {
  constructor(svg, size) {
    this.svg = svg;
    this.data = [];
    this.size = size;
    this.grid_factor = 5;
    this.grid = this.svg.append('g');
    this.mid_y = size / 2;
    this.mid_x = size / 2;
    this.scale = 1;
    this.label_scale = this.scale / 5;
    this.sep = size / 30;
    this.grid_color = '#3a414c';
    this.label_color = '#868c96';
  }
  draw() {
    this.drawGrid();
  }
  clearGrid() {
    this.grid.remove();
    this.grid = this.svg.append('g');
  }
  drawGrid() {
    //Vertical
    var count = 0
    var label_y_pos  = this.mid_y + 20;
    var label_pad = 3;
    var label_height = getSVGTextHeight(this.grid);
    var label_num = 0;
    for (var x = this.mid_x; x < this.size; x += this.sep) {
      var line_opacity = 0.1;
      var negative_x = 2 * this.mid_x - x;
      if (count == 0) {
        line_opacity = 1.0;
        createGridLabelX(this.grid, this.mid_x, label_y_pos, '0', this.label_color);

        drawSVGLine(this.grid, x, 0, x, label_y_pos - label_height + 7 - label_pad, this.grid_color, '1.5', line_opacity);
        drawSVGLine(this.grid, x, label_y_pos + label_pad, x, this.size, this.grid_color, '1.5', line_opacity);

      } else if (count % this.grid_factor == 0) {
        label_num += this.label_scale;
        line_opacity = 0.3;
        createGridLabelX(this.grid, x, label_y_pos, label_num, this.label_color);
        createGridLabelX(this.grid, negative_x, label_y_pos, -label_num, this.label_color);

        drawSVGLine(this.grid, x, 0, x, label_y_pos - label_height + 7 - label_pad, this.grid_color, '1.5', line_opacity);
        drawSVGLine(this.grid, x, label_y_pos + label_pad, x, this.size, this.grid_color, '1.5', line_opacity);

        drawSVGLine(this.grid, negative_x, 0, negative_x, label_y_pos - label_height + 7 - label_pad, this.grid_color, '1.5', line_opacity);
        drawSVGLine(this.grid, negative_x, label_y_pos + label_pad, negative_x, this.size, this.grid_color, '1.5', line_opacity);
      } else {
        drawSVGLine(this.grid, x, 0, x, this.size, this.grid_color, '1.5', line_opacity);
        drawSVGLine(this.grid, negative_x, 0, negative_x, this.size, this.grid_color, '1.5', line_opacity);
      }
      count++;
    }

    count = 0;
    for (var y = this.mid_y; y < this.size; y += this.sep) {
      var line_opacity = 0.1;
      if (count == 0) {
        line_opacity = 1.0;
      } else if (count % this.grid_factor == 0) {
        line_opacity = 0.3;
      }

      drawSVGLine(this.grid, 0, y, this.size, y, this.grid_color, '1.5', line_opacity);
      var negative_y = 2 * this.mid_y - y;
      if (count != 0) {
        drawSVGLine(this.grid, 0, negative_y, this.size, negative_y, this.grid_color, '1.5', line_opacity);
      }
      count++;
    }
  }
  zoom(amount) {
    this.scale -= amount;
    var scale_factor = floor(abs(this.scale)) % 5;
    var m_scale_factor = map(scale_factor, 0, 4, .8, 1)
    this.sep = m_scale_factor*this.size/30
    this.clearGrid();
    this.drawGrid();
    if (this.scale / 5 == round(this.scale / 5)) {
      this.label_scale = this.scale / 5;
    }
  }
}
