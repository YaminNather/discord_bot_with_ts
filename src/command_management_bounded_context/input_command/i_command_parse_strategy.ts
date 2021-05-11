import Command from "./command";

export default interface ICommandParseStrategy {
    fparseCommand(commandStr: string): Command; 
}