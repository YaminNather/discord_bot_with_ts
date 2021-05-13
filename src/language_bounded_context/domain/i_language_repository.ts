import Failure from "../../common/datatypes/failure/failure";
import Language from "./models/language";

interface ILanguageRepository {
    fstore(language: Language): Promise<void | Failure>;
    fget(name: String): Promise<(Language | undefined) | Failure>;
    fcheckAvailability(name: String): Promise<boolean | Failure>;
    fgetAllNames(): Promise<string[] | Failure>;
}

export default ILanguageRepository;