export function getBuildings(fastify) {
    const statement = fastify.db.prepare("SELECT * FROM Building");

    try {
        const buildings = statement.all();
        return buildings;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export function getBuildingById(fastify, id) {
    const statement = fastify.db.prepare("SELECT * FROM Building WHERE id = ?");

    try {
        const building = statement.get(id);
        return building;
    } catch (err) {
        fastify.log.error(err);
        return null;
    }
}

export function createBuilding(fastify, buildingProps) {
    if (!buildingProps.name || !buildingProps.address) {
        throw new Error('Missing required building properties.');
    }

    const insertStatement = fastify.db.prepare(`
        INSERT INTO Building (name, address)
        VALUES (?, ?)
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM Building WHERE id = ?");

    try {
        const info = insertStatement.run(buildingProps.name, buildingProps.address);

        if (!info.lastInsertRowid) {
            throw new Error('Failed to insert building.');
        }

        return selectStatement.get(info.lastInsertRowid);
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}

export function updateBuilding(fastify, id, buildingProps) {
    const fields = [];
    const values = [];

    if (buildingProps.name) {
        fields.push("name = ?");
        values.push(buildingProps.name);
    }
    if (buildingProps.address) {
        fields.push("address = ?");
        values.push(buildingProps.address);
    }

    values.push(id);

    const updateStatement = fastify.db.prepare(`
        UPDATE Building
        SET ${fields.join(", ")}
        WHERE id = ?
    `);
    const selectStatement = fastify.db.prepare("SELECT * FROM Building WHERE id = ?");

    try {
        const info = updateStatement.run(...values);

        if (info.changes === 0) {
            throw new Error(`Building with ID ${id} not found`);
        }

        return selectStatement.get(id);
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}

export function deleteBuilding(fastify, id) {
    const deleteStatement = fastify.db.prepare("DELETE FROM Building WHERE id = ?");
    const selectStatement = fastify.db.prepare("SELECT * FROM Building WHERE id = ?");

    try {
        const buildingToDelete = selectStatement.get(id);

        const info = deleteStatement.run(id);

        if (info.changes === 0) {
            throw new Error(`Building with ID ${id} not found`);
        }

        return buildingToDelete;
    } catch (err) {
        fastify.log.error(err);
        throw err;
    }
}