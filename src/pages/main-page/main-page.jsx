import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { changeHobbie } from '../../redux/features/activeHobbie/activeHobbieSlice';
import { getAllReviews } from '../../redux/features/allReviews/allReviewsSlice';
import { changeTags } from '../../redux/features/tagsFilter/tagsFilterSlice';
import { changePaginationMain } from '../../redux/features/pagination/paginationSlice';

import Card from '../../components/card/card';
import LoadingScreen from '../loading-screen/loading-screen';
import Pagination from '../../components/pagination/pagination';
import Sort from '../../components/sort/sort';
import { getFilterTagReviews, getSortReviews, getTagsSet, scrollOnTop } from '../../utils/utils';
import { sectionHobbiesValue, AppRoute, REVIEWS_PER_PAGE, FIRST_STEP_PAGINATION, titles} from '../../const';

const MainPage = () => {
  const currentHobbie = useSelector(state => state.activeHobbie.selectedHobbie);
  const allReviews = useSelector(state => state.allReviews.allReviews);
  const isReviewsLoading = useSelector(state => state.allReviews.isLoading);
  const currentPagination = useSelector(state => state.pagination.paginationMain);
  const [pagination, setPagination] = useState(currentPagination);
  const tagsFilter = useSelector(state => state.tagsFilter.activeTags);
  const sortParameter = useSelector(state => state.sort.sortType);
  const sortOrder = useSelector(state => state.sort.sortOrder);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getAllReviews());
  }, [dispatch])

  useEffect(() => {
    document.title = `${titles[currentHobbie]}`;
  },[currentHobbie]);

  useEffect(() => {
    dispatch(changeHobbie(currentHobbie));
    dispatch(changePaginationMain(FIRST_STEP_PAGINATION));
  }, [currentHobbie, dispatch])

  useEffect(() => {
    dispatch(changePaginationMain(pagination))
  }, [dispatch, pagination])

  const handleTagClick = (nameTag) => {
    setPagination(FIRST_STEP_PAGINATION);
    dispatch(changePaginationMain(FIRST_STEP_PAGINATION));
    if (tagsFilter.includes(nameTag)) {
      const tags = tagsFilter.filter((element) => element !== nameTag);
      dispatch(changeTags(tags));
    } else {
      const tags = [...tagsFilter, nameTag];
      dispatch(changeTags(tags));
    }    
  }

  let data;
  if (currentHobbie !== sectionHobbiesValue.All) {
    data = allReviews.filter((element) => element.group === currentHobbie)
  } else {
    data = allReviews;
  }

  const allTegs = getTagsSet(data);

  const filterWithTagReviews = getFilterTagReviews(tagsFilter, data);
  const sortReviews = getSortReviews(filterWithTagReviews, sortParameter, sortOrder);
  
  const lastReviewsIndex = currentPagination * REVIEWS_PER_PAGE;
  const firstReviewIndex = lastReviewsIndex - REVIEWS_PER_PAGE;
  const currentReviews = sortReviews.slice(firstReviewIndex, lastReviewsIndex);

  const getPagination = (element) => {
    setPagination(element);
    scrollOnTop();
  }

  if (isReviewsLoading) {
    return <LoadingScreen />;
  }

  if (filterWithTagReviews.length === 0) {
    return (
    <div className='container'>
      {tagsFilter.length !== 0 &&
        <div className="container d-flex flex-row px-0 flex-wrap mt-3 justify-content-start">
          {allTegs.map((tag, index) => (
            <div 
            className="my-1 mx-2 text-start text-secondary"
              key={index}
            >
              <button
                href="#"
                className={classNames('btn', 'btn-sm', 'fst-italic', {'fw-bold': (tagsFilter.includes(tag))})} 
                value={tag}
                onClick={(event) => handleTagClick(event.target.value)}              
                >{tag}
              </button>
            </div>
          ))}
        </div>
      }
      <div className="d-flex flex-column justify-content-center">
        <h4 className="col-9 text-center text-dark mx-auto mt-5">{tagsFilter.length === 0 ? `Пока что в этом разделе нет отзывов` : `Нет отзыва с таким сочетанием тегов`}</h4>
        <Link 
        type="button" 
        className="btn btn-secondary col my-3 mx-auto text-center"
        to={AppRoute.Main}
        onClick={() => {
          dispatch(changeHobbie(sectionHobbiesValue.All));
          dispatch(changeTags([]));
        }}
        >
          {tagsFilter.length === 0 ? `На главную` : `Очистить выбор тегов`}
        </Link>
      </div>
    </div>
    )
  }

  return (
      <div className='container'>
        <div className="container d-flex flex-row px-0 flex-wrap mt-3 justify-content-start">
          {allTegs.map((tag, index) => (
            <div 
            className="my-1 mx-2 text-start text-secondary"
              key={index}
            >
              <button
              className={classNames('btn', 'btn-sm', 'fst-italic', {'fw-bold': (tagsFilter.includes(tag))})} 
              value={tag}
              onClick={(event) => handleTagClick(event.target.value)}              
              >{tag}
              </button>
            </div>
          ))}
        </div>
        <Sort/>
        <div className='row d-flex flex-wrap flex-md-column justify-content-center gap-4'>
          <div className='col'>
          {currentReviews.map((review) => (
            <Card
            key={review._id}
            review={review}
            />
          ))}
          </div>
            {sortReviews.length > REVIEWS_PER_PAGE &&
            <Pagination
            reviews={sortReviews}
            getPagination={getPagination}
            activeButton={currentPagination}
            />
          }
        </div>
      </div>
   );
}

export default MainPage;