import React, { useState } from 'react';
import { register, State, submitAnswer } from './module/api';
import { Meta } from './module/session';

type SessionAnswerProps = {
  meta: Meta
  state: State
  onSubmit: () => void
}

const SessionAnswer = (props: SessionAnswerProps) => {
  const { meta, state, onSubmit } = props;
  const [answer, setAnswer] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = (a: string) => {
    setLoading(true);
    submitAnswer(meta.sessionName, meta.sessionToken, state.code, a).then((res) => {
      setLoading(false);
      if (!res.success) {
        setError('Failed');
        return
      }
      onSubmit();
    });
  }

  let answering = <></>;

  if (state.type === 'short') {
    answering = (
      <>
        <div className="form-block">
          <input type="text" onChange={(e) => setAnswer(e.currentTarget.value)} />
          <small className="text-red-600">{error || ""}</small>
        </div>
        {loading 
          ? <button disabled>Submitting...</button>
          : <button onClick={() => handleSubmit(answer)}>Submit</button>}
      </>
    );
  } else if (state.type === 'radio') {
    answering = (
      <>
        <div className="form-block">
          {loading
            ? <p>Submitting....</p>
            : state.options.map((o) => (
              <button
                key={o}
                className="mb-2"
                disabled={loading}
                onClick={() => handleSubmit(o)}>{o}</button>
            ))
          }
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="main-text">{state.mainText}</h2>
      {answering}
    </>
  )
};

export default SessionAnswer;
