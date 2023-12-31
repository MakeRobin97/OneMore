import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Swiper from '../../components/Swiper/Swiper';
import styled from 'styled-components';
import BASE_API from '../../config';

function ExerciseStart() {
  const [exerciseList, setExerciseList] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [isCustomed, setIsCustomed] = useState(0);
  const navigate = useNavigate();

  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = new URLSearchParams(location.search);
  const routineId = queryParams.get('routine-id');

  const goToComplete = () => {
    navigate(`/completed?routine-id=${routineId}&iscustomed=${isCustomed}`);
  };

  const handleComplete = id => {
    const hasId = completedIds.includes(id);

    if (hasId) {
      setCompletedIds(completedIds.filter(completedId => completedId !== id));
    } else {
      setCompletedIds(completedIds.concat(id));
    }
  };
  const token = localStorage.getItem('token');

  const updateCompletedExercise = () => {
    const completdIdSArray = localStorage.getItem('completedIds')
      ? localStorage.getItem('completedIds').split(',')
      : [];
    if (completdIdSArray.length === 0) {
      alert('완료한 운동이 없습니다');
      return;
    }
    fetch(`${BASE_API}/routines/${routineId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        authorization: token,
      },
      body: JSON.stringify({
        exerciseIds: completdIdSArray.length ? completdIdSArray : [],
      }),
      keepalive: true,
    })
      .then(response => response.json())
      .then(data => {
        window.localStorage.removeItem('completedIds');
        if (data.message === 'EXERCISE UPDATE SUCCESS') {
          goToComplete();
        }
      });
  };

  const getExerciseCardData = () => {
    // fetch('/data/gyeongjae.json', {
    fetch(`${BASE_API}/routines/${routineId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        authorization: token,
      },
    })
      .then(response => {
        return response.json();
      })
      .then(result => {
        console.log('운동시작 데이터 GET : ', result);
        const exerciseFilterList = result.data.exercises.filter(
          exercise => exercise.isCompleted === 1,
        );
        const resultIdList = exerciseFilterList.map(id => {
          return id.id;
        });

        setExerciseList(result.data.exercises);

        setCompletedIds(resultIdList);

        setIsCustomed(result.data.isCustom);

        searchParams.set('iscutomed', isCustomed);
        setSearchParams(searchParams);
      });
  };

  useEffect(() => {
    getExerciseCardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem('completedIds', completedIds);
  }, [completedIds]);

  useEffect(() => {
    window.addEventListener(
      'beforeunload',
      updateCompletedExercise,
      // eslint-disable-next-line react-hooks/exhaustive-deps
    );

    return () => {
      window.removeEventListener(
        'beforeunload',
        updateCompletedExercise,
        // eslint-disable-next-line react-hooks/exhaustive-deps
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ExerciseStartStyle>
      <PaddingContainer>
        <Container>
          <Swiper
            list={exerciseList}
            checkedList={completedIds}
            onClick={handleComplete}
            updateCompletedExercise={updateCompletedExercise}
          />
        </Container>
      </PaddingContainer>
    </ExerciseStartStyle>
  );
}
export default ExerciseStart;

const ExerciseStartStyle = styled.div``;

const PaddingContainer = styled.div`
  width: 100%;
  padding: 0 15px 0 15px;
`;

const Container = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 16px;
  margin-top: 30px;
  height: 670px;
  position: relative;
`;

//
