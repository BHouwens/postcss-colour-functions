# postcss-colour-functions

[![Packagist](https://img.shields.io/packagist/l/doctrine/orm.svg)]()
[![downloads](https://img.shields.io/badge/downloads-500%2FM-green.svg)]()

PostCSS plugin for Sass-like colour functions.

.. 

## Install

    npm install postcss-colour-functions --save

Then just require it in whatever task runner you prefer like so:

```javascript
var colourFunctions = require('postcss-colour-functions');
```

..

## Colour Functions

The plugin expects colours to be entered in either RGB/A or hexidecimal format. No HSL is usable as yet. It does also accept some basic CSS colour codes, but the list is by no means exhaustive. 

### darken

Darkens a colour by a specific amount, specified either as a decimal or percentage:

```css
/* so this */
.element{
    color: darken(#00b, 20%); // you could also use '0.2' instead of '20%'
}
    
/* becomes this */
.element{
    color: rgb(0,0,150);
}
```

### lighten

The same as `darken`, except it tints the colour as opposed to shading it:

```css
/* so this */
.element{
    color: lighten(#00b, 20%); // you could also use '0.2' instead of '20%'
}
    
/* becomes this */
.element{
    color: rgb(51,51,201);
}
```
    
### opacity

Specify an opacity for a given colour. This returns an `rgba` value:

```css
/* so this */
.element{
    color: opacity(#00b, 20%); // you could also use '0.2' instead of '20%'
}

/* becomes this */
.element{
    color: rgba(0,0,187,0.2);
}
```
    
..

## License

MIT

If you have any improvements I'm super keen to pull them in.
