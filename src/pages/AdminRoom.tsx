import { useHistory, useParams } from 'react-router-dom';

import logoIMG from '../assets/images/logo.svg';

import deleteIMG from '../assets/images/delete.svg';
import checkIMG from '../assets/images/check.svg';
import answerIMG from '../assets/images/answer.svg';

import { Button } from '../components/Button'
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
// import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import '../styles/room.scss'
import { database } from '../services/firebase';

type RoomParams = {
  id: string;
}


export function AdminRoom() {

  // const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();

  const roomID = params.id;

  const { questions, title } = useRoom(roomID);


  let text;

  if (questions.length === 1) {
    text = 'pergunta';
  } else {
    text = 'perguntas';
  }

  async function handleCloseRoom() {
    await database.ref(`rooms/${roomID}`).update({
      closedAt: new Date(),
    })
    history.push('/');

  }

  async function handleCheckQuestionAsAnswered(questionID: string) {
    await database.ref(`rooms/${roomID}/questions/${questionID}`).update({
      isAnswered: true
    });
  }

  async function handleHighlightQuestion(questionID: string) {
    await database.ref(`rooms/${roomID}/questions/${questionID}`).update({
      isHighlighted: true
    });
  }

  async function handleDeleteQuestion(questionID: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomID}/questions/${questionID}`).remove();
    }

  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoIMG} alt="Letmeask" />
          <div>
            <RoomCode code={roomID} />
            <Button className="button outlined" onClick={handleCloseRoom} >Encerrar Sala</Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} {text}</span>}
        </div>
        <div id="questions">
          {questions.map((question) => {
            return (
              <Question
                content={question.content}
                author={question.author}
                key={question.id}
                isHighlighted={question.isHighlighted}
                isAnswered={question.isAnswered}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img src={checkIMG} alt="Marcar pergunta como respondida" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerIMG} alt="Dar destaque na pergunta sendo respondida no momento" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteIMG} alt="Remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}