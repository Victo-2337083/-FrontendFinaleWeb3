/**
 * Fichier: UserList.tsx
 * Description: Liste des utilisateurs du systeme avec gestion des erreurs
 * Auteur: Bady Pascal Fouowa ---PhenixMation
 * Version: 1.0.0
 * Date: 2024-12-04
 */
import { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../../contexts/LoginContext';
import axios from 'axios';
import { FormattedMessage, useIntl } from 'react-intl';

interface IUser {
  name: string;
  email: string;
  password?: string; 
}

function UserList() {
  const listeVide: IUser[] = [];
  const { isLoggedIn, token, logout } = useContext(LoginContext); 
  const [userList, setUserList] = useState(listeVide);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const intl = useIntl();

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/api/utilisateurs', { 
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        
        setUserList(response.data.users);
        setError('');
      } catch (err: any) {
        console.error("Erreur lors de la récupération des utilisateurs:", err);
        
        if (axios.isAxiosError(err) && err.response?.status === 401) {
            setError(intl.formatMessage({
              id: 'userList.sessionExpiree',
              defaultMessage: 'Session expirée ou jeton invalide. Déconnexion automatique.'
            }));
            logout(); 
        } else {
            setError(intl.formatMessage({
              id: 'userList.erreur',
              defaultMessage: 'Impossible de charger la liste des utilisateurs.'
            }));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    
  }, [isLoggedIn, token, logout, intl]); 

  if (loading) {
    return (
      <div className="text-center p-8">
        <FormattedMessage 
          id="userList.chargement" 
          defaultMessage="Chargement de la liste des utilisateurs..." 
        />
      </div>
    );
  }
  
  if (error) {
    return <div className="text-center p-8 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <h3 className="md:col-span-3 text-2xl font-bold mb-4">
        <FormattedMessage 
          id="userList.titre" 
          defaultMessage="Liste des Utilisateurs" 
        />
      </h3>
      {userList.length === 0 ? (
        <p className="md:col-span-3">
          <FormattedMessage 
            id="userList.aucunUtilisateur" 
            defaultMessage="Aucun utilisateur trouvé." 
          />
        </p>
      ) : (
        userList.map((user) => (
          <div
            key={user.email}
            className="bg-white shadow-lg rounded-lg overflow-hidden p-6 hover:shadow-xl transition duration-300"
          >
            <div className="font-bold text-xl mb-2">{user.name}</div>
            <p className="text-gray-700 text-base">
              <FormattedMessage id="userList.email" defaultMessage="**Email:**" /> {user.email}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default UserList;