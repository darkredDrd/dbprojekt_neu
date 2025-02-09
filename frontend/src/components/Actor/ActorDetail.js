import React, { useEffect, useState } from 'react';
import { fetchActorById } from '../../services/actorService';

function ActorDetail({ match }) {
    const [actor, setActor] = useState(null);
    const { id } = match.params;

    useEffect(() => {
        async function loadActor() {
            const actor = await fetchActorById(id);
            setActor(actor);
        }
        loadActor();
    }, [id]);

    if (!actor) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h2>Actor Detail</h2>
            <p>Name: {actor.name}</p>
            <p>Birth Date: {actor.birth_date}</p>
        </div>
    );
}

export default ActorDetail;