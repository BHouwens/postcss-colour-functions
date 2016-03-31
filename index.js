var postcss = require('postcss'),
    functions = {
        'darken': darkenColour,
        'lighten': lightenColour,
        'opacity': opacityColour
    };

function hexToRgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function stripRgb(rgb) {
    var returnRgb = {
        r: rgb[0].replace(/rgba*\(*/, ''),
        g: rgb[1].replace(' ', ''),
        b: rgb[2].replace(/[\s\)]/g, '')
    }
    
    if (rgb.length == 5){
        returnRgb['a'] = rgb[3].replace(/\s/g, '');
    }
    
    return returnRgb; 
}

function darkenColour(colour, amount) {
    amount = amount.indexOf('%') != -1 ? parseFloat(amount.replace('%', '')) / 100 : parseFloat(amount);
    var returnArr = [(parseFloat(colour['r']) * amount).toFixed(2),
                     (parseFloat(colour['g']) * amount).toFixed(2),
                     (parseFloat(colour['b']) * amount).toFixed(2)];
    
    if (colour.hasOwnProperty('a')) returnArr.push(parseFloat(colour['a']))
    return returnArr;
}

function lightenColour(colour, amount) {
    amount = amount.indexOf('%') != -1 ? parseFloat(amount.replace('%', '')) / 100 : parseFloat(amount);
    var returnArr = [( parseFloat(colour['r']) + ( amount * (255 - parseFloat(colour['r'])) ) ).toFixed(2),
                     ( parseFloat(colour['g']) + ( amount * (255 - parseFloat(colour['g'])) ) ).toFixed(2),
                     ( parseFloat(colour['b']) + ( amount * (255 - parseFloat(colour['b'])) ) ).toFixed(2)];
                     
    if (colour.hasOwnProperty('a')) returnArr.push(parseFloat(colour['a']))
    return returnArr;
}

function opacityColour(colour, amount) {
    amount = amount.indexOf('%') != -1 ? parseFloat(amount.replace('%', '')) / 100 : parseFloat(amount);
    return [colour['r'], colour['g'], colour['b'], amount];
}

module.exports = postcss.plugin('postcss-colour-functions', function myplugin(options) {

    return function(css) {

        options = options || {};
        var requestedFunction = {},
            colour,
            amount,
            newVal;

        css.walkRules(function(rule) {
            rule.walkDecls(function(decl, i) {
                var val = decl.value;

                for (var i in functions) {
                    if (val.indexOf(i) !== -1) {
                        var regex = new RegExp(i+"\\([a-zA-Z0-9\\)\\.\\#\\,\\s\\%]+");
                        
                        requestedFunction = {
                            'function': i,
                            'request': val.match(regex)['input']
                                          .replace(/\(/g, '')
                                          .replace(/\)/g, '')
                                          .replace(i, '')
                                          .split(',') 
                        };
                        
                        if (requestedFunction['request'] !== undefined){
                            if (requestedFunction['request'][0].indexOf('#') != -1) {
                                colour = hexToRgb(requestedFunction['request'][0]);
                                amount = requestedFunction['request'][1];
                            } else if (requestedFunction['request'][0].indexOf('rgb') != -1) {
                                colour = stripRgb(requestedFunction['request']);
                                amount = requestedFunction['request'][requestedFunction['request'].length - 1];
                            } else {
                                throw new Error('Colour entry must be in RGB or a hex code value');
                            }
                            
                            if (functions[i] == opacityColour){
                                newVal = 'rgba(' + functions[i](colour, amount).join(',') + ')';
                            }else{
                                newVal = 'rgb(' + functions[i](colour, amount).join(',') + ')';
                            }
                            
                            decl.value = newVal;
                            requestedFunction = {};
                        }
                        break;
                    }
                }
            });
        });

    }

});