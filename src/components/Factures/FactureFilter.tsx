/**
 * Fichier: FactureFilter.tsx
 * Description: Composant de recherche de facture par numero avec affichage detaille
 * Auteur: Bady pascal fouowa ----PhenixMation
 * Version: 1.0.0
 * Date: 2025-12-04
 */
import { useContext, useState } from 'react';
import { LoginContext } from '../../contexts/LoginContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';

interface IFactureFiltered {
  _id: string;
  numeroFacture: number;
  dateFacture: Date; 
  dateEcheance: Date; 
  fournisseurId: string; 
  utilisateurId: string;
  montantHT: number;
  montantTVA: number;
  montantTTC: number;
  devise: string; 
  statut: string;
  modePaiement: string; 
  articles: {
    description: string;
    quantite: number;
    prixUnitaire: number;
    tauxTVA: number;
    totalLigne: number;
  }[]; 
  notes?: string; 
}

function FactureFilter() {
  const [numeroRecherche, setNumeroRecherche] = useState('');
  const [factures, setFactures] = useState<IFactureFiltered[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { token } = useContext(LoginContext);
  const intl = useIntl();

  const fetchFacturesByNumero = async () => {
    
    if (!numeroRecherche || isNaN(Number(numeroRecherche))) {
        setMessage(intl.formatMessage({
          id: 'factureFilter.numeroInvalide',
          defaultMessage: 'Veuillez entrer un numéro de facture valide.'
        }));
        setFactures([]);
        return;
    }
    
    setLoading(true);
    setMessage('');
    
    const apiURL = `https://api-web3-2ww0.onrender.com/api/factures/${numeroRecherche}`;
    
    try {
      const response = await axios.get(apiURL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      let resultats: IFactureFiltered[] = response.data.factures || response.data.facture || [];
      if (resultats && !Array.isArray(resultats)) {
          resultats = [resultats];
      }

      setFactures(resultats);

      if (resultats.length > 0) {
        setMessage(intl.formatMessage({
          id: 'factureFilter.trouvee',
          defaultMessage: 'Facture N° {numero} trouvée.'
        }, { numero: numeroRecherche }));
      } else {
        setMessage(intl.formatMessage({
          id: 'factureFilter.aucuneTrouvee',
          defaultMessage: 'Aucune facture trouvée avec le numéro: {numero}'
        }, { numero: numeroRecherche }));
      }

    } catch (err: any) {
      setFactures([]);
      if (axios.isAxiosError(err) && err.response?.status === 404) {
          setMessage(intl.formatMessage({
            id: 'factureFilter.aucuneTrouvee',
            defaultMessage: 'Aucune facture trouvée avec le numéro: {numero}'
          }, { numero: numeroRecherche }));
      } else {
          setMessage(intl.formatMessage({
            id: 'factureFilter.erreur',
            defaultMessage: 'Erreur lors de la recherche. Vérifiez le numéro et votre jeton.'
          }));
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(intl.locale);
  };

  const FactureDetailCard = (facture: IFactureFiltered) => (
    <div key={facture._id} className="p-6 border border-gray-200 rounded-lg shadow-lg bg-gray-50">
      
      <div className="flex justify-between items-start mb-4 border-b pb-2">
        <h3 className="font-extrabold text-xl text-indigo-700">
          <FormattedMessage 
            id="factureDetail.titre" 
            defaultMessage="Facture N° {numero}"
            values={{ numero: facture.numeroFacture }}
          />
        </h3>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
          facture.statut === 'Payée' || facture.statut === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {facture.statut}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <p>
          <strong><FormattedMessage id="facture.dateFacture" defaultMessage="Date de Facture" />:</strong> {formatDate(facture.dateFacture)}
        </p>
        <p>
          <strong><FormattedMessage id="facture.dateEcheance" defaultMessage="Date d'Échéance" />:</strong> {formatDate(facture.dateEcheance)}
        </p>
        <p>
          <strong><FormattedMessage id="facture.modePaiement" defaultMessage="Mode de Paiement" />:</strong> {facture.modePaiement}
        </p>
        <p>
          <strong><FormattedMessage id="facture.devise" defaultMessage="Devise" />:</strong> {facture.devise}
        </p>
      </div>

      <hr className="my-4" />

      <div className="text-right space-y-1 mb-4">
        <p className="text-gray-700">
          <FormattedMessage id="facture.montantHT" defaultMessage="Montant HT" />: 
          <span className="font-medium ml-2">{facture.montantHT.toFixed(2)} {facture.devise}</span>
        </p>
        <p className="text-gray-700">
          <FormattedMessage id="facture.montantTVA" defaultMessage="Montant TVA" />: 
          <span className="font-medium ml-2">{facture.montantTVA.toFixed(2)} {facture.devise}</span>
        </p>
        <p className="text-xl font-bold text-red-600">
          <FormattedMessage id="facture.montantTTC" defaultMessage="Montant TTC" />: {facture.montantTTC.toFixed(2)} {facture.devise}
        </p>
      </div>
      
      <h4 className="font-semibold text-md mt-6 mb-2 border-b">
        <FormattedMessage id="factureDetail.detailArticles" defaultMessage="Détail des Articles" />
      </h4>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm divide-y divide-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">
                <FormattedMessage id="article.description" defaultMessage="Description" />
              </th>
              <th className="px-4 py-2 text-center">
                <FormattedMessage id="article.quantite" defaultMessage="Qté" />
              </th>
              <th className="px-4 py-2 text-right">
                <FormattedMessage id="article.prixUnitaire" defaultMessage="Prix U. (HT)" />
              </th>
              <th className="px-4 py-2 text-right">
                <FormattedMessage id="article.tauxTVA" defaultMessage="TVA (%)" />
              </th>
              <th className="px-4 py-2 text-right">
                <FormattedMessage id="article.totalLigne" defaultMessage="Total Ligne" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {facture.articles.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{item.description}</td>
                <td className="px-4 py-2 text-center">{item.quantite}</td>
                <td className="px-4 py-2 text-right">{item.prixUnitaire.toFixed(2)}</td>
                <td className="px-4 py-2 text-right">{item.tauxTVA}%</td>
                <td className="px-4 py-2 text-right font-medium">{item.totalLigne.toFixed(2)} {facture.devise}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {facture.notes && (
        <p className="mt-4 text-sm text-gray-600">
          <strong><FormattedMessage id="facture.notes" defaultMessage="Notes (optionnel)" />:</strong> {facture.notes}
        </p>
      )}

      <div className="mt-6 text-right">
        <Link 
            to={`/factures/modifier/${facture.numeroFacture}`} 
            className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          <FormattedMessage id="factureFilter.modifierFacture" defaultMessage="Modifier la Facture" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-xl">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">
        <FormattedMessage id="factureFilter.titre" defaultMessage="🔍 Rechercher une Facture par Numéro" />
      </h2>

      <div className="flex space-x-4 mb-8">
        <input
          type="number"
          placeholder={intl.formatMessage({
            id: 'factureFilter.placeholder',
            defaultMessage: 'Entrez le numéro de facture (Ex: 100029)'
          })}
          value={numeroRecherche}
          onChange={(e) => setNumeroRecherche(e.target.value)} 
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={fetchFacturesByNumero}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50"
        >
          {loading ? (
            <FormattedMessage id="factureFilter.rechercheEnCours" defaultMessage="Recherche..." />
          ) : (
            <FormattedMessage id="factureFilter.rechercher" defaultMessage="Rechercher" />
          )}
        </button>
      </div>

      {message && <p className="mb-4 font-semibold text-gray-700">{message}</p>}

      {factures.length > 0 && (
          <div className="space-y-6">
              {factures.map((facture) => FactureDetailCard(facture))}
          </div>
      )}
    </div>
  );
}

export default FactureFilter;