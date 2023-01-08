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
  required: ["data"],
};

export default changePetStatusSchema;
