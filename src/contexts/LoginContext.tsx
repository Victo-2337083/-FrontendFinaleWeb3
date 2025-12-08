/**
 * Fichier: LoginContext.tsx
 * Description: Contexte React pour la gestion de l'authentification globale
 * Auteur: Bady Pascal Fouowa ----PhenixMation
 * Version: 1.0.0
 * Date: 2025-12-04
 */
import axios from 'axios';
import { createContext, useState } from 'react';

export type LoginContextType = {
  isLoggedIn: boolean;
  token: string;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

export const LoginContext = createContext<LoginContextType>({
  isLoggedIn: false,
  token: '',
  login: () => new Promise<boolean>((resolve) => resolve(false)),
  logout: () => {},
});

export default function LoginProvider(props: any) {
  const initialToken = localStorage.getItem('authToken') || '';
  
  const [token, setToken] = useState(initialToken);
  const [isLoggedIn, setIsLoggedIn] = useState(!!initialToken); 

  async function login(email: string, password: string): Promise<boolean> {
    try {
      const response = await axios.post('http://localhost:3000/api/generatetoken', {
        userLogin: {
          email: email,
          motDePasse: password, 
        },
      });

      const { token: tokenRecu } = response.data;
      if (tokenRecu) {
        setToken(tokenRecu);
        setIsLoggedIn(true);
        localStorage.setItem('authToken', tokenRecu); 
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      logout();
      console.error("Erreur de connexion:", error);
      return false;
    }
  }

  function logout() {
    setToken('');
    setIsLoggedIn(false);
    localStorage.removeItem('authToken'); 
  }

  const values: LoginContextType = { isLoggedIn, token, login, logout };

  return (
    <LoginContext.Provider value={values}>
      {props.children}
    </LoginContext.Provider>
  );
}