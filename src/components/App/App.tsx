/**
 * Fichier: App.tsx
 * Description: Composant racine de l'application avec gestion du routing
 * Auteur: Bady pascal Fouowa  ---PhenixMation
 * Version: 1.0.0
 * Date: 2025-12-04
 */
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import { createIntl, IntlProvider } from 'react-intl';
import Francais from '../../lang/fr.json';
import Anglais from '../../lang/en.json';
import { FormattedMessage } from 'react-intl';

import Login from '../Login/Login';
import LoginProvider from '../../contexts/LoginContext';
import Menu from '../Menu/Menu';
import FactureList from '../Factures/FactureList'; 
import FactureAdd from '../Factures/FactureAdd';
import FactureUpdate from '../Factures/FactureUpdate';
import FactureDetail from '../Factures/FactureDetail'; 
import FactureFilter from '../Factures/FactureFilter';
import UserList from '../UserList/UserList';

function App() {
  const [locale, setLocale] = useState('fr');
  const [messages, setMessages] = useState(Francais);

  const intl = createIntl({
    locale: locale,
    messages: messages,
  });

  const changerLangue = (nouvelleLangue: string) => {
    setLocale(nouvelleLangue);
    setMessages(nouvelleLangue === 'fr' ? Francais : Anglais);
  };

  return (
    <IntlProvider locale={locale} messages={messages}>
      <LoginProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Menu intl={intl} locale={locale} changerLangue={changerLangue} />}>
              <Route index element={<FactureList />} /> 
              <Route path="factures" element={<FactureList />} /> 
              <Route path="factures/ajouter" element={<FactureAdd />} />
              <Route path="factures/:numeroFacture" element={<FactureDetail />} />
              <Route path="factures/modifier/:numeroFacture" element={<FactureUpdate />} />
              <Route path="factures/filtrer" element={<FactureFilter />} />
              <Route path="utilisateurs" element={<UserList />} /> 
            </Route>

            <Route path="/login" element={<Login />} />
            
            <Route path="*" element={
              <div className="text-center p-10">
                <FormattedMessage 
                  id="error.404" 
                  defaultMessage="404 - Page non trouvée" 
                />
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </LoginProvider>
    </IntlProvider>
  );
}

export default App;