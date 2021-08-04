import { useEffect } from 'react';
import { FormEvent, useState } from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';

import logoIMG from '../assets/images/logo.svg';

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import '../styles/room.scss'

type FirebaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string
  },
  content: string,
  isAnswered: boolean,
  isHighlighted: boolean
}>

type Question = {
  id: string,
  author: {
    name: string,
    avatar: string
  },
  content: string,
  isAnswered: boolean,
  isHighlighted: boolean
}

type RoomParams = {
  id: string;
}


export function Room() {

  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const [questionContent, setQuestionContent] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState('');

  const roomID = params.id;

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomID}`);

    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered
        }
      });

      setQuestions(parsedQuestions);
      setTitle(databaseRoom.title);

    });
  }, [roomID]);

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

  let text;

  if (questions.length === 1) {
    text = 'pergunta';
  } else {
    text = 'perguntas';
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
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} {text}</span>}

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
        {JSON.stringify(questions)}
      </main>
    </div>
  );
}