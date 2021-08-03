import { FormEvent } from 'react';

import { Link, useHistory } from 'react-router-dom';

import illustrationIMG from '../assets/images/illustration.svg';
import logoIMG from '../assets/images/logo.svg';

import '../styles/auth.scss';
import { Button } from '../components/Button';
import { useState } from 'react';
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';

export function NewRoom() {

  const { user } = useAuth();
  const history = useHistory();
  const [roomTitle, setRoomTitle] = useState('');

  async function handleCreateRoom(e: FormEvent) {
    e.preventDefault();

    if (roomTitle.trim().length === 0) {
      return;
    }

    const roomRef = database.ref('rooms');
    const firebaseRoom = await roomRef.push({
      authorID: user?.id,
      title: roomTitle
    });

    history.push(`/rooms/${firebaseRoom.key}`);

  }


  return (
    <div id="page-auth" >
      <aside>
        <img src={illustrationIMG} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoIMG} alt="Letmeask" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={(event) => { setRoomTitle(event.target.value) }}
              value={roomTitle}
            />
            <Button className="button primary" type="submit">
              Entrar na sala
            </Button>
          </form>
          <p>Quer entrar em uma sala já existente? <Link to="/">clique aqui</Link></p>
        </div>
      </main>
    </div>
  );
}