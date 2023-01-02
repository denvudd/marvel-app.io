import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charSearchForm.scss';

const CharSearchForm = () => {
  const [char, setChar] = useState();
  
  const {loading, error, getCharacterByName, clearError} = useMarvelService();

  const onCharLoaded = (char) => {
    setChar(char);
  }

  const updateChar = (name) => {
    clearError();

    getCharacterByName(name)
      .then(onCharLoaded);
  }

  const errorMessage = error ? <div className="char__search-critical-error"><ErrorMessage /></div> : null;
  const statusMessage = loading ? null : <div className="char__search-error">
    The character was not found. Check the name and try again</div>;
  const spinner = loading ? <div className="small-spinner"><Spinner/></div> : null;
  const result = !char ? null : char.length > 0 && !loading ? <div className="char__search-wrapper">
    <div className="char__search-success">There is! Visit {char[0].name} page?</div>
    <Link to={`/characters/${char[0].id}`} className="button button__secondary">
      <div className="inner">To page</div>
    </Link>
  </div> : statusMessage;

  return (
    <div className="char__search-form">
      <Formik
        initialValues={{
          charName: ''
        }}
        validationSchema={Yup.object({
          charName: Yup.string()
                   .required('This field is required'),
        })}
        onSubmit={ ({charName}) => {updateChar(charName)} }>
                <Form>
                    <label className="char__search-label" htmlFor="charName">Or find a character by name:</label>
                    <div className="char__search-wrapper">
                      <div>
                        <Field 
                            id="charName" 
                            name='charName' 
                            type='text' 
                            placeholder="Enter name"/>
                        <FormikErrorMessage className="char__search-error" name="charName" component="div"/>
                      </div>
                        <button 
                            type='submit' 
                            className="button button__main"
                            disabled={loading}>
                            <div className="inner">Find</div>
                        </button>
                    </div>
                </Form>
        </Formik>
        {errorMessage}
        {result}
        {spinner}
      </div>
  )
}

export default CharSearchForm;