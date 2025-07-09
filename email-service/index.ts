import { EmailApp } from './EmailApp';

const broker = 'localhost:9092';
const orderTopic = 'ordercreated';

// Initialize the EmailApp with the Kafka broker and order topic
// This app will consume messages from the 'ordercreated' topic and simulate sending emails
const app = new EmailApp(broker, orderTopic);
app.run().catch(console.error);