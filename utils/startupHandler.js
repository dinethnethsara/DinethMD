const chalk = require('chalk');
const figlet = require('figlet');
const { createAsciiArt, createGradientArt, getRandomTemplate, wrapWithTemplate } = require('./asciiArtHandler');

const displayStartupBanner = async () => {
    // Display ASCII art banner with gradient and template
    console.log('\n');
    const asciiArt = await createAsciiArt('Dineth MD', 'Big');
    const template = getRandomTemplate();
    const bannerWithTemplate = wrapWithTemplate(asciiArt, template);
    console.log(createGradientArt(bannerWithTemplate));
    console.log('\n');

    // Display bot information
    console.log(chalk.green('╔════════════════════════════════════╗'));
    console.log(chalk.green('║         ') + chalk.yellow('WhatsApp Bot Status') + chalk.green('        ║'));
    console.log(chalk.green('╠════════════════════════════════════╣'));
    console.log(chalk.green('║ ') + chalk.white('Version      : v1.0.0           ') + chalk.green('║'));
    console.log(chalk.green('║ ') + chalk.white('Author       : Dineth           ') + chalk.green('║'));
    console.log(chalk.green('║ ') + chalk.white('Description  : WhatsApp Bot MD  ') + chalk.green('║'));
    console.log(chalk.green('╚════════════════════════════════════╝\n'));
};

const displayConnectionStatus = (status, details = '') => {
    const timestamp = new Date().toLocaleTimeString();
    const statusColor = {
        connecting: chalk.yellow,
        connected: chalk.green,
        error: chalk.red
    }[status] || chalk.white;

    console.log(
        chalk.blue(`[${timestamp}]`),
        statusColor(`[${status.toUpperCase()}]`),
        details
    );
};

module.exports = {
    displayStartupBanner,
    displayConnectionStatus
};