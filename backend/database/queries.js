import Database from "better-sqlite3";

const filePath = "./cinema-database.db";
const db = new Database(filePath);

// To run the queries, navigate to the database folder and run the following command:
// node queries.js

// Query 1: Get all movies with their respective actors
const moviesWithActors = db.prepare(`
    SELECT 
        Movie.title AS movie_title,
        Actor.name AS actor_name
    FROM 
        Movie
    JOIN 
        MovieActor ON Movie.id = MovieActor.movie_id
    JOIN 
        Actor ON MovieActor.actor_id = Actor.id
`).all();

// Query 2: Get total revenue for each movie
const totalRevenuePerMovie = db.prepare(`
    SELECT 
        Movie.title AS movie_title,
        SUM(Revenue.total_revenue) AS total_revenue
    FROM 
        Movie
    JOIN 
        Screening ON Movie.id = Screening.movie_id
    JOIN 
        Revenue ON Screening.id = Revenue.screening_id
    GROUP BY 
        Movie.title
`).all();

// Query 3: Get all screenings for a specific hall
const screeningsForHall = db.prepare(`
    SELECT 
        Hall.name AS hall_name,
        Screening.date_time AS screening_time,
        Movie.title AS movie_title
    FROM 
        Screening
    JOIN 
        Hall ON Screening.hall_id = Hall.id
    JOIN 
        Movie ON Screening.movie_id = Movie.id
    WHERE 
        Hall.id = ?
`).all(1); // Replace 1 with the specific hall_id

// Query 4: Get all buildings with their respective halls
const buildingsWithHalls = db.prepare(`
    SELECT 
        Building.name AS building_name,
        Hall.name AS hall_name
    FROM 
        Building
    JOIN 
        Hall ON Building.id = Hall.building_id
`).all();

// Query 5: Get the number of screenings per movie
const screeningsPerMovie = db.prepare(`
    SELECT 
        Movie.title AS movie_title,
        COUNT(Screening.id) AS screening_count
    FROM 
        Movie
    JOIN 
        Screening ON Movie.id = Screening.movie_id
    GROUP BY 
        Movie.title
`).all();

console.log("Movies with Actors:", moviesWithActors);
console.log("Total Revenue Per Movie:", totalRevenuePerMovie);
console.log("Screenings for Hall:", screeningsForHall);
console.log("Buildings with Halls:", buildingsWithHalls);
console.log("Screenings Per Movie:", screeningsPerMovie);

db.close();