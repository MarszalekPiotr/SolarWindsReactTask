import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { Table, TableFooter, TableRow, TableHeaderCell, Menu, MenuItem, Icon } from "semantic-ui-react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { Dropdown } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css"; 

function App() {
  const [currentStatus, setCurrentStatus] = useState();
  const [listOfCharacters, setListOfCharacters] = useState([]);

  useEffect(() => {
    fetchCharacters(null);
    console.log(listOfCharacters);
  }, []);

  useEffect(() => {
    fetchCharacters(currentStatus);
    console.log(currentStatus);
  }, [currentStatus]);

  const [previousPage, setPreviousPage] = useState();
  const [nextPage, setNextPage] = useState();

  const fetchCharacters = async (status) => { 
    try {
      let response = null;
      if (status !== null) {
        response = await fetch(`https://rickandmortyapi.com/api/character/?status=${status}`); 
      } else {
        response = await fetch("https://rickandmortyapi.com/api/character");
      }
      const json = await response.json();
      setPreviousPage(json.info.prev);
      setNextPage(json.info.next);
      setListOfCharacters(json.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const moveToNextPage = async () => {
    try {
      const response = await fetch(nextPage);
      const json = await response.json();
      setPreviousPage(json.info.prev);
      setNextPage(json.info.next);
      setListOfCharacters(json.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const moveToPreviousPage = async () => {
    try {
      const response = await fetch(previousPage);
      const json = await response.json();
      setPreviousPage(json.info.prev);
      setNextPage(json.info.next);
      setListOfCharacters(json.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const statusOptions = [
    { key: 'Alive', value: 'Alive', text: 'Alive' },
    { key: 'Dead', value: 'Dead', text: 'Dead' },
    { key: 'unknown', value: 'unknown', text: 'unknown' },
  ];

  const navigate = useNavigate();

  const handleRowClick = (id) => {
    console.log("clicked", id);
    navigate(`/characterDetails?characterId=${id}`);
  };

  return (
    
 
      <div className="App">
        <div style={{ padding: "20px" }}>
          <h2>Character List</h2>
          <Dropdown
            placeholder="Select Status"
            fluid
            selection
            options={statusOptions}
            onChange={(e, { value }) => setCurrentStatus(value)}
          />
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Species</Table.HeaderCell>
                <Table.HeaderCell>Gender</Table.HeaderCell>
                <Table.HeaderCell>Related Image</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {listOfCharacters.map((character) => (
                <Table.Row key={character.id} onClick={() => handleRowClick(character.id)} >
                  <Table.Cell >{character.name}</Table.Cell>
                  <Table.Cell>{character.status}</Table.Cell>
                  <Table.Cell>{character.species}</Table.Cell>
                  <Table.Cell>{character.gender}</Table.Cell>
                  <Table.Cell>
                    <img src={character.image} alt={character.name} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan="3">
                <Menu floated="right" pagination>
                  <Menu.Item onClick={moveToPreviousPage} as="a" icon disabled={!previousPage}>
                    <Icon name="chevron left" />
                  </Menu.Item>

                  <Menu.Item onClick={moveToNextPage} as="a" icon disabled={!nextPage}>
                    <Icon name="chevron right" />
                  </Menu.Item>
                </Menu>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </div>
      </div>

  );
}

export default App;
