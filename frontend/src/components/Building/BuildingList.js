import React, { useEffect, useState } from 'react';
import { fetchActors } from '../../services/actorService';

function ActorList() {
    const [actors, setActors] = useState([]);

    useEffect(() => {
        async function loadActors() {
            const actors = await fetchActors();
            setActors(actors);
        }
        loadActors();
    }, []);

    return (
        <div className="container mt-5">
            <h2>Actors</h2>
            <ul className="list-group">
                {actors.map(actor => (
                    <li key={actor.id} className="list-group-item">
                        {actor.name} - {actor.birth_date}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ActorList;