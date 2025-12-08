/**
 * Fichier: Login.tsx
 * Description: Page de connexion avec authentification JWT
 * Auteur: Bady Pascal Fouowa ---PhenixMation
 * Version: 1.0.0
 * Date: 2025-12-04
 */
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../contexts/LoginContext';
import { FormattedMessage, useIntl } from 'react-intl';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();
  const { login, isLoggedIn } = useContext(LoginContext);
  const intl = useIntl();

  async function performLogin() {
    setErreur('');
    const reussi = await login(email, password);
    
    if (!reussi) {
      setErreur(intl.formatMessage({
        id: 'login.erreur',
        defaultMessage: 'Login incorrect. Veuillez vérifier votre courriel et mot de passe.'
      }));
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl max-w-4xl">
        <div className="md:w-1/2 p-12 flex items-center justify-center">
          <img
            src="/PhenixMation.png"
            alt="Le chat valide ton login"
            className="max-w-xs md:max-w-sm"
          />
        </div>

        <div className="md:w-1/2 p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            <FormattedMessage 
              id="login.titre" 
              defaultMessage="Bienvenue !" 
            />
          </h2>
          
          <p className="text-gray-600 mb-8">
            <FormattedMessage 
              id="login.sousTitre" 
              defaultMessage="Connectez-vous pour continuer." 
            />
          </p>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                <FormattedMessage 
                  id="login.email" 
                  defaultMessage="Adresse e-mail" 
                />
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-300 ease-in-out"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                <FormattedMessage 
                  id="login.motDePasse" 
                  defaultMessage="Mot de passe" 
                />
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="******************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-300 ease-in-out"
              />
            </div>

            <div className="mb-6">
              <p className="block text-red-600">{erreur}</p>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button" 
                onClick={performLogin}
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                <FormattedMessage 
                  id="login.seConnecter" 
                  defaultMessage="Se connecter" 
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;