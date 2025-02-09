const testGenerateSchema = {
    $id: "testGenerateSchema",
    type: "object",
    properties: {
        customers: {
            type: "array",
            items: { $ref: "customerSchema#" }
        },
        offers: {
            type: "array",
            items: { $ref: "offerSchema#" }
        }
    }
};

const testGenerateOptions = {
    schema: {
        response: {
            201: {
                type: "object",
                properties: {
                    customers: { type: "array", items: { $ref: "customerSchema#" } },
                    offers: { type: "array", items: { $ref: "offerSchema#" } }
                }
            }
        }
    }
};

export { testGenerateSchema, testGenerateOptions };