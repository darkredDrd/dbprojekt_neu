import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ActorList from './components/Actor/ActorList';
import ActorForm from './components/Actor/ActorForm';
import ActorDetail from './components/Actor/ActorDetail';
import BuildingList from './components/Building/BuildingList';
import BuildingForm from './components/Building/BuildingForm';
import BuildingDetail from './components/Building/BuildingDetail';
import MovieList from './components/Movie/MovieList';
import MovieForm from './components/Movie/MovieForm';
import MovieDetail from './components/Movie/MovieDetail';
import ScreeningList from './components/Screening/ScreeningList';
import ScreeningForm from './components/Screening/ScreeningForm';
import ScreeningDetail from './components/Screening/ScreeningDetail';
import HallList from './components/Hall/HallList';
import HallForm from './components/Hall/HallForm';
import HallDetail from './components/Hall/HallDetail';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <a className="navbar-brand" href="/">Navbar</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" href="/">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/actors">Actors</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/buildings">Buildings</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/movies">Movies</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/screenings">Screenings</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/halls">Halls</a>
                            </li>
                        </ul>
                    </div>
                </nav>
                <Switch>
                    <Route path="/" exact component={ActorList} />
                    <Route path="/actors" exact component={ActorList} />
                    <Route path="/actors/new" component={ActorForm} />
                    <Route path="/actors/:id" component={ActorDetail} />
                    <Route path="/buildings" exact component={BuildingList} />
                    <Route path="/buildings/new" component={BuildingForm} />
                    <Route path="/buildings/:id" component={BuildingDetail} />
                    <Route path="/movies" exact component={MovieList} />
                    <Route path="/movies/new" component={MovieForm} />
                    <Route path="/movies/:id" component={MovieDetail} />
                    <Route path="/screenings" exact component={ScreeningList} />
                    <Route path="/screenings/new" component={ScreeningForm} />
                    <Route path="/screenings/:id" component={ScreeningDetail} />
                    <Route path="/halls" exact component={HallList} />
                    <Route path="/halls/new" component={HallForm} />
                    <Route path="/halls/:id" component={HallDetail} />
                </Switch>
                <footer className="bg-dark text-white text-center py-3">
                    <div className="container">
                        <p>&copy; 2023 Your Company. All rights reserved.</p>
                        <p>
                            <a href="#" className="text-white">Privacy Policy</a> | 
                            <a href="#" className="text-white">Terms of Service</a>
                        </p>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;