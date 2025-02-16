import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Segment, Header, Image, List } from 'semantic-ui-react';

function CharacterDetails() {
  const searchParams = new URLSearchParams(window.location.search);
  const characterId = searchParams.get('characterId');
  
  const [details, setDetails] = useState(null);
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    fetchSingleCharacter(characterId);
  }, [characterId]);

  const fetchSingleCharacter = async (id) => { 
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`); 
      const json = await response.json();
      setDetails(json);
      
      const episodeIds = json.episode.map(url => url.split('/').pop());
      console.log(episodeIds, 'epsids');

      const episodesResponse = await fetch(`https://rickandmortyapi.com/api/episode/${episodeIds.join(',')}`);
      const episodesJson = await episodesResponse.json();
      setEpisodes(Array.isArray(episodesJson) ? episodesJson : [episodesJson]);

      console.log(episodesJson, 'episodesJson');
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const renderDetails = (details) => {
    const excludedKeys = ['location', 'origin', 'episode', 'image'];
    return Object.entries(details)
      .filter(([key]) => !excludedKeys.includes(key))
      .map(([key, value]) => (
        <p key={key}><strong>{key}:</strong> {value.toString()}</p>
      ));
  };

  const renderLocationAndOrigin = (details) => {
    return (
      <div>
        {details?.origin && (
          <p><strong>Origin:</strong> {details?.origin.name}</p>
        )}
        {details?.location && (
          <p><strong>Location:</strong> {details?.location.name}</p>
        )}
      </div>
    );
  };

  const renderEpisodes = (episodes) => {
    if (!episodes || episodes.length === 0) {
      return <p>No episodes available.</p>;
    }

    if (!Array.isArray(episodes)) {
      return <p>{episodes.name}</p>;
    }

    return (
      <div>
        <Header as="h3">Episodes:</Header>
        <List>
          {episodes.map(episode => (
            <List.Item key={episode.id}>{episode.name}</List.Item>
          ))}
        </List>
      </div>
    );
  };

  return (
    <Container>
      <Segment>
        <Header as="h2" textAlign="center">Details of: {details?.name}</Header>
        <Image src={details?.image} alt={details?.name} size="medium" centered />
        {details ? (
          <Segment>
            {renderDetails(details)}
            {renderLocationAndOrigin(details)}
            {renderEpisodes(episodes)}
          </Segment>
        ) : (
          <p>Loading...</p>
        )}
      </Segment>
    </Container>
  );
}

export default CharacterDetails;
