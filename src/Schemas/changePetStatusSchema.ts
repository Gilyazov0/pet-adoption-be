const changePetStatusSchema = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        petId: { type: "number" },
      },
      required: ["petId"],
    },
  },
};

export default changePetStatusSchema;
