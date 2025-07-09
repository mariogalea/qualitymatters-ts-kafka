import { KafkaConsumer } from './KafkaConsumer';
import { Logger } from '../common/utils/Logger';

// Simulating email sending service
// In a real-world scenario, you would integrate with an email service provider (e.g., SendGrid, Mailgun, etc.) 
export class EmailApp {

    private consumer: KafkaConsumer;

    constructor(broker: string, orderTopic: string) {
        this.consumer = new KafkaConsumer(broker, orderTopic, 'emailservicegroup');
        Logger.debug(`EmailApp initialized with broker '${broker}' and order topic '${orderTopic}'`);
    }

    async run() {
        Logger.debug('Starting Email service...');
        await this.consumer.connect();
        Logger.debug('Connected to Kafka broker as consumer for email service.');
        await this.consumer.subscribe(async (msg) => {
            if (msg.event === 'ordercreated' && msg.order?.id) {
                Logger.info(`Simulated email sent for order: ${msg.order.id} (user: ${msg.order.userId})`);
            }
        });
        Logger.info('Email service is running and listening for ordercreated events.');
        process.stdin.resume();
    }
}