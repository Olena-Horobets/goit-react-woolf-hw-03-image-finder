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
    page: 1,
    isLastPage: false,
    modal: {
      isShown: false,
      imageUrl: '',
      alt: 'photo',
    },
  };

  componentDidUpdate(prevProps, prevState) {
    const { searchValue, page } = this.state;

    if (searchValue !== prevState.searchValue || page !== prevState.page) {
      if (searchValue === '') {
        this.resetSearchData();
        return;
      }

      this.setState({ status: STATUS.PENDING });
      photoFinder
        .getFetchResponse(searchValue, page)
        .then(({ hits, totalHits }) => {
          try {
            if (!hits.length) {
              this.resetSearchData();
              notify(`Sorry, we couldn't find anything for you`);
            }
            if (page === 1) {
              this.setState({ images: [...hits] });
            } else {
              this.setState(({ images }) => {
                return { images: [...images, ...hits] };
              });
            }

            this.setState({
              status: STATUS.RESOLVED,
              isLastPage: Math.ceil(totalHits / 12) === page,
            });
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
    this.resetSearchData();
    this.setState({ searchValue });
  };

  resetSearchData = () => {
    this.setState({
      searchValue: '',
      images: [],
      page: 1,
      isLastPage: false,
      status: STATUS.IDLE,
    });
  };

  // Methods for components render
  defineMainContent = () => {
    const { status } = this.state;
    if (status === STATUS.IDLE) {
      return (
        <h2 className="reqest-message">...enter what are you looking for</h2>
      );
    }

    if (status === STATUS.PENDING) {
      return <Loader></Loader>;
    }

    // if (status === STATUS.RESOLVED) {
    //   return (
    //     <>
    //       <ImageGallery images={images} onCardClick={this.onGalleryCardClick} />
    //       {!this.state.isLastPage && (
    //         <Button
    //           type="button"
    //           className="btn"
    //           text="Load more"
    //           onClick={this.onLoadMore}
    //         />
    //       )}
    //     </>
    //   );
    // }

    if (status === STATUS.REJECTED) {
      return <div className="reject-image"></div>;
    }
  };

  onLoadMore = () => {
    this.setState(({ page }) => ({ page: (page += 1) }));
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
    const { modal, images } = this.state;

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
          {images.length > 0 && (
            <>
              <ImageGallery
                images={images}
                onCardClick={this.onGalleryCardClick}
              />
              {!this.state.isLastPage && (
                <Button
                  type="button"
                  className="btn"
                  text="Load more"
                  onClick={this.onLoadMore}
                />
              )}
            </>
          )}
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
