import React, { useState } from 'react';
import { getSession } from './module/api';

type SessionSelectionProps = {
  onSessionSubmitted: (session: string) => void
}

const SessionSelection = (props: SessionSelectionProps) => {
  const { onSessionSubmitted } = props;
  const [session, setSession] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const handleSessionSubmitted = () => {
    setLoading(true);
    getSession(session).then((sessionData) => {
      setLoading(false);
      if (!sessionData) {
        setError('Invalid code');
        return
      }
      onSessionSubmitted(session);
    });
  }
  return (
    <>
      <h1 className="mb-6 font-bold text-3xl">Selamat Datang!</h1>
      <div className="form-block">
        <input
          type="text"
          name="session"
          className="mb-1"
          placeholder="Session Code..."
          onChange={(e) => setSession(e.currentTarget.value)} />
        <small className="text-red-600">{error || ""}</small>
      </div>
      {loading 
        ? <button disabled>Submitting...</button>
        : <button onClick={handleSessionSubmitted}>Masuk</button>}
      
    </>
  )
};

export default SessionSelection;
