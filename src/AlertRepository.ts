
import { Database } from "sqlite3";
import { Alert, AlertConfig } from "@/src/Alert";
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

function Map(alertRow: AlertRow, i?: number, alerts?: AlertRow[]): Alert{
    return {
        topic: alertRow.TOPIC,
        min: alertRow.MIN_THRESHOLD,
        max: alertRow.MAX_THRESHOLD,
    }
}

export type ErrorConsumer = (err: Error) => void;
export type AlertConsumer = (Alerts: Alert) => void;
export type AlertsConsumer = (Alerts: Alert[]) => void;

export class AlertRepository extends SqliteRepository {
    
    protected GenerateTableQuery(): string {
        return CREATE_TABLE_QUERY;
    }

    public constructor(db: Database) {
        super(db);
    }

    public async GetAlerts() {
        const query = `SELECT * FROM ${AlertConfig.TABLE_NAME}`;
        const db = await this.preparedDb;
        return this.Promisify<AlertRow[]>((callback)=>{
            db.all<AlertRow>(query, [], callback);
        }).then(all=>all.map(Map))
    }

    public async CreateAlert(alert: Alert) {
        const insert = `INSERT INTO ${AlertConfig.TABLE_NAME} (TOPIC, MIN_THRESHOLD, MAX_THRESHOLD) VALUES (?, ?, ?)`;
        const db = await this.preparedDb;
        return this.Promisify((callback)=>{
            db.run(insert, [alert.topic, alert.min, alert.max], callback);
        });
    }

}