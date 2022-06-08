import React, { useEffect, useState } from 'react';
import { answer, clearMeta, getStoredMeta, Meta, registerName, startSession } from './module/session';
import SessionSelection from './SessionSelection';
import { getSession, State } from './module/api';
import SessionRegistration from './SessionRegistration';
import SessionAnswer from './SessionAnswer';

const App = () => {
  const [storedMeta, setStoredMeta] = useState<Meta | null>(getStoredMeta());
  const [title, setTitle] = useState<string>('');
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    const refreshSession = () => {
      if (!storedMeta || !storedMeta.registeredName) return;
      getSession(storedMeta.sessionName).then((sessionData) => {
        if (!sessionData) { // invalid meta, lets reset
          clearMeta();
          setStoredMeta(null);
          return;
        }
        setTitle(sessionData.meta.title);
        setState(sessionData.state);
      });
    };
    refreshSession();
    const intervalId = setInterval(refreshSession, 5 * 1000);
    return () => clearInterval(intervalId);
  }, [storedMeta]);

  if (!storedMeta) {
    const handleSessionSubmitted = (sessionName: string) => {
      const newMeta = startSession(sessionName);
      setStoredMeta(newMeta);
    };

    return (
      <AppWrapper>
        <SessionSelection onSessionSubmitted={handleSessionSubmitted} />
      </AppWrapper>
    )
  }

  if (!storedMeta.registeredName) {
    const handleRegister = (name: string) => {
      setStoredMeta(registerName(name));
    }
    return (
      <AppWrapper footer={title}>
        <SessionRegistration meta={storedMeta} onRegister={handleRegister} />
      </AppWrapper>
    )
  }

  if (!state) {
    return <AppWrapper footer={title}>Loading...</AppWrapper>
  }

  if (state.code === 'BLANK' || storedMeta.answeredCodes.findIndex((v) => v === state.code) !== -1) {
    return <AppWrapper footer={title}>Enjoy the presentation!</AppWrapper>;
  }

  const handleSubmit = () => {
    setStoredMeta(answer(state.code));
  }

  return (
    <AppWrapper footer={title}>
      <SessionAnswer meta={storedMeta} state={state} onSubmit={handleSubmit} />
    </AppWrapper>
  );
};

type AppWrapperProps = {
  footer?: string;
} & React.PropsWithChildren;

const AppWrapper = ({ children, footer }: AppWrapperProps) => (
  <div className="bg-teal-50 h-screen w-screen p-5 flex flex-col justify-center items-center">
    <div className="w-full h-full cc flex flex-col justify-center items-stretch">
      {children}
    </div>
    <small>{footer || ""}</small>
  </div>
);


export default App;
