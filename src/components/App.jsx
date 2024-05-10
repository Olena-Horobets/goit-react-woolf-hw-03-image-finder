import { Component } from 'react';
import { photoFinder } from 'APIdataFetch';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './Header';
import SearchForm from './Searchbar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import Modal from './Modal';
import Loader from './Loader';

const notify = message => toast.error(message);

const STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export class App extends Component {
  state = {
    status: STATUS.IDLE,
    searchValue: '',
    images: [],
    modal: {
      isShown: false,
      imageUrl: '',
      alt: 'photo',
    },
  };

  componentDidUpdate(prevProps, prevState) {
    const prevValue = prevState.searchValue;
    const newValue = this.state.searchValue;

    if (prevValue !== newValue) {
      photoFinder.resetPage();
      if (newValue === '') {
        this.resetSearchData();
        return;
      }

      this.setState({ status: STATUS.PENDING });
      photoFinder
        .getFetchResponse(newValue)
        .then(response => {
          try {
            if (!response.length) {
              throw Error;
            }
            this.setState({ images: [...response] });
            this.setState({ status: STATUS.RESOLVED });
          } catch {
            throw Error;
          }
        })
        .catch(err => {
          notify(`Sorry, we couldn't find anything for you`);
          this.setState({ status: STATUS.REJECTED });
        });
    }
  }

  // Methods for search handling
  onSearchSubmit = searchValue => {
    this.setState({ searchValue });
  };

  resetSearchData = () => {
    this.setState({
      searchValue: '',
      images: [],
      status: STATUS.IDLE,
    });
  };

  // Methods for components render
  defineMainContent = () => {
    const { status, images } = this.state;
    if (status === STATUS.IDLE) {
      return (
        <h2 className="reqest-message">...enter what are you looking for</h2>
      );
    }

    if (status === STATUS.PENDING) {
      return <Loader></Loader>;
    }

    if (status === STATUS.RESOLVED) {
      return (
        <>
          <ImageGallery images={images} onCardClick={this.onGalleryCardClick} />
          {!photoFinder.getILastPage() && (
            <Button
              type="button"
              className="btn"
              text="Load more"
              onClick={this.onLoadMore}
            />
          )}
        </>
      );
    }

    if (status === STATUS.REJECTED) {
      return <div className="reject-image"></div>;
    }
  };

  onLoadMore = () => {
    this.setState({ status: STATUS.PENDING });
    const { searchValue } = this.state;
    photoFinder.setNextPage();
    photoFinder
      .getFetchResponse(searchValue)
      .then(response => {
        try {
          this.setState(({ images }) => {
            return { images: [...images, ...response] };
          });
          this.setState({ status: STATUS.RESOLVED });
        } catch {
          throw Error;
        }
      })
      .catch(err => {
        notify(`Sorry, we couldn't find anything for you`);
        this.setState({ status: STATUS.REJECTED });
      });
  };

  // Methods for modal window
  onGalleryCardClick = ({ url, alt }) => {
    this.toggleModal(url, alt);
  };

  toggleModal = (imageUrl = '', alt = 'photo') => {
    this.setState(({ modal }) => {
      return { modal: { isShown: !modal.isShown, imageUrl, alt } };
    });
  };

  render() {
    const { modal } = this.state;

    return (
      <div className={modal.isShown ? 'AppFixed' : 'App'} id="App">
        <ToastContainer theme="colored" icon={true} limit={1} />
        <Header />
        <div className="container">
          <SearchForm
            onSubmit={this.onSearchSubmit}
            notify={notify}
            onReset={this.resetSearchData}
          />
          {this.defineMainContent()}
        </div>
        {modal.isShown && (
          <Modal
            src={modal.imageUrl}
            alt={modal.alt}
            onModalClose={this.toggleModal}
          />
        )}
      </div>
    );
  }
}
