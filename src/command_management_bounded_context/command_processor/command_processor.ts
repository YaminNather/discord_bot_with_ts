import { Message } from "discord.js";
import Failure from "../../common/datatypes/failure/failure";
import Command from "../input_command/command";

export default abstract class CommandProcessor {    
    public fcheckCompatibilityWithCommand(command: Command): boolean {
        if(this.fgetName() != command.mname)
            return false;

        return true;
    }

    public abstract fhandleCommand(message: Message, command: Command): Promise<void | Failure>;
    
    public abstract fgetName(): string;

    public abstract fgetSyntax(): string;
}