const userSchema = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        email: { type: "string", format: "email" },
        phone: { type: "string" },
        firstName: { type: "string" },
        lastName: { type: "string" },
        bio: { type: "string" },
        password: { type: "string" },
      },
      required: ["email", "firstName", "lastName"],
    },
  },
};

export default userSchema;
