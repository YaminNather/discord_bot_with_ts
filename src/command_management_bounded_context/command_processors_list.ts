import { autoInjectable, injectable } from "tsyringe";
import AddBadWordCommandProcessor from "./command_processor/add_bad_word_command_processor";
import AddLanguageCommandProcessor from "./command_processor/add_language_command_processor";
import CommandProcessor from "./command_processor/command_processor";
import GetAllBadWordsCommandProcessor from "./command_processor/get_all_bad_words_command_processor";
import GetAllLanguagesCommandProcessor from "./command_processor/get_all_languages_command_processor";
import { GetLanguageCommandProcessor } from "./command_processor/get_language_command_processor";
import HelpCommandProcessor from "./command_processor/help_command_processor";
import RemoveBadWordCommandProcessor from "./command_processor/remove_bad_word_command_processor";
import Command from "./input_command/command";

export default class CommandProcessorsList {
    public constructor() {
        const commandsArray: CommandProcessor[] = [
            new GetLanguageCommandProcessor(),
            new AddLanguageCommandProcessor(),
            new AddBadWordCommandProcessor(),
            new HelpCommandProcessor(this),
            new RemoveBadWordCommandProcessor(),
            new GetAllLanguagesCommandProcessor(),
            new GetAllBadWordsCommandProcessor()
        ];

        for(const command of commandsArray) {
            this.mprocessors.set(command.fgetName(), command);
        }
    }

    public fgetAll(): CommandProcessor[] {
        const r: CommandProcessor[] = [];

        for(const processor of this.mprocessors.values())
            r.push(processor);        

        return r;
    }

    public fget(name: string): CommandProcessor | undefined {
        return this.mprocessors.get(name);
    }

    public readonly mprocessors: Map<string, CommandProcessor> = new Map<string, CommandProcessor>();
}