const commentSchema = {
    $id: "commentSchema",
    type: "object",
    properties: {
        id: { type: "integer" },
        offer_id: { type: "integer" },
        author: { type: "string" },
        content: { type: "string" },
        created_at: { type: "string" },
        updated_at: { type: "string" },
    },
};

const getCommentsOptions = {
    schema: {
        querystring: {
            type: "object",
            properties: {
                author: { type: "string" },
                content: { type: "string" }
            }
        },
        response: {
            200: {
                type: "array",
                items: { $ref: "commentSchema#" },
            },
        },
    },
};

const getCommentOptions = {
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
                    comment: { $ref: "commentSchema#" },
                },
            },
        },
    },
};

const getCommentsByOfferIdOptions = {
    schema: {
        params: {
            type: "object",
            properties: {
                offerId: { type: "integer" },
            },
            required: ["offerId"],
        },
        response: {
            200: {
                type: "object",
                properties: {
                    comments: {
                        type: "array",
                        items: { $ref: "commentSchema#" },
                    },
                },
            },
        },
    },
};

const createCommentOptions = {
    schema: {
        body: {
            type: "object",
            properties: {
                offer_id: { type: "integer" },
                author: { type: "string" },
                content: { type: "string" },
            },
            required: ["offer_id", "author", "content"],
        },
        response: {
            201: {
                type: "object",
                properties: {
                    comment: { $ref: "commentSchema#" },
                },
            },
        },
    },
};

const updateCommentOptions = {
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
                offer_id: { type: "integer" },
                author: { type: "string" },
                content: { type: "string" },
            },
            required: ["offer_id", "author", "content"],
        },
        response: {
            200: {
                type: "object",
                properties: {
                    comment: { $ref: "commentSchema#" },
                },
            },
        },
    },
};

const deleteCommentOptions = {
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
    commentSchema,
    getCommentsOptions,
    getCommentOptions,
    createCommentOptions,
    updateCommentOptions,
    deleteCommentOptions,
    getCommentsByOfferIdOptions
};