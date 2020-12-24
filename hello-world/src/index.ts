import { Context, SQSEvent, SQSHandler } from "aws-lambda";

export const handler: SQSHandler = async (
  event: SQSEvent,
  context: Context
): Promise<void> => {
  console.log(event, context);
  event.Records.forEach((record) => {
    const { body } = record;
    console.log(body);
  });

  return Promise.resolve();
};
