import { getLocalMovies } from './movieslogic';
import { Modal } from 'antd';

import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3/';

const getUrl = (endpoint) =>
  `${BASE_URL}${endpoint}?api_key=5635fd917d5aa60d99ecb1c7aaa6e603&language=it`;

const apiErrorHandler = (err) => {
  Modal.error({ content: err.status_message });
};

export const getMovieList = async (input) => {
  try {
    const res = await axios({ 
      method:"GET", 
      url: getUrl("search/movie"),
      params: {
        query: input
      }
    })
    return res.data;
  } catch (error) {
    apiErrorHandler(error.response.data);
  }
};

export const getPoster = (posterPath, width) => {
  return `https://www.themoviedb.org/t/p/w${width}/${posterPath}`;
};

export const getMovieInfo = async (movie_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(getUrl(`movie/${movie_id}`));
      resolve(res.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getGenresString = async (genres) => {
  const allGenres = await axios.get(getUrl('genre/movie/list'));
  const string = genres.map(
    (id) =>
      allGenres.data.genres[
        allGenres.data.genres.findIndex((el) => el.id === id)
      ].name,
  );
  return string.toString();
};

export const getTopFourDirAct = async (movie_id) => {
  const credits = await axios.get(getUrl(`movie/${movie_id}/credits`));
  const actors = credits.data.cast;
  const crew = credits.data.crew;
  const sortedActors = actors.sort((a, b) => {
    if (a.popularity < b.popularity) {
      return 1;
    }
    if (a.popularity > b.popularity) {
      return -1;
    }
    return 0;
  });

  const sortedDirectors = crew
    .filter((person) => person.job === 'Director')
    .sort((a, b) => {
      if (a.popularity < b.popularity) {
        return 1;
      }
      if (a.popularity > b.popularity) {
        return -1;
      }
      return 0;
    });
  return [
    sortedActors
      .map((person) => person.name)
      .slice(0, 4)
      .toString(),
    sortedDirectors
      .map((person) => person.name)
      .slice(0, 4)
      .toString(),
  ];
};

export const getMoviesByGenre = async () => {
  const movies = getLocalMovies();
  const moviesInfo = await Promise.all(
    movies.map(async (movie) => await getMovieInfo(movie.id)),
  );
  const moviesByGenre = new Array();
  return new Promise(async (resolve, reject) => {
    try {
      moviesInfo.map((movie) => {
        movie.genres.map((genre) => {
          if (moviesByGenre.findIndex((x) => x.genre === genre.name) === -1) {
            moviesByGenre.push({
              genre: genre.name,
              movies: [movie],
            });
          } else {
            moviesByGenre[
              moviesByGenre.findIndex((x) => x.genre === genre.name)
            ].movies.push(movie);
          }
        });
      });
      resolve(moviesByGenre);
    } catch (error) {
      console.log(error);
    }
  });
};