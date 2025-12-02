// API 설정
// - 로컬( localhost )에서는 TMDB를 직접 호출합니다. (개발용, 키 노출 감수)
// - 배포 환경(Vercel 등)에서는 Serverless Function(`/api/now-playing`)을 호출합니다.
const IS_LOCALHOST =
  location.hostname === "localhost" || location.hostname === "127.0.0.1";

// 로컬 개발용 TMDB API 키 (노출되어도 괜찮다는 전제)
const LOCAL_TMDB_API_KEY = "63578d97cb4029b0ad29035c9581d29a";

const API_URL = IS_LOCALHOST
  ? `https://api.themoviedb.org/3/movie/now_playing?api_key=${LOCAL_TMDB_API_KEY}&language=ko-KR&page=1`
  : "/api/now-playing";
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
  const voteCount = movie.vote_count ? movie.vote_count.toLocaleString() : "0";
  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "날짜 정보 없음";
  const overview = movie.overview || "줄거리 정보가 없습니다.";

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
            <div class="movie-meta">
                <div class="movie-rating">
                    <span class="star">★</span>
                    <span>${rating}</span>
                    <span class="vote-count">(${voteCount})</span>
                </div>
                <div class="movie-release-date">${releaseDate}</div>
            </div>
        </div>
    `;

  // 카드 클릭 시 모달 열기
  card.addEventListener("click", () => {
    openMovieModal(movie);
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

// 모달 열기
function openMovieModal(movie) {
  const modal = document.getElementById("movieModal");
  const modalBody = document.getElementById("modalBody");

  const posterPath = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const voteCount = movie.vote_count ? movie.vote_count.toLocaleString() : "0";
  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "날짜 정보 없음";
  const overview = movie.overview || "줄거리 정보가 없습니다.";

  modalBody.innerHTML = `
    <div class="modal-poster">
      <img src="${posterPath}" alt="${movie.title}" />
    </div>
    <div class="modal-info">
      <h2 class="modal-title">${movie.title}</h2>
      <div class="modal-meta">
        <div class="modal-rating">
          <span class="star">★</span>
          <span>${rating}</span>
          <span class="vote-count">(${voteCount}명 평가)</span>
        </div>
        <div class="modal-release-date">개봉일: ${releaseDate}</div>
      </div>
      <div class="modal-overview">
        <h3>줄거리</h3>
        <p>${overview}</p>
      </div>
    </div>
  `;

  modal.classList.add("active");
  document.body.style.overflow = "hidden"; // 배경 스크롤 방지
}

// 모달 닫기
function closeMovieModal() {
  const modal = document.getElementById("movieModal");
  modal.classList.remove("active");
  document.body.style.overflow = ""; // 배경 스크롤 복원
}

// 페이지 로드 시 영화 데이터 가져오기 및 모달 이벤트 설정
document.addEventListener("DOMContentLoaded", () => {
  fetchMovies();

  // 모달 이벤트 리스너
  const modal = document.getElementById("movieModal");
  const modalClose = document.getElementById("modalClose");
  const modalOverlay = document.querySelector(".modal-overlay");

  // 닫기 버튼 클릭
  if (modalClose) {
    modalClose.addEventListener("click", closeMovieModal);
  }

  // 배경 클릭 시 닫기
  if (modalOverlay) {
    modalOverlay.addEventListener("click", closeMovieModal);
  }

  // 모달 콘텐츠 클릭 시 닫히지 않도록 이벤트 전파 방지
  const modalContent = document.querySelector(".modal-content");
  if (modalContent) {
    modalContent.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  // ESC 키로 닫기
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("active")) {
      closeMovieModal();
    }
  });
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
