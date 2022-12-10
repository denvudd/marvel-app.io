import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [offset, setOffset] = useState(210);
    const [loading, setLoading] = useState(true);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [error, setError] = useState(false);
    const [characterEnded, setCharactedEnded] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
        onRequest();
    }, [])

    const onRequest = (offset) => {
        onCharListLoading();
        marvelService.getAllCharacters(offset) // default parameter on load
            .then(onCharListLoaded)
            .catch(onError)
    }

    const onCharListLoading = () => {
        setNewItemLoading(true);
    }

    const onCharListLoaded = (newCharacterList) => {
        let ended = false;
        if (newCharacterList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharacterList]);
        setLoading(false);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharactedEnded(characterEnded => ended);
    }

    const onError = () => {
        setError(true);
        setLoading(false);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    const renderList = (characterList) => {
        const items = characterList.map((item, i) => {
            let imgStyle = {'objectFit': 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit': 'contain'};
            }

            return (
                <li 
                className="char__item"
                tabIndex={0}
                ref={li => itemRefs.current[i] = li}
                key={item.id}
                onClick={() => { 
                    props.onCharSelected(item.id); 
                    focusOnItem(i); 
                }}
                onKeyPress={(e) => {
                    if (e.key === ' ' || e.key === "Enter") {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                    }
                }}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
            </li>
            )
        })

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    const list = renderList(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? list : null;

    return (
        <div className="char__list">
            <ul className="char__grid">
                {errorMessage}
                {spinner}
                {content}
            </ul>
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': characterEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
}

export default CharList;