import "reflect-metadata";
import discord from "discord.js";
import gfdependencyInjection from "./dependency_injection";
import ICommandParseStrategy from "./command_management_bounded_context/input_command/i_command_parse_strategy";
import DefaultCommandParseStrategy from "./command_management_bounded_context/input_command/command_parse_strategies/default_command_parse_strategy";
import Command from "./command_management_bounded_context/input_command/command";
import CommandStringSpecification from "./command_management_bounded_context/input_command/command_string_specification";
import { container } from "tsyringe";
import RunCommandService from "./command_management_bounded_context/run_command_service";


async function main(): Promise<void> {
    gfdependencyInjection();

    const client: discord.Client = new discord.Client();    
    gfsetupClient(client);

    const token: string = "ODMxNDgzMDUwMTQyNTk3MTYx.YHV47w.ubJ8Cnczbp3vDsFvAHW0AiI9yR8";
    await client.login(token);
}

function gfsetupClient(client: discord.Client) {
    client.on('ready', () => console.log("Discord bot is ready"));    

    client.on('message', (message) => gfprocessMessage(message));
}

async function gfprocessMessage(message: discord.Message): Promise<void> {
    console.log(`Message recieved - ${message.content}`);

    const content: string = message.content.toLowerCase();
    if(!content.startsWith('!'))
        return;
    
    const commandStringSpecification: CommandStringSpecification = new CommandStringSpecification();    

    if(commandStringSpecification.fcheckValidity(content) == false) {
        const errorMsg: string = `invalid format for a command - "${content}"`;
        await message.reply(errorMsg);
        console.log(errorMsg);
        
        return;
    }

    const commandStrParser: ICommandParseStrategy = new DefaultCommandParseStrategy();
    const command: Command = commandStrParser.fparseCommand(content);

    console.log(`Command to be processed - ${command.ftoString()}`); 
    
    await gmrunCommandService.frunCommand(message, command);    
}

gfdependencyInjection();

const gmrunCommandService: RunCommandService = container.resolve(RunCommandService);

main();