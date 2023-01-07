const updateUserSchema = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        userId: { type: "number" },
        data: { type: "object" },
      },
      required: ["userId", "data"],
    },
  },
};

export default updateUserSchema;
