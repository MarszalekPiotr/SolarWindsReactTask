// src/pages/ProfilePage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
function CharacterDetails() {
  // Access the userId parameter from the URL
  const searchParams = new URLSearchParams(window.location.search);
  let characterId;
  characterId = searchParams.get('characterId');
  
const [details, setDetails] = useState(null);
const [episodes,setEpisodes] = useState([]);

 useEffect(() => {
   fetchSingleCharacter(characterId);
 
  }, [characterId]);


  
  const fetchSingleCharacter = async (id) => { 
    try {
     
     const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`); 
   
      const json = await response.json();
       setDetails(json);
       
      const episodeIds = json.episode.map(url => url.split('/').pop());
      console.log(episodeIds,'epsids');
  
      const url = (`https://rickandmortyapi.com/api/episode/${episodeIds.join(',')}`);
      const episodesResponse = await fetch(url);
      const episodesJson = await episodesResponse.json();
      
      console.log(episodesJson,'episodesJson');
      setEpisodes(Array.isArray(episodesJson) ? episodesJson : [episodesJson]);
  
      
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
        <p><strong>Episodes:</strong></p>
        <ul>
          {episodes.map(episode => (
            <li key={episode.id}>{episode.name}</li>
          ))}
        </ul>
      </div>
    );
  };
  return (
    <div>
      <h2>Details of: {details?.name} </h2>
      <img src={details?.image} alt={details?.name} />
      {details ? (
        <div>
          {renderDetails(details)}
        </div>
      ) : (
        <p>Loading...</p>
      )}
        <div>
          {renderLocationAndOrigin(details)}
        </div>      
        <div>
          
          {renderEpisodes(episodes)}
        </div>      


    </div>
  );
}

export default CharacterDetails;
