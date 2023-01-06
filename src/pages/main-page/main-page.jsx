import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { Link } from 'react-router-dom';

import { changeHobbie } from '../../redux/features/activeHobbie/activeHobbieSlice';
import { getAllReviews } from '../../redux/features/allReviews/allReviewsSlice';
import { changeTags } from '../../redux/features/tagsFilter/tagsFilterSlice';

import Card from '../../components/card/card';
import LoadingScreen from '../loading-screen/loading-screen';
import { sectionHobbiesValue, AppRoute} from '../../const';
import { getFilterTagReviews, getTagsSet } from '../../utils/utils';

import './main-page.scss';
import classNames from 'classnames';

const MainPage = () => {
  const currentHobbie = useSelector(state => state.activeHobbie.selectedHobbie);
  const allReviews = useSelector(state => state.allReviews.allReviews);
  const isReviewsLoading = useSelector(state => state.allReviews.isLoading);
  const tagsFilter = useSelector(state => state.tagsFilter.activeTags);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getAllReviews());
  }, [dispatch])

  useEffect(() => {
    dispatch(changeHobbie(currentHobbie));
  }, [currentHobbie, dispatch])

  const handleTagClick = (nameTag) => {
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

  data = getFilterTagReviews(tagsFilter, data);
    
  if (isReviewsLoading) {
    return <LoadingScreen />;
  }

  if (data.length === 0) {
    return (
    <div className="container mx-auto d-flex flex-column justify-content-center">
        <div className="container d-flex flex-row px-0 flex-wrap mt-3 justify-content-start">
          {allTegs.map((tag, index) => (
            <div 
            className="my-1 mx-2 text-start"
              key={index}
            >
              <button
              className={classNames('btn', 'btn-sm', {'btn-outline-secondary': (!tagsFilter.includes(tag))}, {'btn-secondary': (tagsFilter.includes(tag))})} 
              value={tag}
              onClick={(event) => handleTagClick(event.target.value)}              
              >{tag}
              </button>
            </div>
          ))}
        </div>
      <h4 className="col-9 text-center text-dark mx-auto mt-5">{tagsFilter.length === 0 ? `Пока что в этом разделе нет отзывов` : `Нет отзыва с таким сочетанием тегов`}</h4>
      <Link 
      type="button" 
      className="btn btn-secondary col mt-3 mx-auto text-center"
      to={AppRoute.Main}
      onClick={() => {
        dispatch(changeHobbie(sectionHobbiesValue.All));
        dispatch(changeTags([]));
      }}
      >
        На главную
      </Link>
    </div>
    )
  }

  return (
      <div className='container'>
        <div className="container d-flex flex-row px-0 flex-wrap mt-3 justify-content-start">
          {allTegs.map((tag, index) => (
            <div 
              className="my-1 mx-2 text-start"
              key={index}
            >
              <button
              className={classNames('btn', 'btn-sm', {'btn-outline-secondary': (!tagsFilter.includes(tag))}, {'btn-secondary': (tagsFilter.includes(tag))})} 
              value={tag}
              onClick={(event) => handleTagClick(event.target.value)}              
              >{tag}
              </button>
            </div>
          ))}
        </div>
        <div className='row d-flex flex-wrap flex-md-column justify-content-center gap-4'>
          <div className='col'>
          {data.map((review) => (
            <Card
            key={review._id}
            review={review}
            />
          ))}
          </div>
        </div>
      </div>
   );
}

export default MainPage;