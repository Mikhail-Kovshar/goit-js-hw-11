import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ImagesApiService from './api-servise';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import LoadMoreBtn from './load-more-btn'



const refs = {
    searchForm: document.querySelector('#search-form'),
    galleryContainer: document.querySelector('.gallery'),
  };
  
  const imagesApiService = new ImagesApiService();
  const loadMoreBtn = new LoadMoreBtn();
  let markup = '';
  

  loadMoreBtn.hide();
  
  refs.searchForm.addEventListener('submit', onSearch);
  loadMoreBtn.refs.button.addEventListener('click', fetchQueryImages);
  
  let hitsLengthSum = null;
  
  function onSearch(e) {
    e.preventDefault();
     markup = '';
    imagesApiService.query = e.currentTarget.elements.searchQuery.value;
  
    if (imagesApiService.query === '') {
      return errorQuery();
    }
  
    loadMoreBtn.hide();
    imagesApiService.resetPage();
    refs.galleryContainer.innerHTML = '';
     fetchQueryImages();
  
    hitsLengthSum = 0;
  }
  
  async function fetchQueryImages() {
    const { hits, totalHits } = await imagesApiService.fetchImages();
  
    
  
    hitsLengthSum += hits.length;
    if (totalHits > 0 && imagesApiService.page === 2) {
        Notify.success(`Hooray! We found ${totalHits} images.`);
      }
  
    renderImageCard(hits);
  
    loadMoreBtn.show();
    if (hitsLengthSum === totalHits && hits.length >= 1) {
        loadMoreBtn.hide();
        return Notify.info("We're sorry, but you've reached the end of search results");
      }
    
    else if (hits.length === 0) {
        loadMoreBtn.hide();
        return errorQuery();
      }
  }
  
  function renderImageCard(images) {
    markup += images.map(({ largeImageURL, previewURL, tags, likes, views, comments, downloads }) => {
      return `
              <a href="${largeImageURL}"  onclick="event.preventDefault()" >
                <div class="photo-card">
                  <img class="photo-img" src="${previewURL}" alt="${tags}" width="300" height="200" loading="lazy" />
                  <div class="info">
                    <p class="info-item">
                    <b>Likes</b>${likes}
                    </p>
                    <p class="info-item">
                    <b>Views</b>${views}
                    </p>
                    <p class="info-item">
                    <b>Comments</b>${comments}
                    </p>
                    <p class="info-item">
                    <b>Downloads</b>${downloads}
                    </p>
                  </div>
                </div>
              </a>`;
    })
    .join('');
    refs.galleryContainer.innerHTML = markup;
    lightboxGallery.refresh();
  
    if (imagesApiService.page > 2) {
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();
  
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  }
  

  
  function errorQuery() {
    Notify.failure('Sorry, there are no images matching your search query. Please try again');
  }
  
  const lightboxOptions = {
    captions: true,
    captionDelay: 250,
    captionsData: "alt",
  };
  
  const lightboxGallery = new SimpleLightbox('.gallery a', lightboxOptions);
  

 