import { Alert, AlertRepository } from '../index.js'
import { Database } from 'sqlite3';
import { describe, test, beforeEach, expect } from "@jest/globals";


function fail(error: Error) {
    throw error;
}
describe('Database operations', () => {
    var alertRepository: AlertRepository;
    // Open a database connection before running tests
    beforeEach(() => {
        alertRepository = new AlertRepository(new Database(':memory:'));
    });
    
    // Close the database connection after running tests
    test('Inserting an alert should work correctly', async () => {
        const givenAlert: Alert = {
           topic: 'givenTopic',
           max: null,
           min: null
        };
        await alertRepository.CreateAlert(givenAlert);
        const alerts = await alertRepository.GetAlerts();
        expect(alerts).toEqual([givenAlert])
    });

    test('Updating an alert should update row in place', async () => {
        const givenInitialAlert: Alert = {
           topic: 'givenTopic',
           max: 10,
           min: 1
        };
        const givenUpdatedAlert: Alert = {
            topic: 'givenTopic',
            max: 20,
            min: 2
         };
        await alertRepository.CreateAlert(givenInitialAlert);
        await alertRepository.UpdateAlert(givenUpdatedAlert);
        const alerts = await alertRepository.GetAlerts();
        expect(alerts).toEqual([givenUpdatedAlert])
    });

});