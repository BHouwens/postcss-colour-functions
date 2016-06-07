/*------- MODELS -------*/

interface IRGB {
    r: string;
    g: string;
    b: string;
    a?: string;
}

/*------- FORMATTERS -------*/


/**
 *  Converts hexidecimal values to RGB format
 * 
 *  @param {string} hex - Hexidecimal value to convert
 */

export function hexToRgb(hex: string): Object {
    let shorthandRegex: RegExp = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
        result: RegExpExecArray = null;

    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
        return r + r + g + g + b + b;
    });

    result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


/**
 *  Strips unnecessary characters from RGB value for conversion
 * 
 *  @param {string[]} rgb - RGB value to strip
 */

export function stripRgb(rgb: string[]): IRGB {
    let returnRgb: IRGB = {
        r: rgb[0].replace(/rgba*\(*/, ''),
        g: rgb[1].replace(' ', ''),
        b: rgb[2].replace(/[\s\)]/g, '')
    }

    if (rgb.length == 5) {
        returnRgb['a'] = rgb[3].replace(/\s/g, '');
    }

    return returnRgb;
}



/*------- COLOUR FUNCTIONS -------*/



/**
 *  Darkens passed colour by passed amount.
 * 
 *  @param {IRGB} colour - RGB-formatted colour to darken
 *  @param {string} amount - Amount to darken by. Accepts both percentage and decimal
 */

export function darkenColour(colour: IRGB, amount: string) {
    let parsedAmount: number = amount.indexOf('%') != -1 ? parseFloat(amount.replace('%', '')) / 100 : parseFloat(amount),
        darkenedColour: number[] = [
            Math.round(parseFloat(colour['r']) * (1 - parsedAmount)),
            Math.round(parseFloat(colour['g']) * (1 - parsedAmount)),
            Math.round(parseFloat(colour['b']) * (1 - parsedAmount))
        ];

    if (colour.hasOwnProperty('a')) darkenedColour.push(parseFloat(colour['a']));
    return darkenedColour;
}


/**
 *  Lightens passed colour by passed amount.
 * 
 *  @param {IRGB} colour - RGB-formatted colour to lighten
 *  @param {string} amount - Amount to lighten by. Accepts both percentage and decimal
 */

export function lightenColour(colour: IRGB, amount: string) {
    let parsedAmount: number = amount.indexOf('%') != -1 ? parseFloat(amount.replace('%', '')) / 100 : parseFloat(amount),
        lightenedColour: number[] = [
            Math.round(parseFloat(colour['r']) + (parsedAmount * (255 - parseFloat(colour['r'])))),
            Math.round(parseFloat(colour['g']) + (parsedAmount * (255 - parseFloat(colour['g'])))),
            Math.round(parseFloat(colour['b']) + (parsedAmount * (255 - parseFloat(colour['b']))))
        ];

    if (colour.hasOwnProperty('a')) lightenedColour.push(parseFloat(colour['a']));
    return lightenedColour;
}


/**
 *  Changes the opacity of passed colour to the passed amount.
 * 
 *  @param {IRGB} colour - RGB-formatted colour to modify the opacity of
 *  @param {string} amount - Amount to change the opacity to. Accepts both percentage and decimal
 */

export function opacityColour(colour: IRGB, amount: string) {
    let parsedAmount: number = amount.indexOf('%') != -1 ? parseFloat(amount.replace('%', '')) / 100 : parseFloat(amount);
    return [colour['r'], colour['g'], colour['b'], parsedAmount];
}