import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toolbar, Button } from '@mui/material';
import Home from './Home';
import Livro from './Livro';
import Autor from './Autores';
import ReactDOM from 'react-dom/client';
import './styles/style.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);


function App() {
    return (
        <Router>
                <div class="menu">
                    <Toolbar>
                        <Button color="inherit" component={Link} to="/">Home</Button>
                        <Button color="inherit" component={Link} to="/livro">Livro</Button>
                        <Button color="inherit" component={Link} to="/autor">Autor</Button>
                    </Toolbar>
                </div>
            <div style={{ marginTop: '20px' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/livro" element={<Livro />} />
                    <Route path="/autor" element={<Autor />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
