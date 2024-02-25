
import { Database } from "sqlite3";


export abstract class SqliteRepository {
    protected readonly preparedDb: Promise<Database>;
    public constructor(db: Database) {
        this.preparedDb = this.CreateTable(db);
    }

    protected abstract GenerateTableQuery() : string;

    protected CreateTable(db: Database){
        return this.Promisify<Database>((callback)=>{
            db.run(this.GenerateTableQuery(), [], (err)=>callback(err, db));
        })
    }

    protected Promisify<R>(call: (databaseCallback: (error: Error | null, result: R) => void) => void) {
        return new Promise<R>((resolve, reject)=>{
            call((err, result) => {
                err ? reject(err) : resolve(result)
            });
        });
    }
}