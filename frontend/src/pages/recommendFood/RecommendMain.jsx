/*global kakao*/
import React, { useEffect, useState, useRef, useCallback } from 'react';
import '../../assets/style/recommendFood/RecommendMain.css';
import '../../assets/style/allSearch/AllSearch.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';
import {
    Bookmark,
    FillBookmark,
    LocationDot,
    MainFoodBanner,
    SearchIcon,
    Trophy
} from "../../components/imgcomponents/ImgComponents";
import {FoodCategories, RecommendedCategories, TeamDinnerPick, TopSearch} from "../../components/SliderComponent";
import { fetchTopKeywords, handleKeyDown, handleSearchClick } from '../../components/Search/SearchAll';

function RecommendMain() {
    const [topKeywords, setTopKeywords] = useState([]);
    const [nearbyPub, setNearbyPub] = useState([]);
    const [allNearbyPub, setAllNearbyPub] = useState([]);
    const [page, setPage] = useState(1);
    const observer = useRef();

    useEffect(() => {
        fetchTopKeywords(setTopKeywords);
    }, []);

    const moveFoodWorldCup = () => {
        navigate('/recommend/foodWorldCup/foodWorldCup');
    }

    const categories = ['전체', '한식', '중식', '일식', '양식', '패스트푸드', '분식', '치킨', '피자', '아시아음식', '뷔페', '도시락'];
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");

    const handleGroupDinnerPickClick = (category) => {
        const searchCategory = category === '이자카야' ? '일본식주점' : category;
        setSelectedCategory(searchCategory);
    };

    // New function to load more pubs on scroll
    const loadMorePubs = useCallback(() => {
        const nextPagePubs = allNearbyPub.slice(page * 5, (page + 1) * 5);
        if (nextPagePubs.length > 0) {
            setNearbyPub(prevPubs => [...prevPubs, ...nextPagePubs]);
            setPage(prevPage => prevPage + 1);
        }
    }, [allNearbyPub, page]);

    // Infinite scroll observer
    const lastPubElementRef = useCallback(node => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                loadMorePubs();
            }
        });
        if (node) observer.current.observe(node);
    }, [loadMorePubs]);

    const filteredProducts = selectedCategory === '전체'
        ? nearbyPub
        : nearbyPub.filter(pub => pub.category_name === selectedCategory);

    const handleSearch = () => {
        const trimmedKeyword = keyword.trim();
        if (!trimmedKeyword) {
            alert('키워드를 입력해주세요!');
            return;
        }
        navigate(`/recommend/recommendFoodCategory?keyword=${trimmedKeyword}`);
    };

    useEffect(() => {
        const ps = new kakao.maps.services.Places();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    searchNearbyPub(latitude, longitude);
                },
                (err) => {
                    console.error("geolocation을 사용할 수 없어요:", err.message);
                }
            );
        } else {
            console.error("geolocation을 사용할 수 없어요.");
        }

        function searchNearbyPub(latitude, longitude) {
            const searchOptions = {
                location: new kakao.maps.LatLng(latitude, longitude),
                radius: 1000,
                size: 15, // Load more pubs initially
            };

            ps.keywordSearch('술집', (data, status) => {
                if (status === kakao.maps.services.Status.OK && data.length > 0) {
                    setAllNearbyPub(data); // Store all results
                    setNearbyPub(data.slice(0, 5)); // Load initial 5 pubs
                } else {
                    console.error("술집 검색 실패:", status);
                }
            }, searchOptions);
        }
    }, []);

    const dummyImage = "https://t1.daumcdn.net/thumb/C84x76/?fname=http://t1.daumcdn.net/cfile/2170353A51B82DE005";

    return (
        <div className={"recommend-main"}>
            <div className={"recommend-search"}>
                <h3>메뉴가 고민되시나요?</h3>
                <div className="SearchInput">
                    <input
                        className="AllSaerchBox"
                        type="text"
                        placeholder="검색 키워드를 입력해주세요"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                    />
                    <button className="AllSearchButton" onClick={handleSearch} aria-label={"검색"}>
                        <SearchIcon/>
                    </button>
                    <TopSearch/>
                </div>
            </div>

            <div className="menu-recommendation">
                <h4>이건 어떠신가요?</h4>
                <div className={"menu-recommendation-back"}></div>
                <button className="recommend-button">
                    <div className={"menu-recommendation-img"}>
                        <MainFoodBanner/>
                    </div>
                    <p className={"menu-recommendation-title"}>마라탕</p>
                </button>
            </div>

            <div className="menu-worldcup">
                <h5>메뉴 정하기 힘들 때</h5>
                <button className="worldcup" onClick={moveFoodWorldCup}>
                    <h4>음식 월드컵</h4>
                    <Trophy/>
                </button>
            </div>

            <div className="recommended-categories">
                <h5>추천 카테고리</h5>
                <RecommendedCategories/>
            </div>

            <div className={"food-categories"}>
                <h4>카테고리별 맛집 추천</h4>
                <FoodCategories/>
            </div>

            <div className="group-dinner-pick">
                <h4>회식장소 Pick</h4>
                <div className="restaurant-category-btn-container">
                    <div className="restaurant-category-buttons">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => handleGroupDinnerPickClick(category)}
                                className={selectedCategory === category ? 'active' : ''}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="restaurant-category-container">
                    {filteredProducts.length > 0 ? (
                        <ul className="restaurant-info-list">
                            {filteredProducts.map((pub, index) => (
                                <li
                                    key={pub.id}
                                    className="restaurant-info-item"
                                    ref={filteredProducts.length === index + 1 ? lastPubElementRef : null}
                                >
                                    <a className={"restaurant-image-link"} href={pub.place_url} target="_blank" rel="noreferrer">
                                        <img src={dummyImage} alt={pub.place_name} className="pub-image"/>
                                    </a>
                                    <div className="pub-info-container">
                                        <a href={pub.place_url} target="_blank" rel="noreferrer">
                                            <h6 className="pub-name">{pub.place_name}</h6>
                                        </a>
                                        <span
                                            className="pub-distance"><LocationDot/>{Math.round(pub.distance)}m</span>
                                        <button
                                            className="pub-bookmarks"><Bookmark/>북마크 {pub.bookmarks_count || 0}</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>주변 술집이 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RecommendMain;
