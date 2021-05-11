import { Message } from "discord.js";
import { container } from "tsyringe";
import Failure from "../../common/datatypes/failure/failure";
import { gfhasDigits, gfhasSymbols } from "../../common/helpers/string_utils";
import LanguagesService from "../../language_bounded_context/application/language_service";
import Command from "../input_command/command";
import CommandProcessor from "./command_processor";

export default class AddBadWordCommandProcessor extends CommandProcessor {
    public fcheckCompatibilityWithCommand(command: Command): boolean {
        if(!super.fcheckCompatibilityWithCommand(command))
            return false;

        if(command.mparameters.length != 3)
            return false;

        const languageName: string = command.mparameters[0];
        const name: string = command.mparameters[1];
        const meaning: string = command.mparameters[2];
        
        if(gfhasSymbols(languageName) || gfhasDigits(languageName))
            return false;

        if(gfhasSymbols(name) || gfhasDigits(name))
            return false;

        if(gfhasSymbols(meaning) || gfhasDigits(meaning))
            return false;                

        return true;
    }

    public async fhandleCommand(message: Message, command: Command): Promise<void> {
        const languageName: string = command.mparameters[0];
        const name: string = command.mparameters[1];
        const meaning: string = command.mparameters[2];
        
        const addBadWordRes: void | Failure = await this.mlanguagesService.faddBadWord(languageName, name, meaning);        

        if(addBadWordRes instanceof Failure) {
            const errorMsg: string = `Failed to add bad word ${name} - ${addBadWordRes.msg}`;
            
            await message.reply(errorMsg);
            console.log(errorMsg);

            return;
        }

        await message.reply(`Added bad word ${name} - ${meaning}`);
    }

    public fgetName(): string {
        return this.mname;
    }

    private readonly mname = `addbadword`;

    private mlanguagesService: LanguagesService = container.resolve(LanguagesService);
}