
function parseQuery(query) {
    if (!query) {
        return {};
    }

    var encoded = query.replace(',', encodeURIComponent(','));
    return encoded;
}

function buildDefs(name, colors) {
    var openTag = '<defs><linearGradient id="'+ name + '" x1="0%" y1="0%" x2="100%" y2="0%">';
    var closeTag = '</linearGradient></defs>';
        + '<stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />'
        + '<stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />'
    return openTag + colors.map(function(c, i) { return '<stop offset="' + (i* 100) + '%" style="stop-color:'+ c +';stop-opacity:1" />'; }).join('') + closeTag;
}

module.exports = function(source, map) {
    var colorsRx = /colors=(.*?)(?:$|\&)/;
    var strokeRx = /stroke=(.*?)(?:$|\&)/;


    var defsRx = /<defs>(.*)<\/defs>/;
    var fillRx = /\sfill=(.*?)[\s|>]/g;
    var strokeAttrRx = /\sstroke=(.*?)(\s|>)/g;


    var colorsMatch = this.resourceQuery.match(colorsRx);
    var defsMatch = source.match(defsRx);

    if(colorsMatch && defsMatch) {

        var colors = colorsMatch[1].replace(/%23/g, '#').split(',');

        source = source.replace(defsRx, buildDefs('svg-grad', colors));

        source = source.replace(fillRx, " fill=\"url(#svg-grad)\" " );

        var strokeMatch = this.resourceQuery.match(strokeRx);

        var stroke = strokeMatch[1].replace('%23', '#').split(',')[0];

        source = source.replace(strokeAttrRx, " stroke=\"" + stroke + "\" " );

    }
    return source;

};