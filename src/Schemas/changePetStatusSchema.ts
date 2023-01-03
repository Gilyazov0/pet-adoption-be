const changePetStatusSchema = {
  type: "object",
  properties: {
    petId: { type: "number" },
    userId: { type: "number" },
  },
  required: ["petId", "userId"],
};

export default changePetStatusSchema;
