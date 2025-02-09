const revenueSchema = {
    $id: "revenueSchema",
    type: "object",
    properties: {
        id: { type: "integer" },
        screening_id: { type: "integer" },
        total_revenue: { type: "number" },
    },
    required: ["screening_id", "total_revenue"],
};

const getRevenuesOptions = {
    schema: {
        response: {
            200: {
                type: "array",
                items: { $ref: "revenueSchema#" },
            },
        },
    },
};

const getRevenueOptions = {
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
                    revenue: { $ref: "revenueSchema#" },
                },
            },
        },
    },
};

const createRevenueOptions = {
    schema: {
        body: {
            type: "object",
            properties: {
                screening_id: { type: "integer" },
                total_revenue: { type: "number" },
            },
            required: ["screening_id", "total_revenue"],
        },
        response: {
            201: {
                type: "object",
                properties: {
                    revenue: { $ref: "revenueSchema#" },
                },
            },
        },
    },
};

const updateRevenueOptions = {
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
                screening_id: { type: "integer" },
                total_revenue: { type: "number" },
            },
        },
        response: {
            200: {
                type: "object",
                properties: {
                    revenue: { $ref: "revenueSchema#" },
                },
            },
        },
    },
};

const deleteRevenueOptions = {
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
    revenueSchema,
    getRevenuesOptions,
    getRevenueOptions,
    createRevenueOptions,
    updateRevenueOptions,
    deleteRevenueOptions,
};