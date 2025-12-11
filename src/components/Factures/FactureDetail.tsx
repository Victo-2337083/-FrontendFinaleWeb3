/**
 * Fichier: FactureDetail.tsx
 * Description: Affichage detaille d'une facture specifique
 * Auteur: Bady pascal fouowa PhenixMation
 * Version: 1.0.0
 * Date: 2024-12-04
 */

import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LoginContext } from '../../contexts/LoginContext';
import { FormattedMessage, useIntl } from 'react-intl';

interface IArticle {
  description: string;
  quantite: number;
  prixUnitaire: number;
  tauxTVA: number;
  totalLigne: number;
}

interface IFactureForm {
  numeroFacture: number;
  dateFacture: string;
  dateEcheance: string;
  statut: string;
  modePaiement: string;
  devise: string;
  fournisseurId: any;
  utilisateurId: any;
  montantHT: number;
  montantTVA: number;
  montantTTC: number;
  articles: IArticle[];
  notes?: string;
}

function FactureDetail() {
  const { numeroFacture } = useParams<{ numeroFacture: string }>();
  const [facture, setFacture] = useState<IFactureForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, logout } = useContext(LoginContext);
  const navigate = useNavigate();
  const intl = useIntl();

  useEffect(() => {
    const fetchFacture = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://api-web3-2ww0.onrender.com/api/factures/${numeroFacture}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setFacture(response.data.facture);
      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          logout();
          navigate('/login');
        } else {
          setError(intl.formatMessage({ 
            id: 'factureDetail.introuvable',
            defaultMessage: 'Facture N° {numero} introuvable.'
          }, { numero: numeroFacture }));
        }
      } finally {
        setLoading(false);
      }
    };

    if (numeroFacture) {
      fetchFacture();
    }
  }, [numeroFacture, token, logout, navigate, intl]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(intl.locale);
  };

  if (loading) {
    return (
      <div className="text-center p-10 text-blue-600">
        <FormattedMessage 
          id="factureDetail.chargement" 
          defaultMessage="Chargement de la facture..." 
        />
      </div>
    );
  }

  if (error || !facture) {
    return (
      <div className="text-center p-10 text-red-600">
        {error || <FormattedMessage id="factureDetail.introuvable" defaultMessage="Facture introuvable." />}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-xl">
      <div className="flex justify-between items-start mb-6 border-b pb-4">
        <h2 className="text-3xl font-bold text-blue-800">
          <FormattedMessage 
            id="factureDetail.titre" 
            defaultMessage="Facture N° {numero}"
            values={{ numero: facture.numeroFacture }}
          />
        </h2>
        <span className={`px-4 py-2 text-sm font-semibold rounded-full ${
          facture.statut === 'Payée' || facture.statut === 'Paid' ? 'bg-green-100 text-green-800' : 
          facture.statut === 'En attente' || facture.statut === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-red-100 text-red-800'
        }`}>
          {facture.statut}
        </span>
      </div>

      {/* Informations générales */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-gray-600 font-medium">
            <FormattedMessage id="facture.dateFacture" defaultMessage="Date de Facture" />
          </p>
          <p className="text-lg font-semibold">{formatDate(facture.dateFacture)}</p>
        </div>
        <div>
          <p className="text-gray-600 font-medium">
            <FormattedMessage id="facture.dateEcheance" defaultMessage="Date d'Échéance" />
          </p>
          <p className="text-lg font-semibold">{formatDate(facture.dateEcheance)}</p>
        </div>
        <div>
          <p className="text-gray-600 font-medium">
            <FormattedMessage id="facture.modePaiement" defaultMessage="Mode de Paiement" />
          </p>
          <p className="text-lg font-semibold">{facture.modePaiement}</p>
        </div>
        <div>
          <p className="text-gray-600 font-medium">
            <FormattedMessage id="facture.devise" defaultMessage="Devise" />
          </p>
          <p className="text-lg font-semibold">{facture.devise}</p>
        </div>
      </div>

      {/* Articles */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">
          <FormattedMessage id="factureDetail.detailArticles" defaultMessage="Détail des Articles" />
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <FormattedMessage id="article.description" defaultMessage="Description" />
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  <FormattedMessage id="article.quantite" defaultMessage="Qté" />
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  <FormattedMessage id="article.prixUnitaire" defaultMessage="Prix U. (HT)" />
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  <FormattedMessage id="article.tauxTVA" defaultMessage="TVA (%)" />
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  <FormattedMessage id="article.totalLigne" defaultMessage="Total Ligne" />
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {facture.articles.map((article, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{article.description}</td>
                  <td className="px-6 py-4 text-center">{article.quantite}</td>
                  <td className="px-6 py-4 text-right">{article.prixUnitaire.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">{article.tauxTVA}%</td>
                  <td className="px-6 py-4 text-right font-semibold">
                    {article.totalLigne.toFixed(2)} {facture.devise}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totaux */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="flex justify-between mb-2">
          <span className="font-medium">
            <FormattedMessage id="facture.montantHT" defaultMessage="Montant HT" />
          </span>
          <span className="font-bold">{facture.montantHT.toFixed(2)} {facture.devise}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-medium">
            <FormattedMessage id="facture.montantTVA" defaultMessage="Montant TVA" />
          </span>
          <span className="font-bold">{facture.montantTVA.toFixed(2)} {facture.devise}</span>
        </div>
        <div className="flex justify-between text-xl font-bold border-t pt-2 mt-2 text-red-600">
          <span>
            <FormattedMessage id="facture.montantTTC" defaultMessage="Montant TTC" />
          </span>
          <span>{facture.montantTTC.toFixed(2)} {facture.devise}</span>
        </div>
      </div>

      {/* Notes */}
      {facture.notes && (
        <div className="mb-6">
          <p className="text-gray-600 font-medium mb-2">
            <FormattedMessage id="facture.notes" defaultMessage="Notes (optionnel)" />
          </p>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{facture.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Link 
          to={`/factures/modifier/${facture.numeroFacture}`}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg text-center transition duration-200"
        >
          <FormattedMessage id="bouton.modifier" defaultMessage="Modifier" />
        </Link>
        <Link 
          to="/factures"
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg text-center transition duration-200"
        >
          <FormattedMessage id="bouton.retourListe" defaultMessage="Retour à la liste" />
        </Link>
      </div>
    </div>
  );
}

export default FactureDetail;