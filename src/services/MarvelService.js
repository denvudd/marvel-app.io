import { useHttp } from '../hooks/http.hook'
const useMarvelService = () => {
  const {loading, request, error, clearError} = useHttp();

  const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  const _apiKey = 'apikey=0ed2899c8bfcf1af69d77c6f3fde918b';
  const _baseOffset = 210;

  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
    return res.data.results.map(_transformCharacter)
  }

  const getAllComics = async (offset = _baseOffset) => {
    const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
    return res.data.results.map(_transformComics);
  }

  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
    return _transformCharacter(res.data.results[0]);
  }

  const getComics = async (id) => {
    const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
    return _transformComics(res.data.results[0]);
  }

  const _transformComics = (comics) => {
    return {
      id: comics.id,
      title: comics.title,
      issueNumber: comics.issueNumber,
      description: comics.description,
      thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
      price: comics.prices[0].price ? '0' : 'NOT AVAILABLE',
      detail: comics.urls[0].url,
    }
  }

  const _transformCharacter = (character) => {
    return {
      id: character.id,
      name: character.name,
      description: character.description ? `${character.description.slice(0, 210)}...` : 'This is no information about this character :(',
      thumbnail: character.thumbnail.path + '.' + character.thumbnail.extension,
      homepage: character.urls[0].url,
      wiki: character.urls[1].url,
      comics: character.comics.items,
    }
  }

  return {
    loading, 
    error, 
    clearError,
    getAllCharacters, 
    getAllComics,
    getCharacter,
    getComics,
  }
}

export default useMarvelService;