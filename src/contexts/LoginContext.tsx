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

  // Utilisation de sur render VITE_API_URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api-web3-2ww0.onrender.com/api';

  async function login(email: string, password: string): Promise<boolean> {
    try {
      const response = await axios.post(`${API_BASE_URL}/generatetoken`, {
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
