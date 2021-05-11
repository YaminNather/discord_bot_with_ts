import * as SQLite from "sqlite";
import * as SQLite3 from "sqlite3";

function fprintQueryResult(result: any[]): void {
    console.log(`Query Result:`);
    for(let i: number = 0; i < result.length; i++) {
        console.log(`id = ${result[i].id}, name = ${result[i].name}, age = ${result[i].age}`);
    }
}

async function main(): Promise<void> {
    SQLite3.verbose();

    const db: SQLite.Database = await SQLite.open({ driver: SQLite3.Database, filename: "D:/Yamin/Temp/Temporary database/a.db"});    
    console.log("Database created and opened");    

    await db.close();
    return;

    await db.exec(
        `CREATE TABLE students(
            id INTEGER PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            age INTEGER NOT NULL
        );`
    );
    console.log("students table created");

    await db.run(`INSERT INTO students VALUES(0, 'Name0', 0)`);
    console.log("Inserted student 0");

    await db.run(`INSERT INTO students VALUES(1, 'Name1', 1)`);
    console.log("Inserted student 1");

    const queryResult = await db.all("SELECT * from students;");    

    fprintQueryResult(queryResult);    

    db.close();
}

main();