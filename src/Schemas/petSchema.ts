const petSchema = {
  properties: {
    type: { enum: ["Dog", "Cat", "Other"] },
    name: "string",
    adoptionStatus: { enum: ["Adopted", "Available", "Fostered"] },
    picture: "string",
    height: "number",
    weight: "number",
    color: "string",
    bio: "string",
    hypoallergnic: "boolean",
    dietary: "string",
    breed: "string",
  },
};

export default petSchema;
