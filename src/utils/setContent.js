import ErrorMessage from '../components/errorMessage/ErrorMessage';
import Skeleton from '../components/skeleton/Skeleton';
import Spinner from '../components/spinner/Spinner';

const setContent = (process, ComponentView, loadingType, data) => {
  switch (process) {
      case 'waiting':
          return <p className="char__select">Please select a character to see information</p>
      case 'loading':
          return (loadingType === 'skeleton') ? <Skeleton/> : <Spinner/>;
      case 'confirmed':
          return <ComponentView data={data}/>;
      case 'error':
          return <ErrorMessage/>;
      default: 
          throw new Error('Unexpected process state');
  }
}

export default setContent;