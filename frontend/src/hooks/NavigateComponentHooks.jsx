import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useHeaderColorChange = (location, changeColor) => {
    useEffect(() => {
        const header = document.querySelector('.header');
        const main = document.querySelector('main');

        const changeBackgroundColor = () => {
            if (location === '/myPage/calculator' || '/recommend/foodWorldCup/foodWorldCupGame' || '/point/pointGame/MatchingGame'
        || '/point/pointGame/FoodAvoid' || '/point/pointGame/SlotGame') {
                if (header) header.style.backgroundColor = changeColor;
                if (main) main.style.backgroundColor = changeColor;
            } else {
                if (header) header.style.backgroundColor = '#fff'; // Default color
                if (main) main.style.backgroundColor = '#fff'; // Default color
            }
        };

        changeBackgroundColor(); // 초기 배경 색상을 설정

        return () => {
            if (header) header.style.backgroundColor = ''; // Reset on unmount
            if (main) main.style.backgroundColor = ''; // Reset on unmount
        };

    }, [location, changeColor]); // location.pathname을 의존성 배열에 추가
};

export const useNavigateNone = () => {
    useEffect(() => {
        const header = document.querySelector('.header');
        const main = document.querySelector('main');
        const navBar = document.querySelector('.navBar');

        const changeDisplay = () => {
            if (header) header.style.display = 'none';
            if (navBar) navBar.style.display = 'none';
            if (main) main.style.height = '100dvh';
        };

        changeDisplay(); // 초기 display 설정

        return () => {
            if (header) header.style.display = 'flex'; // 언마운트 시 초기화
            if (navBar) navBar.style.display = 'flex'; // 언마운트 시 초기화
            if (main) main.style.height = '';
        };
    }, []); // 빈 의존성 배열을 추가하여 한 번만 실행되도록 함
};


export const useOnlyHeaderColorChange = (location, changeColor) => {
    useEffect(() => {
        const header = document.querySelector('.header');

        const changeBackgroundColor = () => {
            if (location === '/myPage/calculator' || '/recommend/foodWorldCup/foodWorldCupGame' || '/point/pointGame/MatchingGame') {
                if (header) header.style.backgroundColor = changeColor;
            } else {
                if (header) header.style.backgroundColor = '#fff'; // Default color
            }
        };

        changeBackgroundColor(); // 초기 배경 색상을 설정

        return () => {
            if (header) header.style.backgroundColor = ''; // Reset on unmount
        };

    }, [location, changeColor]); // location.pathname을 의존성 배열에 추가
};