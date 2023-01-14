const commentSchema = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        text: { type: "string" },
        issueId: { type: "number" },
      },
      required: ["text", "issueId"],
    },
  },
  required: ["data"],
};

export default commentSchema;
