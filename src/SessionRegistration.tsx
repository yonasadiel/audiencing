import React, { useState } from 'react';
import { register } from './module/api';
import { Meta } from './module/session';

type SessionRegistrationProps = {
  meta: Meta
  onRegister: (name: string) => void
}

const SessionRegistration = (props: SessionRegistrationProps) => {
  const { meta, onRegister } = props;
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const handleRegister = () => {
    setError("");
    if (name === "") {
      setError("nama tidak boleh kosong");
      return;
    }
    setLoading(true);
    register(meta.sessionName, meta.sessionToken, name).then((res) => {
      setLoading(false);
      if (!res.success) {
        setError('Failed');
        return
      }
      onRegister(name);
    });
  }
  return (
    <>
      <h2 className="main-text">Siapa namamu?</h2>
      <div className="form-block">
        <input type="text" onChange={(e) => setName(e.currentTarget.value)} />
        <small className="text-red-600">{error || ""}</small>
      </div>
      {loading 
        ? <button disabled>Submitting...</button>
        : <button onClick={handleRegister}>Masuk</button>}
    </>
  )
};

export default SessionRegistration;
