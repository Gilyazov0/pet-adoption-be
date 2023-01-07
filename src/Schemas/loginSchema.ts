const loginSchema = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        email: { type: "string" },
        password: { type: "string" },
      },
      required: ["email", "password"],
    },
  },
  required: ["data"],
};

export default loginSchema;
