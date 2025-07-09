import { UserApp } from './UserApp';

const broker = 'localhost:9092';
const topic = 'usercreated';

// Initialize the UserApp with the Kafka broker and user topic
// This app will consume messages from the 'usercreated' topic and simulate user creation
const app = new UserApp(broker, topic);
app.run().catch(console.error);
