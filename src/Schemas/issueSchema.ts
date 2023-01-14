const issueSchema = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        text: { type: "string" },
        title: { type: "string" },
      },
      required: ["text", "title"],
    },
  },
  required: ["data"],
};

export default issueSchema;
