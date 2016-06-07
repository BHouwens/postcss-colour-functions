import * as postcss from 'postcss';
import {
    hexToRgb,
    stripRgb,
    darkenColour,
    lightenColour,
    opacityColour
} from './functions';


let functions = {
        'darken': darkenColour,
        'lighten': lightenColour,
        'opacity': opacityColour
    };
    
let colourCodes = {
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

module.exports = postcss.plugin('postcss-colour-functions', function myplugin(options) {

    return function(css) {

        options = options || {};
        let requestedFunction = {},
            colour,
            amount,
            newVal;

        css.walkRules(function(rule) {
            rule.walkDecls(function(decl, i) {
                let val = decl.value;

                for (let i in functions) {
                    if (val.indexOf(i) !== -1) {
                        let regex = new RegExp(i+"\\([a-zA-Z0-9\\)\\.\\#\\,\\s\\%]+");
                        
                        requestedFunction = {
                            'function': i,
                            'request': val.match(regex)['input']
                                          .replace(/\(/g, '')
                                          .replace(/\)/g, '')
                                          .replace(i, '')
                                          .split(',') 
                        };
                        
                        if (requestedFunction['request'] !== undefined){
                            let possibleColour = requestedFunction['request'][0];
                            
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