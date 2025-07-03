import { Kafka, Producer } from 'kafkajs';

export class KafkaProducer {
    
  private producer: Producer;
  private topic: string;

  constructor(broker: string, topic: string) {
    const kafka = new Kafka({ brokers: [broker] });
    this.producer = kafka.producer();
    this.topic = topic;
  }

  async connect() {
    await this.producer.connect();
  }

  async sendMessage(message: object) {
    await this.producer.send({
      topic: this.topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }

  async disconnect() {
    await this.producer.disconnect();
  }
}
