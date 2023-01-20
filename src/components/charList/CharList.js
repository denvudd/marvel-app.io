import { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './charList.scss';

const setContent = (process, ComponentView, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner/>;
            break;
        case 'loading':
            return newItemLoading ? <ComponentView/> : <Spinner/>;
            break;
        case 'confirmed':
            return <ComponentView/>;
            break;
        case 'error':
            return <ErrorMessage/>;
        default: 
            throw new Error('Unexpected process state');
    }
}

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [offset, setOffset] = useState(210);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [characterEnded, setCharactedEnded] = useState(false);
    const animateDuration = 400;

    const {getAllCharacters, process, setProcess} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, init) => {
        init ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset) // default parameter on load
            .then(onCharListLoaded)
            .then(() => setProcess('confirmed'));
    }

    const onCharListLoaded = async(newCharacterList) => {
        let ended = false;
        if (newCharacterList.length < 9) {
            ended = true;
        }

        setCharList([...charList, ...newCharacterList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharactedEnded(characterEnded => ended);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    const renderList = (charList) => {
        console.log('render');
        const items = charList.map((item, i) => {
            let imgStyle = {'objectFit': 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit': 'unset'};
            }

            return (
                <CSSTransition key={i} 
                               classNames="char__item"
                               timeout={animateDuration} >
                    <li 
                    className="char__item"
                    tabIndex={0}
                    ref={li => itemRefs.current[i] = li}
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
                </CSSTransition>
            )
        });

        return (
                <ul className="char__grid">
                    <TransitionGroup component={null}>
                        {items}
                    </TransitionGroup>
                </ul>
        )
    }

    const elements = useMemo(() => {
        return setContent(process, () => renderList(charList), newItemLoading);
    }, [process])


    return (
        <div className="char__list">
            {elements}
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