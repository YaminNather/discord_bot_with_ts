import { Message } from "discord.js";
import Failure from "../../common/datatypes/failure/failure";
import Command from "../input_command/command";
import CommandProcessor from "./command_processor"

export default class HelpCommandProcessor extends CommandProcessor {
    public fcheckCompatibilityWithCommand(command: Command): boolean {
        return super.fcheckCompatibilityWithCommand(command) && command.mparameters.length == 0;
    }

    public async fhandleCommand(message: Message, command: Command): Promise<void | Failure> {
        await message.reply(
            `\n!addlanguage <language>\n!addbadwords <language> <name> <meaning>\n!getbadwords <language>`
        );        
    }

    public fgetName(): string {
        return this.mname;
    }

    private readonly mname: string = "help";
    
}