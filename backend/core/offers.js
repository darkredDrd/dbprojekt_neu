export function getOffers(fastify, filters = {}) {
    let query = "SELECT * FROM offers WHERE 1=1";
    const params = [];

    if (filters.title) {
        query += " AND title LIKE ?";
        params.push(`%${filters.title}%`);
    }

    if (filters.customer_id) {
        query += " AND customer_id = ?";
        params.push(filters.customer_id);
    }

    if (filters.status) {
        query += " AND status = ?";
        params.push(filters.status);
    }

    const statement = fastify.db.prepare(query);

    try {
        const offers = statement.all(...params);
        return offers;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export function getOfferById(fastify, id) {
    const statement = fastify.db.prepare("SELECT * FROM offers WHERE id = ?");

    try {
        const offer = statement.get(id);
        return offer;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export function createOffer(fastify, offerProps) {
    const now = new Date();
    const sqliteTimestamp = now.toISOString().replace('T', ' ').split('.')[0];

    const insertIntostatement = fastify.db.prepare(`
        INSERT INTO offers (customer_id, title, description, price, currency, status, created_by, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM offers WHERE id = ?");

    const offerToCreate = {
        customer_id: offerProps.customer_id,
        title: offerProps.title,
        description: offerProps.description,
        price: offerProps.price,
        currency: offerProps.currency,
        status: 'draft', // Status immer auf "draft" setzen
        created_by: offerProps.created_by,
        created_at: sqliteTimestamp,
        updated_at: sqliteTimestamp
    };

    try {
        const { customer_id, title, description, price, currency, status, created_by, created_at, updated_at } = offerToCreate;
        const info = insertIntostatement.run(customer_id, title, description, price, currency, status, created_by, created_at, updated_at);

        // Check if the insertion was successful
        if (!info.lastInsertRowid) {
            throw new Error('Failed to insert offer.');
        }

        // Retrieve the created offer by its ID
        const createdOffer = selectStatement.get(info.lastInsertRowid);
        return createdOffer;
    } catch (err) {
        // Log the error for debugging
        fastify.log.error(err);
        throw err; // Rethrow the error for the caller to handle
    }
}

export function updateOffer(fastify, offerId, offerProps) {
    const now = new Date();
    const sqliteTimestamp = now.toISOString().replace('T', ' ').split('.')[0];

    const fields = [];
    const values = [];

    if (offerProps.customer_id) {
        fields.push('customer_id = ?');
        values.push(offerProps.customer_id);
    }
    if (offerProps.title) {
        fields.push('title = ?');
        values.push(offerProps.title);
    }
    if (offerProps.description) {
        fields.push('description = ?');
        values.push(offerProps.description);
    }
    if (offerProps.price) {
        fields.push('price = ?');
        values.push(offerProps.price);
    }
    if (offerProps.currency) {
        fields.push('currency = ?');
        values.push(offerProps.currency);
    }
    if (offerProps.created_by) {
        fields.push('created_by = ?');
        values.push(offerProps.created_by);
    }

    fields.push('updated_at = ?');
    values.push(sqliteTimestamp);
    values.push(offerId);

    const updateStatement = fastify.db.prepare(`
        UPDATE offers
        SET ${fields.join(', ')}
        WHERE id = ?
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM offers WHERE id = ?");

    try {
        const info = updateStatement.run(...values);

        // Check if the update was successful
        if (info.changes === 0) {
            throw new Error('Failed to update offer or no changes made.');
        }

        return selectStatement.get(offerId);
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}

export function updateOfferStatus(fastify, offerId, newStatus) {
    const now = new Date();
    const sqliteTimestamp = now.toISOString().replace('T', ' ').split('.')[0];

    const updateStatement = fastify.db.prepare(`
        UPDATE offers
        SET status = ?, updated_at = ?
        WHERE id = ?
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM offers WHERE id = ?");

    try {
        const info = updateStatement.run(newStatus, sqliteTimestamp, offerId);

        // Check if the update was successful
        if (info.changes === 0) {
            throw new Error('Failed to update offer status or no changes made.');
        }

        return selectStatement.get(offerId);
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}

export function deleteOffer(fastify, id) {
    const deleteStatement = fastify.db.prepare("DELETE FROM offers WHERE id = ?");
    const selectStatement = fastify.db.prepare("SELECT * FROM offers WHERE id = ?");

    try {
        // Retrieve the offer before deleting it
        const offerToDelete = selectStatement.get(id);

        // Delete the offer
        const info = deleteStatement.run(id);

        if (info.changes === 0) {
            throw new Error(`Offer with ID ${id} not found`);
        }

        return offerToDelete;
    } catch (err) {
        // Log the error for debugging
        fastify.log.error(err);
        throw err; // Rethrow the error for the caller to handle
    }
}