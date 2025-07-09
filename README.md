# TypeScript Kafka Microservices POC

This project demonstrates a simple microservice architecture using TypeScript and Kafka. It consists of three independent services communicating via Kafka events:

## Microservices

1. **user-service**
   - Emits `usercreated` events to Kafka for 12 times.
   - User fields: `id`, `name`, `surname`, `nationality`, `dateOfBirth` (Date), `dateCreated` (Date).

2. **order-service**
   - Listens for `usercreated` events from Kafka.
   - Emits `ordercreated` events to Kafka.

3. **email-service**
   - Listens for `ordercreated` events from Kafka.
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
3. **Set up Kafka and Zookeeper using Docker (recommended and tested way):**

   ```sh
   docker network create kafka-net

   docker run -d --name zookeeper --network kafka-net -p 2181:2181 -e ALLOW_ANONYMOUS_LOGIN=yes bitnami/zookeeper:latest

   docker run -d --name kafka --network kafka-net -p 9092:9092 ^
     -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 ^
     -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 ^
     -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 ^
     -e OFFSETS_TOPIC_REPLICATION_FACTOR=1 ^
     confluentinc/cp-kafka:7.5.3
   ```

   > **Note:** Use `^` for line continuation in PowerShell, or replace with `\` if using bash.

   **Create your topic (avoid underscores in topic names):**
   ```sh
   docker exec kafka kafka-topics --create --topic usercreated --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
   ```

   Or use a `docker-compose.yml` for easier management.

4. **Run the user service:**
   ```sh
   node dist/user-service/index.js
   ```

## Docker Troubleshooting

- **Kafka can't connect to Zookeeper:**  
  Ensure both containers are on the same Docker network (`kafka-net`).  
  Check with `docker network inspect kafka-net`.

- **Kafka client can't connect to broker:**  
  Make sure `KAFKA_ADVERTISED_LISTENERS` matches the address your client uses (usually `localhost:9092` for local dev).

- **Check Kafka listeners (to verify advertised and actual listeners):**  
  ```sh
  docker exec kafka printenv | findstr LISTENERS
  ```
  This will show the values of `KAFKA_LISTENERS` and `KAFKA_ADVERTISED_LISTENERS` inside the container.

- **Topic has no leader:**  
  Wait a few seconds after starting Kafka, or restart the Kafka container.  
  Check topic status:
  ```sh
  docker exec kafka kafka-topics --describe --topic usercreated --bootstrap-server localhost:9092
  ```
  If `Leader: none`, restart Kafka and check again.

- **Remove and recreate containers:**  
  ```sh
  docker rm -f kafka zookeeper
  ```

- **Remove and recreate topic:**  
  ```sh
  docker exec kafka kafka-topics --delete --topic usercreated --bootstrap-server localhost:9092
  docker exec kafka kafka-topics --create --topic usercreated --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
  ```

- **Check logs for errors:**  
  ```sh
  docker logs kafka
  docker
  ```

- **The group coordinator is not available**  
  Create __consumer_offsets manually via:
  ```sh
  docker exec kafka kafka-topics --create --topic __consumer_offsets --bootstrap-server localhost:9092 --partitions 50 --replication-factor 1 --config cleanup.policy=compact
  ```
  
  Check with:
  ```sh
  docker exec kafka kafka-topics --describe --topic __consumer_offsets --bootstrap-server localhost:9092
  ```

## Requirements
- Node.js
- Docker (for Kafka/Zookeeper)
- Kafka broker (local or remote)

## Notes
- Each service is independent and communicates only via Kafka events.
- Dates are handled as `Date` objects in code and serialized to ISO strings for transport.
- This is a proof of concept for testing purposes.
- **Tip:** Avoid underscores in Kafka topic names