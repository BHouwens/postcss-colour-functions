var postcss = require('postcss');

var plugin = require('./');

function run(input, output, opts) {
    return postcss([ plugin(opts) ]).process(input)
        .then(result => {
            expect(result.css).toEqual(output);
            expect(result.warnings().length).toBe(0);
        });
}

it('darkens a colour by percentage', () => {
    return run('color: darken(#00b, 20%);', 'color: rgb(0,0,150);', { });
});

it('darkens a colour by decimal value', () => {
    return run('color: darken(#00b, 0.2);', 'color: rgb(0,0,150);', { });
});

it('lightens a colour by percentage', () => {
    return run('color: lighten(#00b, 20%);', 'color: rgb(51,51,201);', { });
});

it('lightens a colour by decimal value', () => {
    return run('color: lighten(#00b, 0.2);', 'color: rgb(51,51,201);', { });
});

it('changes the opacity of a colour by percentage', () => {
    return run('color: opacity(#00b, 20%);', 'color: rgba(0,0,187,0.2);', { });
});

it('changes the opacity of a colour by decimal value', () => {
    return run('color: opacity(#00b, 0.2);', 'color: rgba(0,0,187,0.2);', { });
});

it('acts upon a colour using one of the basic CSS colour codes', () => {
    return run('color: opacity(red, 0.2);', 'color: rgba(255,0,0,0.2);', { });
});