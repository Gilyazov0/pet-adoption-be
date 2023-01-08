const updateUserSchema = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        userId: { type: "number" },
        data: {
          type: "object",
          properties: {
            email: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            phone: { type: "string" },
            bio: { type: "string" },
            password: { type: "string" },
          },
        },
      },
      required: ["userId", "data"],
    },
  },
  required: ["data"],
};

export default updateUserSchema;
