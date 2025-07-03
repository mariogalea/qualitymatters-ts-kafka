# TypeScript Kafka Microservices POC

This project demonstrates a simple microservice architecture using TypeScript and Kafka. It consists of three independent services communicating via Kafka events:

## Microservices

1. **user-service**
   - Emits `user_created` events to Kafka.
   - Uses OOP with TypeScript classes for user and Kafka logic.
   - User fields: `id`, `name`, `surname`, `nationality`, `dateOfBirth` (Date), `dateCreated` (Date).

2. **order-service**
   - Listens for `user_created` events from Kafka.
   - Emits `order_created` events to Kafka.

3. **email-service**
   - Listens for `order_created` events from Kafka.
   - Simulates sending an email when an order is created.

## Structure

```
qualitymatters-ts-kafka/
├── common/
│   └── utils/
│       └── Logger.ts
├── user-service/
│   ├── index.ts
│   ├── UserApp.ts
│   ├── UserService.ts
│   ├── KafkaProducer.ts
│   └── interfaces/
│       └── IUser.ts
├── order-service/
│   └── index.ts
├── email-service/
│   └── index.ts
└── ...
```

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Transpile TypeScript to JavaScript:**
   ```sh
   npx tsc
   ```
3. **Set up Kafka and Zookeeper using Docker:**
   ```sh
   docker run -d --name zookeeper -p 2181:2181 zookeeper:3.8
   docker run -d --name kafka -p 9092:9092 --env KAFKA_ZOOKEEPER_CONNECT=localhost:2181 --env KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 --env KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 --network host confluentinc/cp-kafka:7.5.0
   ```
   Or use a `docker-compose.yml` for easier management.
4. **Run the user service:**
   ```sh
   node dist/user-service/index.js
   ```

## Requirements
- Node.js
- Docker (for Kafka/Zookeeper)
- Kafka broker (local or remote)

## Notes
- Each service is independent and communicates only via Kafka events.
- Dates are handled as `Date` objects in code and serialized to ISO strings for transport.
- This is a proof of concept for testing purposes.
