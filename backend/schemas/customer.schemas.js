const customerSchema = {
    $id: "customerSchema",
    type: "object",
    properties: {
        id: { type: "integer" },
        name: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        address: { type: "string" },
        created_at: { type: "string" },
        updated_at: { type: "string" },
    },
};

const getCustomersOptions = {
    schema: {
        querystring: {
            type: "object",
            properties: {
                name: { type: "string" },
                email: { type: "string" }
            }
        },
        response: {
            200: {
                type: "array",
                items: { $ref: "customerSchema#" },
            },
        },
    },
};

const getCustomerOptions = {
    schema: {
        params: {
            type: "object",
            properties: {
                id: { type: "integer" },
            },
            required: ["id"],
        },
        response: {
            200: {
                type: "object",
                properties: {
                    customer: { $ref: "customerSchema#" },
                },
            },
        },
    },
};

const createCustomerOptions = {
    schema: {
        body: {
            type: "object",
            properties: {
                name: { type: "string" },
                email: { type: "string" },
                phone: { type: "string" },
                address: { type: "string" },
            },
            required: ["name", "email", "phone", "address"],
        },
        response: {
            201: {
                type: "object",
                properties: {
                    customer: { $ref: "customerSchema#" },
                },
            },
        },
    },
};

const updateCustomerOptions = {
    schema: {
        params: {
            type: "object",
            properties: {
                id: { type: "integer" },
            },
            required: ["id"],
        },
        body: {
            type: "object",
            properties: {
                name: { type: "string" },
                email: { type: "string" },
                phone: { type: "string" },
                address: { type: "string" },
            },
        },
        response: {
            200: {
                type: "object",
                properties: {
                    customer: { $ref: "customerSchema#" },
                },
            },
        },
    },
};

const deleteCustomerOptions = {
    schema: {
        params: {
            type: "object",
            properties: {
                id: { type: "integer" },
            },
            required: ["id"],
        },
        response: {
            200: {
                type: "object",
                properties: {
                    message: { type: "string" },
                },
            },
        },
    },
};

export {
    customerSchema,
    getCustomersOptions,
    getCustomerOptions,
    createCustomerOptions,
    updateCustomerOptions,
    deleteCustomerOptions
};