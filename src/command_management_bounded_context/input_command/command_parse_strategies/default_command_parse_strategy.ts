import Command from "../command";
import ICommandParseStrategy from "../i_command_parse_strategy";

export default class DefaultCommandParseStrategy implements ICommandParseStrategy {
    // public fparseCommand(commandStr: string): Command {
    //     const splitCommandStr: string[] = commandStr.split(" ");
        
    //     const name: string = splitCommandStr[0].slice(1);
        
    //     const parameters: string[] = [];
    //     for(let i: number = 1; i < splitCommandStr.length; i++)
    //         parameters.push(splitCommandStr[i]);

    //     return new Command(name, parameters);
    // }

    public fparseCommand(commandStr: string): Command {
        let name: string = "";     
        
        let index: number = 1;

        for(; index < commandStr.length && commandStr[index] != " "; index++)
            name += commandStr[index];
            
        const parameters: string[] = [];
        let parameter: string = "";
        let inQuotes: boolean = false;
        for(index += 1; index < commandStr.length; index++) {
            const ch: string  = commandStr[index];
            
            if(!inQuotes) {
                if(ch == '"')
                    inQuotes = true;
                else if(ch == " ") {
                    if(commandStr[index - 1] != '"') {
                        parameters.push(parameter);
                    
                        parameter = "";
                    }
                }
                else 
                    parameter += ch;                
            }
            else {
                if(ch == '"') {
                    parameters.push(parameter);
                    
                    parameter = "";
                    
                    inQuotes = false;
                }
                else
                    parameter += ch;                
            }
        }

        if(parameter != "")
            parameters.push(parameter);

        return new Command(name, parameters);
    }
}