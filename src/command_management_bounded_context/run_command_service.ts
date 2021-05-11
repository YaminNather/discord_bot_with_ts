import { Message, MessageFlags } from "discord.js";
import Failure from "../common/datatypes/failure/failure";
import AddBadWordCommandProcessor from "./command_processor/add_bad_word_command_processor";
import AddLanguageCommandProcessor from "./command_processor/add_language_command_processor";
import CommandProcessor from "./command_processor/command_processor";
import { GetLanguageCommandProcessor } from "./command_processor/get_language_command_processor";
import HelpCommandProcessor from "./command_processor/help_command_processor";
import Command from "./input_command/command";

export default class RunCommandService {
    constructor() {
        const commandProcessorsList: CommandProcessor[] = [];
        commandProcessorsList.push(new GetLanguageCommandProcessor());
        commandProcessorsList.push(new AddLanguageCommandProcessor());
        commandProcessorsList.push(new AddBadWordCommandProcessor());
        commandProcessorsList.push(new HelpCommandProcessor());

        for(const commandProcessor of commandProcessorsList)
            this.mcommandProcessors.set(commandProcessor.fgetName(), commandProcessor);                
    }

    public async frunCommand(message: Message, command: Command): Promise<void> {
        const commandProcessors: Map<string, CommandProcessor> = this.mcommandProcessors;

        const commandProcessor: CommandProcessor | undefined = commandProcessors.get(command.mname);
    
        if(commandProcessor == undefined) {
            const errorMsg: string = `Command not available - ${command.mname}`;            
            console.log(errorMsg);
            await message.reply(errorMsg);
            
            return;
        }

        if(!commandProcessor.fcheckCompatibilityWithCommand(command)) {
            const errorMsg: string = `Format of command is invalid - ${command.mname}`;            
            console.log(errorMsg);
            await message.reply(errorMsg);

            return;
        }

        const handleCommandRes: void | Failure = await commandProcessor.fhandleCommand(message, command);    

        if(handleCommandRes instanceof Failure)
            console.log(handleCommandRes.msg);
    }

    private readonly mcommandProcessors: Map<string, CommandProcessor> = new Map<string, CommandProcessor>();
}