import s from './ImageGalleryItem.module.css';

import { ReactComponent as ReactSprite } from 'images/svg/sprite.svg';

function ImageGalleryItem({ image, onCardClick }) {
  const { largeImageURL, tags } = image;

  return (
    <li
      className={s.galleryCard}
      id={String(image.id)}
      onClick={() => onCardClick({ url: largeImageURL, alt: tags })}
    >
      <ReactSprite />
      <img
        className={s.galleryCard__img}
        src={image.webformatURL}
        alt={image.tags}
      />

      <div className={s.info}>
        <div className={s.info__thumb}>
          <p className={s.infoItem}>
            <span>{image.likes}</span>
            <svg className={s.icon} width="18" height="18">
              <use href="#icon-like"></use>
            </svg>
          </p>
          <p className={s.infoItem}>
            <span>{image.views}</span>
            <svg className={s.icon} width="18" height="18">
              <use href="#icon-view"></use>
            </svg>
          </p>
          <p className={s.infoItem}>
            <span>{image.comments}</span>
            <svg className={s.icon} width="18" height="18">
              <use href="#icon-comment"></use>
            </svg>
          </p>
          <p className={s.infoItem}>
            <span>{image.downloads}</span>
            <svg className={s.icon} width="18" height="18">
              <use href="#icon-download"></use>
            </svg>
          </p>
        </div>

        <div
          className={s.blur}
          style={{ backgroundImage: `url(${image.webformatURL})` }}
        ></div>
      </div>
    </li>
  );
}

export default ImageGalleryItem;
