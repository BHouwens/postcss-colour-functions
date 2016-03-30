var postcss = require('postcss'),
    functions = [
        'darken',
        'lighten',
        'opacity'
    ];

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

function stripRgb(rgb){
    return {
        r: rgb[0].replace('rgb(', ''),
        g: rgb[1].replace(' ', ''),
        b: rgb[2].replace(')', '')
    }
}

function darkenColour(colour, amount){
    amount = amount.indexOf('%') != -1 ? parseFloat(amount.replace('%', '')) / 100 : parseFloat(amount);
    return [parseFloat(colour['r'] * amount).toFixed(2), 
            parseFloat(colour['g'] * amount).toFixed(2), 
            parseFloat(colour['b'] * amount).toFixed(2)];
}

function lightenColour(colour, amount){
    amount = amount.indexOf('%') != -1 ? parseFloat(amount.replace('%', '')) / 100 : parseFloat(amount);
    return [parseFloat(colour['r'] + (amount * (255 - colour['r']))).toFixed(2), 
            parseFloat(colour['g'] + (amount * (255 - colour['g']))).toFixed(2), 
            parseFloat(colour['b'] + (amount * (255 - colour['b']))).toFixed(2)];
}

function opacityColour(colour, amount){
    amount = amount.indexOf('%') != -1 ? parseFloat(amount.replace('%', '')) / 100 : parseFloat(amount);
    return 'rgba('+colour['r']+','+colour['g']+','+colour['b']+','+amount+')';
}
 
module.exports = postcss.plugin('postcss-colour-functions', function myplugin(options) {
 
    return function (css) {
 
        options = options || {};
         
        css.walkRules(function(rule){
            rule.walkDecls(function(decl, i){
                var val = decl.value,
                    colour,
                    amount,
                    requestedFunction,
                    newVal;
                
                console.log(functions);
                
                for (var i = 0; i < functions.length; i++){
                    if (val.indexOf(functions[i] + '(') != -1){
                        console.log('value', val);
                        console.log('function', functions[i]);
                        requestedFunction = { 
                            'function' : functions[i],
                            'request': val.match(/\([\(\)\.\#\,\s\%a-zA-Z0-9]+/)[0].replace('(','').split(',')
                        };
                        break;
                    }
                }
                
                console.log('requestFunction', requestedFunction);
                
                if (requestedFunction['request'][0].indexOf('#') != -1){
                    colour = hexToRgb(requestedFunction['request'][0]);
                    amount = requestedFunction['request'][1];
                }else if (requestedFunction['request'][0].indexOf('rgb(') != -1){
                    colour = stripRgb(requestedFunction['request']);
                    amount = requestedFunction['request'][3];
                }else{
                    throw new Error('Colour entry must be in RGB or a hex code value');
                }
                
                if (requestedFunction['function'] == 'darken'){
                    console.log()
                    newVal = 'rgb(' + darkenColour(colour, amount).join(',') + ')';
                }else
                if (requestedFunction['function'] == 'lighten'){
                    newVal = 'rgb(' + lightenColour(colour, amount).join(',') + ')';
                }else
                if (requestedFunction['function'] == 'opacity'){
                    newVal = opacityColour(colour, amount);
                }
                
                decl.value = newVal;
            });
        });
 
    }
 
});