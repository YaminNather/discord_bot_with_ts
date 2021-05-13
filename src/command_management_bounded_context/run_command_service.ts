import { Message } from "discord.js";
import { autoInjectable } from "tsyringe";
import Failure from "../common/datatypes/failure/failure";
import CommandProcessor from "./command_processor/command_processor";
import CommandProcessorsList from "./command_processors_list";
import Command from "./input_command/command";

@autoInjectable()
export default class RunCommandService {
    public constructor(mcommandProcessorsList: CommandProcessorsList) {
        this.mcommandProcessorsList = mcommandProcessorsList;
    }

    public async frunCommand(message: Message, command: Command): Promise<void> {
        const commandProcessor: CommandProcessor | undefined = this.mcommandProcessorsList.fget(command.mname);
    
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



    
    private mcommandProcessorsList: CommandProcessorsList;
}