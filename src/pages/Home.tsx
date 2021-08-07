import { useHistory } from 'react-router-dom';
import { FormEvent, useState } from 'react';

import illustrationIMG from '../assets/images/illustration.svg';
import logoIMG from '../assets/images/logo.svg';
import googleIconIMG from '../assets/images/google-icon.svg';

import '../styles/auth.scss';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';



export function Home() {

  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();

  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() {

    if (!user) {
      await signInWithGoogle();
    }

    history.push('/rooms/new');

  }

  async function handleJoinRoom(e: FormEvent) {
    e.preventDefault();

    if (roomCode.trim().length === 0) {
      alert('Entrada de dados inválida!');
      setRoomCode('');
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert('Essa sala não existe!');
      setRoomCode('');
      return;
    }

    if (roomRef.val().closedAt) {
      alert('Essa sala já foi encerrada');
      return;
    }

    history.push(`/rooms/${roomCode}`);

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
          <Button onClick={handleCreateRoom} className="button secondary">
            <img src={googleIconIMG} alt="Logo do Google" />
            Crie sua sala com o Google
          </Button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom} >
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={(event) => { setRoomCode(event.target.value) }}
              value={roomCode}
            />
            <Button className="button primary" type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}