const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const gradient = require('gradient-string');

class CommandLoader {
    constructor() {
        this.commands = new Map();
        this.categories = new Set();
        this.commandsDir = path.join(__dirname, '../commands');
    }

    async loadCommands() {
        try {
            const categories = fs.readdirSync(this.commandsDir);

            for (const category of categories) {
                const categoryPath = path.join(this.commandsDir, category);
                if (!fs.statSync(categoryPath).isDirectory()) continue;

                this.categories.add(category);
                const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));

                for (const file of commandFiles) {
                    try {
                        const command = require(path.join(categoryPath, file));
                        if (!command.name || !command.execute) continue;

                        command.category = category;
                        this.commands.set(command.name, command);
                        console.log(gradient.rainbow(`✓ Loaded command: ${command.name} (${category})`));
                    } catch (error) {
                        console.error(chalk.red(`✗ Failed to load command from ${file}:`, error));
                    }
                }
            }

            console.log(gradient.pastel(`\n✓ Loaded ${this.commands.size} commands from ${this.categories.size} categories\n`));
        } catch (error) {
            console.error(chalk.red('✗ Failed to load commands:', error));
        }
    }

    getCommand(name) {
        return this.commands.get(name);
    }

    getAllCommands() {
        return Array.from(this.commands.values());
    }

    getCategories() {
        return Array.from(this.categories);
    }

    getCommandsByCategory(category) {
        return Array.from(this.commands.values())
            .filter(cmd => cmd.category === category);
    }

    formatHelpMessage(command) {
        const { name, description, usage, category, aliases = [] } = command;
        return gradient.pastel(`╭─⊣〘 🤖 Command Info 〙
├ Name: ${name}
├ Category: ${category}
├ Description: ${description}
├ Usage: ${usage || `.${name}`}
${aliases.length ? `├ Aliases: ${aliases.join(', ')}\n` : ''}╰────────────────\n🔰 Powered by Dineth MD`);
    }

    formatErrorMessage(error) {
        return gradient.cristal(`❌ Error: ${error}\n🔰 Powered by Dineth MD`);
    }

    formatSuccessMessage(message) {
        return gradient.summer(`✅ ${message}\n🔰 Powered by Dineth MD`);
    }
}

module.exports = new CommandLoader();