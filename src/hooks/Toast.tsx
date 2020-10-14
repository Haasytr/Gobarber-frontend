import React, { createContext, useContext, useCallback, useState } from 'react';
import {uuid} from 'uuidv4'

import ToastContainer from '../components/ToastContainer';
interface ToastContextData {
  addToast(message: Omit<ToastMessage, 'id'>): void;
  removeToast(id: string): void
}
export interface ToastMessage {
  id: string,
  type?: "success" | "error" | "info",
  title: string,
  description?: string,
}

const toastContext = createContext<ToastContextData>({} as ToastContextData)

export const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([])

  const addToast = useCallback(({type,title,description}: Omit<ToastMessage, 'id'>) => {
    const id = uuid()

    const toast = {
      id,
      type,
      title,
      description,
    };

    setMessages(oldMessages => [...oldMessages, toast])

  }, [])
  const removeToast = useCallback((id: string) => {
    setMessages(state =>  state.filter(message => message.id !== id))
  }, [])

  return (
    <toastContext.Provider value={{addToast, removeToast}}>
      {children}
      <ToastContainer messages={messages} />
    </toastContext.Provider>
  );
}

export function useToast(): ToastContextData {
  const context = useContext(toastContext)

  if(!context){
    throw new Error('useToast must be used within a toast provider')
  }

  return context
}

export default ToastProvider;
