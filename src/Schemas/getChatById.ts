const getChatById = {
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

export default getChatById;
