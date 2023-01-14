const chatIdSchema = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        chatId: { type: "number" },
      },
      required: ["chatId"],
    },
  },
  required: ["data"],
};

export default chatIdSchema;
