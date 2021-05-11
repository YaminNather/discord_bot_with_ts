export default class CommandStringSpecification {
    fcheckValidity(commandString: string): boolean {
        const splitStr: string[] = commandString.split(" ");
        
        if(splitStr.length == 0)
            return false;

        const commandName: string = splitStr[0];
        
        if(commandName.length < 2)
            return false;
        
        if(!commandName.startsWith("!"))
            return false;

        return true;
    }
}