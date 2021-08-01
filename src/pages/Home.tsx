import illustrationIMG from '../assets/images/illustration.svg';
import logoIMG from '../assets/images/logo.svg';
import googleIconIMG from '../assets/images/google-icon.svg';

export function Home() {
   return (
      <div>
         <aside>
            <img src={illustrationIMG} alt="Ilustração simbolizando perguntas e respostas" />
            <strong>Crie salas de Q&amp;A ao vivo</strong>
            <p>Tire as dúvidas de sua audiência em tempo real</p>
         </aside>
         <main>
            <div>
               <img src={logoIMG} alt="Letmeask" />
               <button>
                  <img src={googleIconIMG} alt="Logo do google" />
                  Crie sua sala com o google
               </button>
               <div>ou entre em uma sala</div>
               <form>
                  <input 
                  type="text" 
                  placeholder="Digite o código da sala"
                  />
                  <button type="submit">
                     Entrar na sala
                  </button>
               </form>
            </div>
         </main>
      </div>
   );
}