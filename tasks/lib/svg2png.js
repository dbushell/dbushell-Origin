var fs = require("fs");

var inputFile = phantom.args[0],
    outputFile = phantom.args[1];

var page = require("webpage").create();


var svgdata = fs.read(inputFile) || "";

var svgdatauri = "data:image/svg+xml;base64,";
// var pngdatauri = "data:image/png;base64,";

// kill the ".svg" at the end of the filename
// var filenamenoext = theFile.replace( /\.svg$/i, "" );

// get svg element's dimensions so we can set the viewport dims later
var frag = window.document.createElement("div");
frag.innerHTML = svgdata;
var svg = frag.querySelector("svg");
var width = svg.getAttribute("width");
var height = svg.getAttribute("height");

//console.log("\n" + inputFile + " " + width + "x" + height);

// get base64 of svg file
fs.write(inputFile.replace(/\.svg$/i, ".txt"), svgdatauri + btoa(svgdata));

// add rules to svg data css file
// datacssrules.push( "." + cssprefix + filenamenoext + " { background-image: url(" + svgdatauri + "); background-repeat: no-repeat; }" );

// add rules to png url css file
// pngcssrules.push( "." + cssprefix + filenamenoext + " { background-image: url(" + pngout + filenamenoext + ".png" + "); background-repeat: no-repeat; }" );

// add markup to the preview html file
// htmlpreviewbody.push( '<pre><code>.' + cssprefix + filenamenoext + ':</code></pre><div class="' + cssprefix + filenamenoext + '" style="width: '+ width +'; height: '+ height +'"></div><hr/>' );

// set page viewport size to svg dimensions
page.viewportSize = {  width: parseFloat(width), height: parseFloat(height) };

// open svg file in webkit to make a png
page.open(inputFile, function(status)
{
    page.render(outputFile);
    phantom.exit(false);
});
