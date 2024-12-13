import React from 'react';
import './styles/style.css';
import harryImage from './images/harry.png';
import pequenoPrincipeImage from './images/pequeno-principe.png';
import jkrowling from './images/jkrowling.png'
import antoine from './images/antoine.png'

function Home() {
    return (
        <div className="home">
            <h1>Bem-vindo à Livraria Online</h1>
            <p>Faça a sua própria coleção, cadastre seus livros e autores preferidos.</p>
            <p>Estes dois livros já temos cadastrados.</p>
            <div className="image-container">
                <img src={harryImage} alt='Harry Potter' className="book-image" />
                <img src={pequenoPrincipeImage} alt='O Pequeno Príncipe' className="book-image" />
            </div>
            <p>Estes dois Autores tambem temos cadastrados</p>
            <div class="autor-container">
                <div class="image-wrapper">
                <img src={jkrowling} alt='foto da escritora do harry potter' className="autor-image" />
                    <p class="image-description">J. K. Rowling</p>
                </div>
                <div class="image-wrapper">
                <img src={antoine} alt='foto do escritor de O Pequeno Príncipe' className="autor-image" />
                    <p class="image-description">Antoine de Saint-Exupéry</p>
                </div>
            </div>
        </div>
    );
}

export default Home;