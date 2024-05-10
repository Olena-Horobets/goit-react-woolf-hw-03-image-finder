class SearchPhotoData {
  #BASE_URL;
  #API_KEY;

  constructor({ url, key, perPage, imageType, orientation, safesearch }) {
    this.#BASE_URL = url;
    this.#API_KEY = key;

    this.page = 1;
    this.isLastPage = false;
    this.perPage = perPage;
    this.imageType = imageType;
    this.orientation = orientation;
    this.safesearch = safesearch;
  }

  setNextPage = () => {
    return (this.page += 1);
  };

  resetPage = () => {
    this.page = 1;
  };

  getBasicFetchUrl(searchValue) {
    return `${this.#BASE_URL}?key=${this.#API_KEY}&q=${searchValue}&page=${
      this.page
    }`;
  }

  getFetchUrl(searchValue = '') {
    const url = `${this.getBasicFetchUrl(searchValue)}&per_page=${
      this.perPage
    }&image_type=${this.imageType}&orientation=${this.orientation}&safesearch=${
      this.safesearch
    }`;
    return url;
  }

  getFetchResponse(query) {
    return fetch(this.getFetchUrl(query))
      .then(res => {
        if (res.status === 200) {
          return res.json();
        }
        throw Error;
      })
      .then(data => {
        if (data.hits.length < this.perPage) {
          this.isLastPage = true;
        }
        return data.hits;
      })
      .catch(error => error);
  }

  getILastPage = () => this.isLastPage;
}

const photoFinderOptions = {
  url: 'https://pixabay.com/api/',
  key: '22936688-6b3396d854cca2c3f8d0c7d41',
  perPage: 12,
  imageType: 'photo',
  orientation: 'horizontal',
  safesearch: true,
};

const photoFinder = new SearchPhotoData({ ...photoFinderOptions });
export { photoFinder };
