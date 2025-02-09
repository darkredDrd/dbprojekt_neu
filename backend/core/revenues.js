export function getRevenues(fastify) {
    const statement = fastify.db.prepare("SELECT * FROM Revenue");

    try {
        const revenues = statement.all();
        return revenues;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export function getRevenueById(fastify, id) {
    const statement = fastify.db.prepare("SELECT * FROM Revenue WHERE id = ?");

    try {
        const revenue = statement.get(id);
        return revenue;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export function createRevenue(fastify, revenueProps) {
    if (!revenueProps.screening_id || !revenueProps.total_revenue) {
        throw new Error('Missing required revenue properties.');
    }

    const insertStatement = fastify.db.prepare(`
        INSERT INTO Revenue (screening_id, total_revenue)
        VALUES (?, ?)
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM Revenue WHERE id = ?");

    try {
        const info = insertStatement.run(revenueProps.screening_id, revenueProps.total_revenue);

        if (!info.lastInsertRowid) {
            throw new Error('Failed to insert revenue.');
        }

        return selectStatement.get(info.lastInsertRowid);
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}

export function updateRevenue(fastify, id, revenueProps) {
    const fields = [];
    const values = [];

    if (revenueProps.screening_id) {
        fields.push("screening_id = ?");
        values.push(revenueProps.screening_id);
    }
    if (revenueProps.total_revenue) {
        fields.push("total_revenue = ?");
        values.push(revenueProps.total_revenue);
    }

    values.push(id);

    const updateStatement = fastify.db.prepare(`
        UPDATE Revenue
        SET ${fields.join(", ")}
        WHERE id = ?
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM Revenue WHERE id = ?");

    try {
        const info = updateStatement.run(...values);

        if (info.changes === 0) {
            throw new Error(`Revenue with ID ${id} not found`);
        }

        return selectStatement.get(id);
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}

export function deleteRevenue(fastify, id) {
    const deleteStatement = fastify.db.prepare("DELETE FROM Revenue WHERE id = ?");
    const selectStatement = fastify.db.prepare("SELECT * FROM Revenue WHERE id = ?");

    try {
        const revenueToDelete = selectStatement.get(id);

        const info = deleteStatement.run(id);

        if (info.changes === 0) {
            throw new Error(`Revenue with ID ${id} not found`);
        }

        return revenueToDelete;
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}