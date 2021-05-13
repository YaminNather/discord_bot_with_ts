import { Message } from "discord.js";
import Failure from "../../common/datatypes/failure/failure";
import CommandProcessorsList from "../command_processors_list";
import Command from "../input_command/command";
import CommandProcessor from "./command_processor"

export default class HelpCommandProcessor extends CommandProcessor {
    public constructor(mcommandProcessorsList: CommandProcessorsList) {
        super();

        this.mcommandProcessorsList = mcommandProcessorsList;
    }

    public fcheckCompatibilityWithCommand(command: Command): boolean {
        return super.fcheckCompatibilityWithCommand(command) && command.mparameters.length < 2;
    }

    public async fhandleCommand(message: Message, command: Command): Promise<void | Failure> {        
        if(command.mparameters.length == 0) {
            let reply: string = "Commands available:";
            for(const processor of this.mcommandProcessorsList.fgetAll())
                reply += `\n${processor.fgetSyntax()}`;

            await message.reply(reply);

            return;
        }
        
        const commandProcessor: CommandProcessor | undefined = this.mcommandProcessorsList.fget(command.mparameters[0]);
        if(commandProcessor == undefined) {
            await message.reply(`Command ${command.mname} not available`);
            
            return;
        }
        
        await message.reply(commandProcessor.fgetSyntax());


    }

    public fgetName(): string {
        return this.mname;
    }

    public fgetSyntax(): string {
        return "!help";
    }



    
    private readonly mname: string = "help";
    
    
    private mcommandProcessorsList: CommandProcessorsList;
}