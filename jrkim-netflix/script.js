// API 설정
const API_KEY = "63578d97cb4029b0ad29035c9581d29a";
const API_URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1`;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// DOM 요소
const movieContainer = document.getElementById("movieContainer");

// 영화 데이터 가져오기
async function fetchMovies() {
  try {
    movieContainer.innerHTML =
      '<div class="loading">영화 정보를 불러오는 중...</div>';

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      displayMovies(data.results);
    } else {
      movieContainer.innerHTML =
        '<div class="error">영화 정보를 찾을 수 없습니다.</div>';
    }
  } catch (error) {
    console.error("영화 데이터를 가져오는 중 오류 발생:", error);
    movieContainer.innerHTML =
      '<div class="error">영화 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.</div>';
  }
}

// 영화 카드 생성
function createMovieCard(movie) {
  const card = document.createElement("div");
  card.className = "movie-card";

  const posterPath = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  card.innerHTML = `
        <div class="movie-poster-container">
            <img 
                src="${posterPath}" 
                alt="${movie.title}" 
                class="movie-poster"
                loading="lazy"
                onerror="this.src='https://via.placeholder.com/500x750?text=No+Image'"
            >
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <div class="movie-rating">
                <span class="star">★</span>
                <span>${rating}</span>
            </div>
        </div>
    `;

  // 카드 클릭 시 상세 정보 (선택적 기능)
  card.addEventListener("click", () => {
    console.log("선택된 영화:", movie.title);
    // 여기에 모달이나 상세 페이지로 이동하는 로직을 추가할 수 있습니다
  });

  return card;
}

// 영화 목록 표시
function displayMovies(movies) {
  movieContainer.innerHTML = ""; // 로딩 메시지 제거

  movies.forEach((movie) => {
    const card = createMovieCard(movie);
    movieContainer.appendChild(card);
  });

  // 스크롤을 왼쪽으로 이동시키는 버튼 추가 (선택사항)
  addScrollButtons();
}

// 스크롤 버튼 추가 (선택사항)
function addScrollButtons() {
  // 필요하다면 좌우 스크롤 버튼을 추가할 수 있습니다
  // 현재는 마우스 드래그와 휠 스크롤로 충분합니다
}

// 페이지 로드 시 영화 데이터 가져오기
document.addEventListener("DOMContentLoaded", () => {
  fetchMovies();
});

// 스크롤 시 네비게이션 바 배경 변경
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.backgroundColor = "rgba(0,0,0,0.95)";
  } else {
    navbar.style.backgroundColor = "transparent";
  }
});
