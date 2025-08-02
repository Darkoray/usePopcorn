import { useState } from 'react';

import { Loader } from '../ui/Loader';
import { ErrorMessage } from '../ui/ErrorMessage';

import { Logo } from '../components/Logo';
import { Search } from '../components/Search';
import { NumResult } from '../components/NumResult';
import { Box } from '../components/Box';

import { Navbar } from '../layouts/Navbar';
import { Main } from '../layouts/Main';
import { MovieList } from '../layouts/MovieList/MovieList';
import { MovieDetails } from '../layouts/MovieDetails/MovieDetails';
import { WatchedSummery } from './MovieDetails/WatchedSummery';
import { WatchedMovieList } from './MovieDetails/WatchedMovieList';

import { useMovies } from '../hooks/useMovies';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error, setError } = useMovies(query);
  const [watched, setWatched] = useLocalStorageState([], 'watched');

  const handleSelectMovie = id =>
    setSelectedId(selectedId => (id === selectedId ? null : id));
  const handleCloseMovie = () => setSelectedId(null);
  const handleAddWatched = movie => setWatched(watched => [...watched, movie]);
  const handleDeleteWatched = id =>
    setWatched(watched => watched.filter(movie => movie.imdbID !== id));

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </Navbar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
              onError={setError}
            />
          ) : (
            <>
              <WatchedSummery watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
