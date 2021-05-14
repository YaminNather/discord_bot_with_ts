import { Message } from "discord.js";
import { container } from "tsyringe";
import Failure from "../../common/datatypes/failure/failure";
import LanguagesService from "../../language_bounded_context/application/language_service";
import Command from "../input_command/command";
import CommandProcessor from "./command_processor";

export default class GetAllBadWordsCommandProcessor extends CommandProcessor {
    public fcheckCompatibilityWithCommand(command: Command): boolean {
        return super.fcheckCompatibilityWithCommand(command) && command.mparameters.length == 0;
    }

    public async fhandleCommand(message: Message, command: Command): Promise<void | Failure> {
        
    }

    public fgetName(): string {
        return this.mname;
    }

    public fgetSyntax(): string {
        return this.msyntax;
    }

    

    private readonly mname: string = `getallbadwords`;
    private readonly msyntax: string = `!${this.mname}`;

    private mlanguagesService: LanguagesService = container.resolve(LanguagesService); 
}