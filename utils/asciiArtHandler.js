const figlet = require('figlet');
const gradient = require('gradient-string');

const asciiArtTemplates = {
    heart: `
      ♥♥   ♥♥
    ♥♥♥♥♥♥♥♥
    ♥♥♥♥♥♥♥♥
      ♥♥♥♥
        ♥
    `,
    star: `
        ★
      ★ ★ ★
    ★ ★ ★ ★ ★
      ★ ★ ★
        ★
    `,
    flower: `
      _\/_
       /\
      /  \
     /    \
    /      \
    `,
    butterfly: `
    Ƹ̵̡Ӝ̵̨̄Ʒ
    `,
    crown: `
     ♔
    `,
    music: `
     ♪ ♫ ♩
    ♬ ♪ ♫
    `,
    diamond: `
      /\
     /  \
    <    >
     \  /
      \/
    `,
    sword: `
      /\
     |==|
     |==|
     |==|
    _|__|_
    `,
    castle: `
    [^]_[^]
    |=|_|=|
    |_____|
    `,
    wave: `
    ～～～～
    ≈≈≈≈≈≈
    ~~~~~~
    `,
    robot: `
     [○_○]
    /|___|\
     d   b
    `,
    cat: `
     /\___/\
    (  o o  )
    (  =^=  )
     (____)
    `
};

const createAsciiArt = async (text, font = 'Standard') => {
    return new Promise((resolve, reject) => {
        figlet.text(text, {
            font: font,
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 80,
            whitespaceBreak: true
        }, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
};

const getRandomTemplate = () => {
    const templates = Object.keys(asciiArtTemplates);
    const randomIndex = Math.floor(Math.random() * templates.length);
    return asciiArtTemplates[templates[randomIndex]];
};

const wrapWithTemplate = (text, template) => {
    const art = template || getRandomTemplate();
    return `${art}\n${text}`;
};

const createGradientArt = (text) => {
    const colors = [
        { name: 'rainbow', gradient: gradient(['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8F00FF']) },
        { name: 'sunset', gradient: gradient(['#FF512F', '#F09819', '#FF512F']) },
        { name: 'ocean', gradient: gradient(['#2E3192', '#1BFFFF']) },
        { name: 'forest', gradient: gradient(['#11998e', '#38ef7d']) },
        { name: 'purple', gradient: gradient(['#DA22FF', '#9733EE']) },
        { name: 'fire', gradient: gradient(['#FF416C', '#FF4B2B']) },
        { name: 'cosmic', gradient: gradient(['#8E2DE2', '#4A00E0']) },
        { name: 'aurora', gradient: gradient(['#00C9FF', '#92FE9D']) },
        { name: 'candy', gradient: gradient(['#FF61D2', '#FE9090']) },
        { name: 'neon', gradient: gradient(['#00FFA3', '#DC1FFF']) }
    ];

    const randomGradient = colors[Math.floor(Math.random() * colors.length)];
    return randomGradient.gradient(text);
};

module.exports = {
    createAsciiArt,
    getRandomTemplate,
    wrapWithTemplate,
    createGradientArt,
    templates: asciiArtTemplates
};