import { useState, useEffect } from 'react';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './comicsList.scss';

const ComicsList = () => {
    const [comicsList, setComicsList] = useState([]);
    const [offset, setOffset] = useState(210);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, init) => {
        init ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics()
            .then(onComicsListLoaded);
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;

        if (newComicsList.length < 8) {
            ended = true;
        }

        setComicsList(comicsList => [...comicsList, ...newComicsList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 8);
        setComicsEnded(comicsEnded => ended);
    }

    const renderList = (comicsList) => {
        const items = comicsList.map((item, i) => {
        let imgStyle = {'objectFit': 'cover'};

        if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
            imgStyle = {'objectFit': 'unset'};
        }

            return (
                <li className="comics__item"
                    tabIndex={0}
                    key={item.id}>
                    <a href="#">
                        <img src={item.thumbnail} alt={item.title} style={imgStyle} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </a>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const list = renderList(comicsList);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {list}
            <button className="button button__main button__long">
                <div className="inner"
                     disabled={newItemLoading}
                     style={{'display': comicsEnded ? 'none' : 'block'}}
                     onClick={() => onRequest(offset)}>load more</div>
            </button>
        </div>
    )
}

export default ComicsList;