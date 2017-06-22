class Graph {
    constructor(w, h) {
        this.grid = new GraphGridlines();
        this.width = w;
        this.height = h;
        this.max_gridlines = {
            x: 13,
            y: 13
        };
        this.char_height = 8;
        this.start_drag = {
            x: 0,
            y: 0
        };
        this.prev_drag = {
            x: 0,
            y: 0
        }
        this.start_coord = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
        };
        this.curr_coord = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
        };
        this.mousebutton = 0;
        this.canvasX = 0;
        this.canvasY = 0;
        this.zoomFactor = 0.1;
        this.lines = [];
    }
    clearScreen() {
        background(255);
    }
    drawLabel(xval, yval, text, color) {
        if (!color)
            color = "#000000"
        var labelCoord = this.getCoord(xval, yval);
        var xpos = labelCoord.x;
        var ypos = labelCoord.y;

        textSize(this.char_height);
        text(text, xpos, ypos);
    }
    drawGrid() {
        this.clearScreen();

        var x1 = this.curr_coord.x1;
        var x2 = this.curr_coord.x2;
        var y1 = this.curr_coord.y1;
        var y2 = this.curr_coord.y2;

        var xrange = x2 - x1;
        var yrange = y2 - y1;

        var xscale = Math.max(xrange / this.width, 1E-20);
        var yscale = Math.max(yrange / this.height, 1E-20);

        for (var i = 0.000000000001, c = 0; xrange / i > this.max_gridlines.x - 1; c++) {
            if (c % 3 === 1) i *= 2.5; //alternating between 2, 5 and 10
            else i *= 2;

            // Ensure we don't get into an infinite loop
            if (c > 10000) {
                break;
            }
        }
        var xgridscale = i;

        //do the same for the y-axis
        for (i = 0.000000000001, c = 0; yrange / i > this.max_gridlines.y - 1; c++) {
            if (c % 3 == 1) i *= 2.5;
            else i *= 2;

            // Ensure we don't get into an infinite loop
            if (c > 10000) {
                break;
            }
        }
        var ygridscale = i;

        var xaxis = null;
        var yaxis = null;

        var currx = arbFloor(x1, this.xgridscale);
        var curry = arbFloor(y1, this.ygridscale);

        var xmainaxis = this.charHeight * 1.5;
        var ymainaxis = -1;

        if (y2 >= 0 && y1 <= 0) //y=0 appears on the screen - move the text to follow
            xmainaxis = this.height - ((0 - y1) / (y2 - y1)) * this.height + (this.charHeight * 1.5);
        else if (y1 > 0) //the smallest value of y is below the screen - the x-axis labels get pushed to the bottom of the screen
            xmainaxis = this.height - 5;

        //the x-axis labels have to be a certain distance from the bottom of the screen
        if (xmainaxis > this.height - (this.charHeight / 2))
            xmainaxis = this.height - 5;
        //do the same as above with the y-axis
        if (x2 >= 0 && x1 <= 0) //y-axis in the middle of the screen
            ymainaxis = ((0 - x1) / (x2 - x1)) * this.width - 2;
        else if (x2 < 0) //y-axis on the right side of the screen
            ymainaxis = this.width - 6;
        var sigdigs = String(currx).length + 3;

        //VERTICAL LINES
        for (i = 0; i < this.max_gridlines.x; i++) {
            var xpos = ((currx - x1) / (x2 - x1)) * this.width; //position of the line (in pixels)
            if (xpos - 0.5 > this.width + 1 || xpos < 0) {
                currx += this.xgridscale;
                continue;
            }
            if (currx === 0)
                xaxis = xpos;

            if (this.grid.gridlines === "normal" || (this.grid.gridlines === "less" && Calc.roundFloat(currx) % Calc.roundFloat((this.xgridscale * 2)) === 0)) {
                drawSVGRect(this.graph, xpos - 0.5, 0, 1, this.height, "rgb(190,190,190)");
            }
            if (currx != 0) {
                var xtextwidth = 8 * currx.length;
                if (xpos + xtextwidth * 0.5 > this.width) //cannot overflow the screen
                    xpos = this.width - xtextwidth * 0.5 + 1;
                else
                if (xpos - xtextwidth * 0.5 < 0)
                    xpos = xtextwidth * 0.5 + 1;
                createGridLabel(this.graph, xpos, xmainaxis, currx, 'black');

            }
            currx += this.xgridscale;

            //HORIZONTAL LINES
            for (i = 0; i < this.max_gridlines.y; i++) {
                var ypos = this.height - ((curry - y1) / (y2 - y1)) * this.height; //position of the line (in pixels)
                //make sure it is on the screen
                if (ypos - 0.5 > this.height + 1 || ypos < 0) {
                    curry += this.ygridscale;
                    continue;
                }

                if (curry == 0)
                    yaxis = ypos;

                if (this.grid.gridlines == "normal" || (this.grid.gridlines == "less" && Calc.roundFloat(curry) % (Calc.roundFloat(this.ygridscale * 2)) == 0)) {
                    drawSVGRect(this.graph, 0, ypos - 0.5, this.width, 1, "rgb(190,190,190)");
                }

                //Draw label
                if (curry != 0) {
                    var ytextwidth = 8 * curry.length;
                    if (ypos + (this.charHeight / 2) > this.height) //cannot overflow the screen
                        ypos = this.height - (this.charHeight / 2) - 1;
                    if (ypos - 4 < 0)
                        ypos = 4;
                    var xaxispos = ymainaxis;
                    if (ymainaxis == -1)
                        xaxispos = ytextwidth + 1;
                    createGridLabel(this.graph, xaxispos, ypos + 3, curry, 'black');
                }
                curry += this.ygridscale;
            }
            //Draw the axis
            if (xaxis)
                drawSVGRect(this.graph, xaxis - 0.5, 0, 1, this.height, "rgb(190,190,190)");
            if (yaxis)
                drawSVGRect(this.graph, 0, yaxis - 0.5, this.width, 1, "rgb(190,190,190)");

        }

    }

    draw() {
        this.drawGrid();
        this.grid.updateValues();
    }

    getScale() {
        return {
            x: (this.width / (this.start_coord.x2 - this.start_coord.x1)),
            y: (this.height / (this.start_coord.y2 - this.start_coord.y1))
        }
    }

    getRange() {
        return {
            x: Math.abs(this.start_coord.x2 - this.start_coord.x1),
            y: Math.abs(this.start_coord.y2 - this.start_coord.y1)
        }
    }

    checkMove(x, y) {
        if (x === this.prev_drag.x && y === this.prev_drag.y)
            return;

        var scale = this.getScale();
        if (this.mousebutton === 1) {
            if (this.grid.currtool === "zoombox" || this.grid.currtool === "zoombox_active") { //ZOOM BOX
                this.draw();
                drawSVGRect(this.graph, this.startDrag.x, this.startDrag.y, x - this.startDrag.x, y - this.startDrag.y, "rgb(150,150,150)");
            } else { //CLICK AND DRAG
                //dump(scale.x + " " + scale.y + " -- " + this.start_coord.x1 + " " + this.start_coord.y1);
                //dump(this.start_coord.x1 + " " +(y - this.startDrag.y) / scale.y);
                this.curr_coord.x1 = this.start_coord.x1 - ((x - this.startDrag.x) / scale.x);
                this.curr_coord.x2 = this.start_coord.x2 - ((x - this.startDrag.x) / scale.x);

                this.curr_coord.y1 = this.start_coord.y1 + ((y - this.startDrag.y) / scale.y);

                this.curr_coord.y2 = this.start_coord.y2 + ((y - this.startDrag.y) / scale.y);

                this.draw();
            }
        }

        this.prevDrag = {
            x: x,
            y: y
        };
    }

    mouseDown(event) {
        if (this.mousebutton == 0) {
            if (this.grid.currtool === "zoombox") {
                this.grid.currtool = "zoombox_active";
            }
            this.startDrag.x = event.pageX - this.canvasX;
            this.startDrag.y = event.pageY - this.canvasY;
            this.start_coord = this.copyCoord(this.curr_coord);
        }
        this.mousebutton = 1;
    }

    mouseUp(event) {
        if (this.grid.currtool === "zoombox_active") {
            this.doZoomBox(this.startDrag.x, this.startDrag.y, event.pageX - this.canvasX, event.pageY - this.canvasY);
            jsgui.setTool("pointer");
        }
        if (this.grid.currtool === "zoomin") {
            if (Math.abs((event.pageX - this.canvasX) - this.startDrag.x) + Math.abs((event.pageY - this.canvasY) - this.startDrag.y) < 5)
                this.zoom(0.10, event);
        }
        if (this.grid.currtool === "zoomout") {
            if (Math.abs((event.pageX - this.canvasX) - this.startDrag.x) + Math.abs((event.pageY - this.canvasY) - this.startDrag.y) < 5)
                this.zoom(-0.10, event);
        }
        this.mousebutton = 0;
        this.start_coord = this.copyCoord(this.curr_coord);
    }

    mouseWheel(event, delta) {
        if (delta > 0) {
            this.zoom(this.zoomFactor, event);
        } else {
            this.zoom(-this.zoomFactor, event);
        }
    }

    setWindow(x1, x2, y1, y2) {
        this.curr_coord.x1 = x1;
        this.curr_coord.x2 = x2;
        this.curr_coord.y1 = y1;
        this.curr_coord.y2 = y2;
        this.start_coord = this.copyCoord(this.curr_coord);
        this.draw();
    }

    zoom(scale, event) {
        var range = this.getRange();
        if (event) {
            var mousex = event.pageX - this.canvasX;
            var mousey = event.pageY - this.canvasY;
            var mousetop = 1 - (mousey / this.height); //if we divide the screen into two halves based on the position of the mouse, this is the top half
            var mouseleft = mousex / this.width; //as above, but the left hald
            this.curr_coord.x1 += range.x * scale * mouseleft;
            this.curr_coord.y1 += range.y * scale * mousetop;
            this.curr_coord.x2 -= range.x * scale * (1 - mouseleft);
            this.curr_coord.y2 -= range.y * scale * (1 - mousetop);
        } else {
            this.curr_coord.x1 += range.x * scale;
            this.curr_coord.y1 += range.y * scale;
            this.curr_coord.x2 -= range.x * scale;
            this.curr_coord.y2 -= range.y * scale;
        }
        this.start_coord = this.copyCoord(this.curr_coord);
        this.draw();
    }

    animate() {
        this.curr_coord.x1 += 0.05;
        this.curr_coord.y1 += 0.05;
        this.curr_coord.x2 += 0.05;
        this.curr_coord.y2 += 0.05;
        this.draw();
        setTimeout('this.grid.animate()', 50);
    }

    resizeGraph(width, height) {
        var oldheight = this.height;
        var oldwidth = this.width;

        //Resize the elements
        $("#graph").width(width);
        $("#graph").height(height);
        this.height = height;
        this.width = width;
        console.log("Resized to " + width + "x" + height);

        //Compute the new boundaries of the graph
        this.curr_coord.x1 *= (width / oldwidth);
        this.curr_coord.x2 *= (width / oldwidth);
        this.curr_coord.y1 *= (height / oldheight);
        this.curr_coord.y2 *= (height / oldheight);
        this.start_coord = copyCoord(this.curr_coord);

        //Compute how many grid lines to show
        this.max_gridlines.x = 0.015 * width;
        this.max_gridlines.y = 0.015 * height;
        this.draw();
    }

    resetZoom() {
        this.curr_coord = {
            x1: -5 * (this.width / this.height),
            y1: -5,
            x2: 5 * (this.width / this.height),
            y2: 5
        };
        this.start_coord = this.copyCoord(this.curr_coord);
        this.draw();
    }

    initCanvas() {
        this.resizeGraph(this.width, this.height);
        this.curr_coord = {
            x1: -5 * (this.width / this.height),
            y1: -5,
            x2: 5 * (this.width / this.height),
            y2: 5
        };
        this.start_coord = copyCoord(this.curr_coord);
        this.grid.evaluate();

        //this.animate();

        var self = this;
        $("svg").mousemove(function(event) {
            self.canvasX = self.graph.offsetLeft;
            self.canvasY = self.graph.offsetTop;
            self.checkMove(event.pageX - self.canvasX, event.pageY - self.canvasY);
        }).mousedown(function(event) {
            self.mouseDown(event);
        }).mouseup(function(event) {
            self.mouseUp(event);
        });

        /*
        $(window).resize(function() {
          if($("#sidewrapper").is(":visible"))
            $("#graph_wrapper").width($("#wrapper").width() - $("#sidewrapper").innerWidth() - $("#toolbar").innerWidth());
          else
            $("#graph_wrapper").width($("#wrapper").width() - $("#toolbar").innerWidth());
          self.resizeGraph($("#graph_wrapper").width(), $("#graph_wrapper").height());
        });
        */
    }
}
