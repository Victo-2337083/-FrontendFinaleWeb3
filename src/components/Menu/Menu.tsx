/**
 * Fichier: Menu.tsx
 * Description: Menu de navigation principal avec changement de langue
 * Auteur: Bady Pascal Fouowa ---PhenixMation
 * Version: 1.0.0
 * Date: 2025-12-04
 */
import { useContext, useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom'; 
import { LoginContext } from '../../contexts/LoginContext';
import { FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';

interface MenuProps {
  intl: IntlShape;
  locale: string;
  changerLangue: (langue: string) => void;
}

function Menu({ locale, changerLangue }: MenuProps) {
  const { isLoggedIn, logout } = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      <nav className="bg-blue-800 shadow-lg p-4 sticky top-0 z-10"> 
        <div className="container mx-auto flex justify-between items-center">
          
          <Link to="/" className="text-2xl font-extrabold text-white tracking-wider">
            <FormattedMessage 
              id="app.titre" 
              defaultMessage="Gestion des comptes payables by PhenixMation" 
            />
          </Link>

          {isLoggedIn && (
            <div className="flex items-center space-x-6">
              <ul className="flex space-x-6 text-white text-sm font-medium">
                <li>
                  <Link to="/factures" className="hover:text-yellow-400 transition duration-150">
                    <FormattedMessage 
                      id="nav.listeFactures" 
                      defaultMessage="Liste des Factures" 
                    />
                  </Link>
                </li>
                <li>
                  <Link to="/factures/ajouter" className="hover:text-yellow-400 transition duration-150">
                    <FormattedMessage 
                      id="nav.ajouterFacture" 
                      defaultMessage="Ajouter une Facture" 
                    />
                  </Link>
                </li>
                <li>
                  <Link to="/factures/filtrer" className="hover:text-yellow-400 transition duration-150">
                    <FormattedMessage 
                      id="nav.filtrerFacture" 
                      defaultMessage="Filtrer par numéro de Facture" 
                    />
                  </Link>
                </li>
              </ul>

              <div className="flex space-x-2">
                <button
                  onClick={() => changerLangue('fr')}
                  className={`px-3 py-1 rounded transition ${
                    locale === 'fr' 
                      ? 'bg-yellow-400 text-blue-800 font-bold' 
                      : 'bg-blue-700 text-white hover:bg-blue-600'
                  }`}
                >
                  FR
                </button>
                <button
                  onClick={() => changerLangue('en')}
                  className={`px-3 py-1 rounded transition ${
                    locale === 'en' 
                      ? 'bg-yellow-400 text-blue-800 font-bold' 
                      : 'bg-blue-700 text-white hover:bg-blue-600'
                  }`}
                >
                  EN
                </button>
              </div>

              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-150"
                onClick={logout}
              >
                <FormattedMessage 
                  id="nav.deconnexion" 
                  defaultMessage="Déconnexion" 
                />
              </button>
            </div>
          )}
        </div>
      </nav>
      <div className="container mx-auto p-8"> 
        <Outlet />
      </div>
    </>
  );
}

export default Menu;