import { Kafka, Consumer } from 'kafkajs';
import { Logger } from '../common/utils/Logger';

export class KafkaConsumer {

    private consumer: Consumer;
    private topic: string;

    constructor(broker: string, topic: string, groupId: string) {
        const kafka = new Kafka({ brokers: [broker] });
        this.consumer = kafka.consumer({ groupId });
        this.topic = topic;
    }

    async connect() {
        await this.consumer.connect();
        Logger.debug(`Connected to Kafka as consumer for topic '${this.topic}'`);
    }

    async subscribe(onMessage: (message: any) => Promise<void>) {

        Logger.debug(`Subscribing to topic '${this.topic}'`);
        
        if (!this.consumer.connect()) {
            Logger.warn(`Consumer is not connected. Attempting to connect to topic '${this.topic}'`);
            await this.connect();
        }

        await this.consumer.subscribe({ topic: this.topic, fromBeginning: false });
        await this.consumer.run({
            eachMessage: async ({ message }) => {
                Logger.debug(`Received message from topic '${this.topic}': ${message.value?.toString()}`);
                // Parse the message value and pass it to the onMessage handler
                if (message.value) {
                await onMessage(JSON.parse(message.value.toString()));
                }
            },
        });
    }

}