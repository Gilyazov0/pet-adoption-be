const issueSchema = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        issueId: { type: "number" },
      },
      required: ["issueId"],
    },
  },
  required: ["data"],
};

export default issueSchema;
