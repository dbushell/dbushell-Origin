var fs = require("fs");

// var inputFile = phantom.args[0],
//     outputFile = phantom.args[1];

var svgdatauri = "data:image/svg+xml;base64,",
    complete = 0,
    files = phantom.args[0],
    page = require("webpage").create();

var onComplete = function()
{
    if (++complete >= files.length)
    {
        phantom.exit(false);
        process.exit(0);
    } else {
        next();
    }
};

var next = function()
{
    var inputFile  = files[complete],
        outputFile = inputFile.replace(/\.svg$/i, ".png");

    var svgdata = fs.read(inputFile) || "";

    // get svg element's dimensions so we can set the viewport dims later
    var frag = window.document.createElement("div");
    frag.innerHTML = svgdata;
    var svg = frag.querySelector("svg");
    var width = svg.getAttribute("width");
    var height = svg.getAttribute("height");

    // get base64 of svg file
    fs.write(inputFile.replace(/\.svg$/i, ".txt"), svgdatauri + btoa(svgdata));

    // set page viewport size to svg dimensions
    page.viewportSize = {  width: parseFloat(width), height: parseFloat(height) };

    // open svg file in webkit to make a png
    page.open(inputFile, function(status)
    {
        page.render(outputFile);
        onComplete();
    });
};


