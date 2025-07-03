import { Kafka, Producer } from 'kafkajs';
import { Logger } from '../common/utils/Logger';

export class KafkaProducer {
    
  private producer: Producer;
  private topic: string;

  constructor(broker: string, topic: string) {
    try {
      const kafka = new Kafka({ brokers: [broker] });
      this.producer = kafka.producer();
      this.topic = topic;
      Logger.info(`KafkaProducer initialized for topic '${this.topic}' with broker '${broker}'`);
    } catch (error) {
      Logger.error('Failed to initialize KafkaProducer:', error);
      throw error;
    }
  }

  async connect() {
    try {
      await this.producer.connect();
      Logger.info(`Connected to Kafka broker for topic '${this.topic}'`);
    } catch (error) {
      Logger.error(`Failed to connect to Kafka broker for topic '${this.topic}':`, error);
      throw error;
    }
  }

  async sendMessage(message: object) {
    try {
      await this.producer.send({
        topic: this.topic,
        messages: [{ value: JSON.stringify(message) }],
      });
      Logger.info(`Message sent to topic '${this.topic}':`, message);
    } catch (error) {
      Logger.error(`Failed to send message to topic '${this.topic}':`, error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.producer.disconnect();
      Logger.info(`Disconnected from Kafka broker for topic '${this.topic}'`);
    } catch (error) {
      Logger.error(`Failed to disconnect from Kafka broker for topic '${this.topic}':`, error);
      throw error;
    }
  }
}
