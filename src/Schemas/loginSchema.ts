const loginSchema = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        email: { type: "string" },
        password: { type: "string" },
      },
    },
  },
};

export default loginSchema;
