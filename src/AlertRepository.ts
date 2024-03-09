
import { Database } from "sqlite3";
import { Alert, AlertConfig } from "./Alert";
import { SqliteRepository } from "./SqliteRepository";

interface AlertRow {
    TOPIC: string,
    MIN_THRESHOLD: number | null,
    MAX_THRESHOLD: number | null
}

const CREATE_TABLE_QUERY = `
    CREATE TABLE IF NOT EXISTS ${AlertConfig.TABLE_NAME} (
        TOPIC TEXT PRIMARY KEY,
        MIN_THRESHOLD REAL,
        MAX_THRESHOLD REAL
    )
`;

function MapRowToAlert(alertRow: AlertRow, i?: number, alerts?: AlertRow[]): Alert{
    return {
        topic: alertRow.TOPIC,
        min: alertRow.MIN_THRESHOLD,
        max: alertRow.MAX_THRESHOLD,
    }
}

export class AlertRepository extends SqliteRepository {
    
    protected GenerateTableQuery(): string {
        return CREATE_TABLE_QUERY;
    }

    public constructor(db: Database) {
        super(db);
    }

    readonly GET_QUERY = `SELECT * FROM ${AlertConfig.TABLE_NAME}`;
    public async GetAlerts() {
        const db = await this.preparedDb;
        return this.Promisify<AlertRow[]>((callback)=>{
            db.all<AlertRow>(this.GET_QUERY, [], callback);
        }).then(all=>all.map(MapRowToAlert))
    }

    readonly INSERT_QUERY = `INSERT INTO ${AlertConfig.TABLE_NAME} (TOPIC, MIN_THRESHOLD, MAX_THRESHOLD) VALUES (?, ?, ?)`;
    public async CreateAlert(alert: Alert) {
        const db = await this.preparedDb;
        return this.Promisify((callback)=>{
            db.run(this.INSERT_QUERY, [alert.topic, alert.min, alert.max], callback);
        });
    }

    readonly UPDATE_QUERY = `UPDATE ${AlertConfig.TABLE_NAME} SET MIN_THRESHOLD = ?, MAX_THRESHOLD = ? WHERE TOPIC = ?;`;
    public async UpdateAlert(alert: Alert) {
        const db = await this.preparedDb;
        return this.Promisify((callback)=>{
            db.run(this.UPDATE_QUERY, [alert.min, alert.max, alert.topic], callback);
        });
    }

}