import { FormEvent, useState } from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';

import logoIMG from '../assets/images/logo.svg';

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import '../styles/room.scss'

type RoomParams = {
  id: string;
}


export function Room() {

  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const [questionContent, setQuestionContent] = useState('');

  const roomID = params.id;



  async function handleNewQuestion(event: FormEvent) {

    event.preventDefault();

    if (questionContent.trim().length === 0) {
      throw new Error('You must write a question');
    }

    if (!user) {
      throw new Error('You must be logged in');
    }

    const question = {
      content: questionContent,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAnswered: false
    };

    await database.ref(`rooms/${roomID}/questions`).push(question);
    setQuestionContent('');
  }

  const formFooter = (!user ? (
    <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>

  ) : (
    <div className="user-info">
      <img src={user.avatar} alt={user.name} />
      <span>{user.name}</span>
    </div>
  ));

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoIMG} alt="Letmeask" />
          <RoomCode code={roomID} />
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala React</h1>
          <span>4 perguntas</span>
        </div>
        <form onSubmit={handleNewQuestion} >
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={event => { setQuestionContent(event.target.value) }}
            value={questionContent}
          />
          <div className="form-footer">
            {formFooter}
            <Button className="button primary" type="submit" disabled={!user} >Enviar pergunta</Button>
          </div>
        </form>
      </main>
    </div>
  );
}