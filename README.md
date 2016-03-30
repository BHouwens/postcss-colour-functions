# postcss-colour-functions

[![Packagist](https://img.shields.io/packagist/l/doctrine/orm.svg)]()

PostCSS plugin for Sass-like colour functions.

## Install

    npm install postcss-colour-functions --save

Then just require it in whatever task runner you prefer like so:

    var colourFunctions = require('postcss-colour-functions');

## Colour Functions

The plugin expects colours to be entered in either RGB or hexidecimal format. No HSL or RGBA is usable as yet. 

### darken

Darkens a colour by a specific amount, specified either as a decimal or percentage:

    /* so this */
    
    .element{
        color: darken(#00b, 20%); // you could also use '0.2' instead of '20%'
    }
    
    
    /* becomes this */
    
    .element{
        color: rgb(0.00,27.20,37.40);
    }

### lighten

The same as `darken`, except it tints the colour as opposed to shading it:

    /* so this */
    
    .element{
        color: lighten(#00b, 20%); // you could also use '0.2' instead of '20%'
    }
    
    
    /* becomes this */
    
    .element{
        color: rgb(51.00,159.80,200.60);
    }
    
### opacity

Specify an opacity for a given colour. This returns an `rgba` value:

    /* so this */
    
    .element{
        color: opacity(#00b, 20%); // you could also use '0.2' instead of '20%'
    }
    
    
    /* becomes this */
    
    .element{
        color: rgba(0,136,187,0.2);
    }
    
## License

MIT

If you have any improvements I'm super keen to pull them in.