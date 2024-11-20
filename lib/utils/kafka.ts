import { Kafka, Producer, Consumer, EachMessagePayload } from "kafkajs";

import { config } from "dotenv";
import { getAllKafkaTopicsFromSchema } from "../ModelDirective/util";
import { GraphQLSchema } from "graphql";
config();

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [process.env.KAFKA_HOST as string],
});

const producer: Producer = kafka.producer();
const consumer: Consumer = kafka.consumer({
  groupId: process.env.KAFKA_GROUP_ID as string,
});

export async function handleKafkaTopicCreation(schema: GraphQLSchema) {
  const topics = getAllKafkaTopicsFromSchema(schema);
  console.log({ topics });

  const admin = kafka.admin();
  await admin.connect();

  // check existing topics and filter out the ones that don't exist
  const existingTopics = await admin.listTopics();
  const topicsToCreate = topics.filter(
    (topic) => !existingTopics.includes(topic)
  );

  // create kafka topics if they don't exist
  if (topicsToCreate.length) {
    await admin.createTopics({
      topics: topics.map((topic) => ({ topic })),
    });
  }
}

export async function connectKafka(schema: GraphQLSchema): Promise<void> {
  await handleKafkaTopicCreation(schema);
  await producer.connect();
  await consumer.connect();
}

export async function publishMessage(
  topic: string,
  message: Record<string, any>
): Promise<void> {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
}

export async function consumeMessages(
  topic: string,
  onMessage: (message: Record<string, any>) => void
): Promise<void> {
  await consumer.subscribe({ topic });
  await consumer.run({
    eachMessage: async ({ message }: EachMessagePayload) => {
      if (message.value) {
        onMessage(JSON.parse(message.value.toString()));
      }
    },
  });
}
