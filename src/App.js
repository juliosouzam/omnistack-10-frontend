import React, { useState, useEffect } from 'react';

import DevItem from './components/DevItem';
import DevForm from './components/DevForm';
import api from './services/api';

import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';

// Componente: Bloco isolado de HTML, CSS e JS, o qual não interfere no restante da aplicação.
// Propriedade: Informações que um componente PAI passa para o componente FILHO.
// Estado: Informações mantidas pelo componente. (Lembrar: Imutabilidade).

function App() {
  const [devs, setDevs] = useState([]);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [techs, setTechs] = useState('');

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/devs');

      setDevs(response.data);
    }

    loadDevs();
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;

        setLatitude(latitude);
        setLongitude(longitude);
      },
      err => {
        console.log(err);
      },
      {
        timeout: 3000,
      }
    );
  }, []);

  async function handleAddDev(data) {
    const response = await api.post('/devs', data);

    setDevs([...devs, response.data]);
  }

  async function handleDelDev({ github_username }) {
    await api.delete(`/devs/${github_username}`);

    setDevs(devs.filter(d => d.github_username !== github_username));
  }

  async function handleSyncDev(dev) {
    const response = await api.put(`/devs/${dev.github_username}`, {
      coords: { latitude, longitude },
      techs: techs || dev.techs.join(', '),
    });

    const {
      _id,
      github_username,
      name,
      bio,
      avatar_url,
      techs: newTechs,
    } = response.data;

    setDevs(
      devs.map(dev =>
        dev.github_username !== github_username
          ? dev
          : {
              _id,
              github_username,
              name,
              bio,
              avatar_url,
              techs: newTechs,
            }
      )
    );
  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>

        <DevForm
          setLongitude={setLongitude}
          setLatitude={setLatitude}
          setTechs={setTechs}
          latitude={latitude}
          longitude={longitude}
          techs={techs}
          onSubmit={handleAddDev}
        />
      </aside>
      <main>
        <ul>
          {devs.map(dev => (
            <DevItem
              onSyncDev={handleSyncDev}
              onDelete={handleDelDev}
              dev={dev}
              key={dev._id}
            />
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
