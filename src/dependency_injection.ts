import "reflect-metadata";
import { container } from "tsyringe";
import SQLiteLanguageRepository from "./language_bounded_context/infrastructure/sqlite_language_repository";
import SupabaseLanguageRepository from "./language_bounded_context/infrastructure/supabase_language_repository";

export default function gfdependencyInjection(): void {
    // container.register("ILanguageRepository", {useValue: new SQLiteLanguageRepository()});
    container.register("ILanguageRepository", {useValue: new SupabaseLanguageRepository()});
}