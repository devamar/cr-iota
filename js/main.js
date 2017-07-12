var gr;

$(document).ready(function() {
    var width = $(document).width();
    var height = $(document).height();
    var x_range = [-10, 10];
    var y_range = [-10, 10];
    gr = new Graph(width, height, x_range, y_range);
});
