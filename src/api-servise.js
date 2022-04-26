import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/';

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    const options = {
      params: {
        key: '27015494-b324d42506acac709c9518984',
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: this.page,
      },
    };

    const response = await axios.get('api/', options);
    const dataImages = await response.data;
    this.incrementPage();
    return dataImages;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}