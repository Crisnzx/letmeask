
import { ReactNode } from 'react';
import cx from 'classnames';
import './styles.scss';

type QuestionProps = {
  content: string,
  author: {
    name: string,
    avatar: string;
  },
  isAnswered: boolean,
  isHighlighted: boolean,
  children?: ReactNode
}

export function Question({ content, author, children, isHighlighted = false, isAnswered = false }: QuestionProps) {

  let classes = '';

  if (isHighlighted && isAnswered) {
    classes = 'answered';

  } else {
    if (isAnswered) {
      classes = 'answered';
    }
    if (isHighlighted) {
      classes = 'highlighted';
    }
  }

  return (
    <div className={cx('question', {
      answered: isAnswered,
      highlighted: isHighlighted && !isAnswered
    })}>
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>
          {children}
        </div>
      </footer>
    </div>
  );
}