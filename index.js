var postcss = require('postcss');

var functions = {
        'darken': darkenColour,
        'lighten': lightenColour,
        'opacity': opacityColour
    };
    
var colourCodes = {
        'blue': '#F0F8FF',
        'black': '#000',
        'red': '#FF0000',
        'orange': '#FFA500',
        'yellow': '#FFFF00',
        'white': '#FFF',
        'green': '#008000',
        'pink': '#FFC0CB',
        'purple': '#800080',
        'cyan': '#00FFFF',
        'darkgrey': '#A9A9A9',
        'darkgray': '#A9A9A9'
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
    var returnArr = [Math.round(parseFloat(colour['r']) * (1 - amount)),
                     Math.round(parseFloat(colour['g']) * (1 - amount)),
                     Math.round(parseFloat(colour['b']) * (1 - amount))];
    
    if (colour.hasOwnProperty('a')) returnArr.push(parseFloat(colour['a']));
    return returnArr;
}

function lightenColour(colour, amount) {
    amount = amount.indexOf('%') != -1 ? parseFloat(amount.replace('%', '')) / 100 : parseFloat(amount);
    var returnArr = [Math.round( parseFloat(colour['r']) + ( amount * (255 - parseFloat(colour['r'])) ) ),
                     Math.round( parseFloat(colour['g']) + ( amount * (255 - parseFloat(colour['g'])) ) ),
                     Math.round( parseFloat(colour['b']) + ( amount * (255 - parseFloat(colour['b'])) ) )];
                     
    if (colour.hasOwnProperty('a')) returnArr.push(parseFloat(colour['a']));
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
                        var match = val.match(regex);
                        if (!match) continue;
                        
                        requestedFunction = {
                            'function': i,
                            'request': val.match(regex)['input']
                                          .replace(/\(/g, '')
                                          .replace(/\)/g, '')
                                          .replace(i, '')
                                          .split(',') 
                        };
                        
                        if (requestedFunction['request'] !== undefined){
                            var possibleColour = requestedFunction['request'][0];
                            
                            if (possibleColour.indexOf('#') != -1) {
                                
                                colour = hexToRgb(possibleColour);
                                amount = requestedFunction['request'][1];
                                
                            } else if (possibleColour.indexOf('rgb') != -1) {
                                
                                colour = stripRgb(requestedFunction['request']);
                                amount = requestedFunction['request'][requestedFunction['request'].length - 1];
                                
                            } else if (possibleColour.match(/[a-z]+/i) !== undefined){
                                
                                if (colourCodes.hasOwnProperty(possibleColour)){
                                    colour = hexToRgb(colourCodes[possibleColour]);
                                    amount = requestedFunction['request'][1];
                                }else{
                                    var errorMessage = 'POSTCSS-COLOUR-FUNCTIONS: No colour code found for ' + possibleColour +'. Are you trying to use a CSS colour code?';
                                    throw new Error(errorMessage);
                                }
                                
                            } else {
                                throw new Error('POSTCSS-COLOUR-FUNCTIONS: Colour entry must be in RGB or a hex code value');
                            }
                            
                            if (functions[i] == opacityColour || colour.hasOwnProperty('a')){
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
