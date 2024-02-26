"use client"
import { createContext, useContext, useState } from 'react';

const IdsContext = createContext();
IdsContext.displayName = "Ids"

export default function IdProvider({ children }) {
  const [message_id, setMessage_id] = useState(0);
  const [source, setSource] = useState("");
  return (
    <IdsContext.Provider
      value={{
        message_id,
        setMessage_id,
        source,
        setSource
      }}
    >
      {children}
    </IdsContext.Provider>
  )
}

export function useIdsContext() {
  const {
    message_id,
    setMessage_id,
    source,
    setSource
  } = useContext(IdsContext);

  function changeMessageId (id) {
    setMessage_id(id)
  }

  function returnSource(source) {
    setSource(source)
  }

  return {
    changeMessageId,
    returnSource
  }
}