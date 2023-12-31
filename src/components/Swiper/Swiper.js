import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from '../Modal/Modal';

import ExerciseCard from '../ExerciseCard/ExerciseCard';

function Swiper({ list, checkedList, onClick, updateCompletedExercise }) {
  const ref = useRef(null);
  useEffect(() => {
    window.addEventListener('message', event => {
      if (event.origin === 'http://external-domain.com') {
        const message = event.data;

        // 메시지에 따른 동작 수행
        if (message === 'StopVideo') {
          // 영상을 중지하는 코드를 실행
          const iframe = document.querySelector('iframe');
          iframe.contentWindow.postMessage(
            'stop',
            'http://external-domain.com',
          );
        }
      }
    });
  }, []);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleGoToNext = () => {
    if (!localStorage.getItem('completedIds')) {
      return alert('한 개라도 완료해주세요!');
    }

    if (currentSlide === list.length - 1) {
      handleModalOpen();
    } else {
      ref.current.next();
    }
  };

  const handleGoToPrev = () => {
    if (currentSlide > 0) {
      ref.current.prev();
    }
  };

  let checkedEx = [...list];
  let arr = [];
  for (let i = 0; i < checkedEx.length; i++) {
    if (checkedList.indexOf(checkedEx[i].id) >= 0) {
      arr.push(checkedEx[i]);
    }
  }

  return (
    <div>
      <SwiperStyle
        ref={ref}
        indicators={false}
        interval={null}
        onSelect={(index, e) => setCurrentSlide(index)}
      >
        {list.map((data, i) => (
          <Carousel.Item key={data.id}>
            <ExerciseCard
              name={data.name}
              countsPerSet={data.countsPerSet}
              setCounts={data.setCounts}
              caloriesUsed={data.caloriesUsed}
              description={data.description}
              isCompleted={checkedList.includes(data.id)}
              alt={data.name}
              src={data.videoURL}
              currentSlide={currentSlide}
              isActive={currentSlide === i}
              onClick={() => onClick(data.id)}
            />
          </Carousel.Item>
        ))}
      </SwiperStyle>
      <NextButton onClick={handleGoToNext}>
        {currentSlide === list.length - 1 ? '완료' : '다음'}
      </NextButton>
      {currentSlide === 0 ? null : (
        <BackButton onClick={handleGoToPrev}>이전</BackButton>
      )}
      {isModalOpen && (
        <ModalWrapper>
          <Modal
            textFirstLine={arr.map((text, index) => (
              <div key={index}>{text.name}</div>
            ))}
            handleLeftModalButton={handleModalOpen}
            handleRightModalButton={updateCompletedExercise}
            textSecondLine="를 완료하셨습니다"
            textThirdLine="완료하시겠습니까?"
            rightModalText="네"
            leftModalText="아니요"
            titleGap={15}
            middleGap={15}
          />
        </ModalWrapper>
      )}
    </div>
  );
}

export default Swiper;

const SwiperStyle = styled(Carousel)`
  width: 100%;

  & .carousel-control-prev-icon,
  & .carousel-control-next-icon {
    display: none;
  }
  & .carousel-control-prev,
  & .carousel-control-next {
    pointer-events: none;
    width: 0;
    height: 0;
    opacity: 0;
    visibility: hidden;
  }
`;

const ModalWrapper = styled.div`
  position: absolute;
  width: 100%;
  padding: 0 15px 0 15px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const CarouselButton = styled.button`
  position: absolute;
  width: 97px;
  height: 47px;
  border-radius: 10px;
  background-color: #8bc34a;
  opacity: 1;
  bottom: 5%;
  color: white;
`;
const NextButton = styled(CarouselButton)`
  right: 5%;
`;

const BackButton = styled(CarouselButton)`
  left: 5%;
`;
