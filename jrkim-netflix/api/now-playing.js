export default async function handler(req, res) {
  const API_KEY = process.env.TMDB_API_KEY;

  if (!API_KEY) {
    return res
      .status(500)
      .json({ message: "TMDB_API_KEY 환경 변수가 설정되지 않았습니다." });
  }

  const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ message: "TMDB 요청 실패", status: response.status });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("TMDB 호출 에러:", error);
    return res.status(500).json({ message: "서버 에러" });
  }
}


