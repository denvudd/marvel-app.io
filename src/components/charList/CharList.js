import { Component } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

class CharList extends Component {
    state = {
        characterList: [],
        loading: true, 
        newItemLoading: false,
        error: false,
        offset: 210,
        characterEnded: false,
    }

    marvelService = new MarvelService();

    componentDidMount = () => {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset) // default parameter on load
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true,
        })
    }

    onCharListLoaded = (newCharacterList) => {
        let ended = false;
        if (newCharacterList.length < 9) {
            ended = true;
        }

        this.setState(({characterList, offset}) => ({
            characterList: [...characterList, ...newCharacterList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            characterEnded: ended,
        }))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true,
        })
    }

    updateChar = () => {
        this.marvelService
            .getAllCharacters()
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    renderList = (characterList) => {
        const items = characterList.map(item => {
            let imgStyle = {'objectFit': 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit': 'contain'};
            }

            return (
                <li 
                className="char__item"
                ref={this.setCharRef}
                key={item.id}
                onClick={() => {this.props.onCharSelected(item.id)}}>
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

    render () {
        const {characterList, loading, error, offset, newItemLoading, characterEnded} = this.state;

        const list = this.renderList(characterList);

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
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
}

export default CharList;