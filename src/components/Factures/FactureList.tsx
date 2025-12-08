/**
 * Fichier: FactureList.tsx
 * Description: Liste complete des factures avec navigation et actions
 * Auteur: Bady Pascal FOUOWA - ---PhenixMation
 * Version: 1.0.0
 * Date: 2025-12-04
 */
import { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../../contexts/LoginContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FormattedMessage, useIntl } from 'react-intl';

interface IFacture {
  _id: string;
  numeroFacture: number;
  dateFacture: string;
  statut: string;
  montantTTC: number; 
  devise: string;
}

function FactureList() {
  const [factures, setFactures] = useState<IFacture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, logout } = useContext(LoginContext);
  const navigate = useNavigate();
  const location = useLocation(); 
  const intl = useIntl();
  
  const navigationError = location.state?.error as string;

  useEffect(() => {
    if (navigationError) {
        setError(navigationError);
        navigate(location.pathname, { replace: true, state: {} }); 
    }

    const fetchFactures = async () => {
      setLoading(true);
      if (!navigationError) { 
        setError(''); 
      }

      try {
        const response = await axios.get('http://localhost:3000/api/factures', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setFactures(response.data.factures || []); 

      } catch (err: any) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
             logout(); 
             navigate('/login');
        } else {
             setError(intl.formatMessage({ 
               id: 'factureList.erreurChargement',
               defaultMessage: 'Erreur de chargement des factures.'
             }) + " " + (err.message || ''));
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (!navigationError) { 
        fetchFactures(); 
    } else {
        setLoading(false);
    }
    
  }, [token, logout, navigate, location.pathname, navigationError, intl]);

  if (loading) {
    return (
      <div className="text-center p-10 text-blue-600">
        <FormattedMessage 
          id="factureList.chargement" 
          defaultMessage="Chargement des factures..." 
        />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 shadow-xl rounded-xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        <FormattedMessage 
          id="factureList.titre" 
          defaultMessage="Liste Complète des Factures" 
        />
      </h2>

      {error && <div className="p-4 mb-4 bg-red-100 text-red-700 font-bold rounded-lg">{error}</div>}
      
      {factures.length === 0 && !error ? ( 
          <p className="text-gray-500">
            <FormattedMessage 
              id="factureList.aucuneFacture" 
              defaultMessage="Aucune facture trouvée." 
            />
          </p>
      ) : (
          <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                      <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <FormattedMessage id="facture.numeroFacture" defaultMessage="N° Facture" />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <FormattedMessage id="facture.date" defaultMessage="Date" />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <FormattedMessage id="facture.statut" defaultMessage="Statut" />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <FormattedMessage id="facture.montantTTC" defaultMessage="Montant TTC" />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <FormattedMessage id="facture.actions" defaultMessage="Actions" />
                          </th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                      {factures.map((facture) => (
                          <tr key={facture._id} className="hover:bg-blue-50 transition duration-150">
                              <td className="px-6 py-4 whitespace-nowrap font-semibold">{facture.numeroFacture}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {new Date(facture.dateFacture).toLocaleDateString(intl.locale)}
                              </td>
                              <td className={`px-6 py-4 whitespace-nowrap font-medium ${
                                facture.statut === 'Payée' ? 'text-green-600' : 
                                facture.statut === 'Paid' ? 'text-green-600' : 
                                'text-yellow-600'
                              }`}>
                                  {facture.statut}
                              </td>
                             <td className="px-6 py-4 whitespace-nowrap">
                                    {typeof facture.montantTTC === 'number' 
                                        ? `${facture.montantTTC.toFixed(2)} ${facture.devise}` 
                                        : 'N/A'}
                                </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <Link 
                                      to={`/factures/modifier/${facture.numeroFacture}`} 
                                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                                  >
                                      <FormattedMessage id="bouton.modifier" defaultMessage="Modifier" />
                                  </Link>
                                  <Link 
                                      to={`/factures/${facture.numeroFacture}`} 
                                      className="text-blue-600 hover:text-blue-900"
                                  >
                                      <FormattedMessage id="bouton.details" defaultMessage="Détails" />
                                  </Link>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      )}
    </div>
  );
}

export default FactureList;