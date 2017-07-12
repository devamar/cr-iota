class Graph {
    constructor(w, h, x_range, y_range) {
        this.w = w;
        this.h = h;
        this.ratio = h / w;
        this.data = [];
        this.svg = d3.select("body").append("svg")
            .attr("width", w)
            .attr("height", h);
        this.interp = d3.curveCardinal;

        //Main Axis Initialization
        this.x_range = x_range;
        this.y_range = [y_range[0] * this.ratio, y_range[1] * this.ratio];

        this.x_scale = d3.scaleLinear().domain(this.x_range).range([0, w]);
        this.y_scale = d3.scaleLinear().domain(this.y_range).range([0, h]);

        this.x_axis = d3.axisBottom(this.x_scale);
        this.y_axis = d3.axisLeft(this.y_scale);

        //Main Axis Draw
        this.x_group = this.svg.append("g").call(this.x_axis);
        this.y_group = this.svg.append("g").call(this.y_axis);

        //Gridlines Initialization
        this.x_gridlines_axis = d3.axisBottom(this.x_scale).tickSize(-h).tickFormat("").ticks(10);
        this.y_gridlines_axis = d3.axisLeft(this.y_scale).tickSize(-w).tickFormat("").ticks(10 * this.ratio);

        //Gridlines Draw
        this.x_gridlines = this.svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0, " + h + ")")
            .call(this.x_gridlines_axis);

        this.y_gridlines = this.svg.append("g")
            .attr("class", "grid")
            .call(this.y_gridlines_axis);

        //Zoom Trigger
        var zoom = d3.zoom().on("zoom", this.zoomed);
        this.svg.call(zoom);

        //View Initialization
        this.view = this.svg.append("g")
            .attr("id", "view");

        this.line = d3.line()
            .curve(this.interp)
            .x(function(d) {
                return x_scale(d.x - x_range.max);
            })
            .y(function(d) {
                return y_scale(-d.y - y_range.max);
            });

    }

    drawData() {
        this.view.selectAll('.line')
            .data(this.data)
            .enter()
            .append("path")
            .attr("class", "line")
            .attr('stroke', 'steelblue')
            .attr("d", this.line);
    }

    zoomed() {
        var new_scale_x = d3.event.transform.rescaleX(
            d3.scaleLinear().domain([0, gr.x_range[1] * 2]).range([0, gr.w])
        );
        var new_scale_y = d3.event.transform.rescaleY(
            d3.scaleLinear().domain([0, -gr.y_range[1] * 2]).range([0, gr.h])
        );

        gr.x_gridlines.call(gr.x_gridlines_axis.scale(new_scale_x));
        gr.y_gridlines.call(gr.y_gridlines_axis.scale(new_scale_y));

        gr.x_group.attr("transform", "translate(0, " + d3.event.transform.y + ")");
        gr.y_group.attr("transform", "translate(" + d3.event.transform.x + ", 0)");


        gr.view.attr("transform", d3.event.transform);

        gr.x_group.call(gr.x_axis.scale(new_scale_x));

        gr.y_group.call(gr.y_axis.scale(new_scale_y));
    }

    addDataSet() {
        //TODO
    }

}
