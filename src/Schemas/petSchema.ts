const petSchema = {
  properties: {
    data: {
      type: "object",
      properties: {
        type: { enum: ["Dog", "Cat", "Other"] },
        name: "string",
        adoptionStatus: { enum: ["Adopted", "Available", "Fostered"] },
        picture: "string",
        height: "number",
        weight: "number",
        color: "string",
        bio: "string",
        hypoallergenic: "boolean",
        dietary: "string",
        breed: "string",
      },
    },
  },
};

export default petSchema;
