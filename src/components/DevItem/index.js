import React from 'react';

import './styles.css';

export default function DevItem({ dev, onDelete }) {
  return (
    <li className="dev-item">
      <div className="user-block">
        <header>
          <img src={dev.avatar_url} alt={dev.name} />
          <div className="user-info">
            <strong>{dev.name}</strong>
            <span>{dev.techs.join(', ')}</span>
          </div>
        </header>
        <button onClick={() => onDelete(dev)} className="close">
          x
        </button>
      </div>
      <p>{dev.bio}</p>
      <a href={`https://github.com/${dev.github_username}`}>
        Acessar perfil no github
      </a>
    </li>
  );
}
