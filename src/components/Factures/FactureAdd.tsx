/**
 * Fichier: FactureAdd.tsx
 * Description: Formulaire de creation d'une nouvelle facture avec gestion des articles
 * Auteur: Bady pascal Fouowa PhenixMation
 * Version: 1.0.0
 * Date: 2024-12-04
 */
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

interface INewFacture {
    numeroFacture: number;
    dateFacture: string;
    dateEcheance: string;
    fournisseurId: string;
    utilisateurId: string;
    montantHT: number;
    montantTVA: number;
    montantTTC: number;
    devise: string;
    statut: string;
    modePaiement: string;
    articles: IArticle[];
    notes?: string;
}

const initialFactureState: INewFacture = {
    numeroFacture: 0, 
    dateFacture: new Date().toISOString().substring(0, 10),
    dateEcheance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
    fournisseurId: '60c72b2f9f1b2e0015b6d9e0', 
    utilisateurId: '60c72b2f9f1b2e0015b6d9e1',
    montantHT: 0,
    montantTVA: 0,
    montantTTC: 0,
    devise: 'CAD',
    statut: 'En attente',
    modePaiement: 'Virement',
    articles: [{ description: 'Service de base', quantite: 1, prixUnitaire: 100.00, tauxTVA: 5.0, totalLigne: 105.00 }],
    notes: '',
};

const calculateTotals = (articles: IArticle[]) => {
    let ht = 0;
    let tva = 0;

    articles.forEach(item => {
        const totalLigneHT = item.quantite * item.prixUnitaire;
        const totalLigneTVA = totalLigneHT * (item.tauxTVA / 100);
        item.totalLigne = totalLigneHT + totalLigneTVA; 
        ht += totalLigneHT;
        tva += totalLigneTVA;
    });

    return { montantHT: ht, montantTVA: tva, montantTTC: ht + tva };
};

function FactureAdd() {
    const [formData, setFormData] = useState<INewFacture>(initialFactureState);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const { token } = useContext(LoginContext);
    const navigate = useNavigate();
    const intl = useIntl();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const parsedValue = type === 'number' ? parseFloat(value) : value;

        setFormData(prev => ({ 
            ...prev, 
            [name]: parsedValue 
        }));
    };

    const handleArticleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        const parsedValue: string | number = ['quantite', 'prixUnitaire', 'tauxTVA'].includes(name) 
                                           ? parseFloat(value) || 0 
                                           : value;

        const updatedArticles = formData.articles.map((item, i) => {
            if (i === index) {
                const updatedItem = { ...item, [name]: parsedValue };
                const totalLigneHT = updatedItem.quantite * updatedItem.prixUnitaire;
                const totalLigneTVA = totalLigneHT * (updatedItem.tauxTVA / 100);
                updatedItem.totalLigne = totalLigneHT + totalLigneTVA;
                return updatedItem;
            }
            return item;
        });

        const totals = calculateTotals(updatedArticles);
        setFormData(prev => ({ ...prev, articles: updatedArticles, ...totals }));
    };
    
    const handleAddArticle = () => {
        const newArticle: IArticle = {
            description: '',
            quantite: 1,
            prixUnitaire: 0,
            tauxTVA: 5,
            totalLigne: 0,
        };
        setFormData(prev => ({ ...prev, articles: [...prev.articles, newArticle] }));
    };
    
    const handleRemoveArticle = (index: number) => {
        const updatedArticles = formData.articles.filter((_, i) => i !== index);
        const totals = calculateTotals(updatedArticles); 
        setFormData(prev => ({ ...prev, articles: updatedArticles, ...totals }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        setLoading(true);

        try {
            const finalTotals = calculateTotals(formData.articles);
            const newFactureData = {
                facture: { ...formData, ...finalTotals }
            };
            
            const response = await axios.post('http://localhost:3000/api/factures', newFactureData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            const numeroFactureCree = response.data.facture?.numeroFacture || 'Nouvelle';

            setMessage(intl.formatMessage({
              id: 'factureAdd.succes',
              defaultMessage: 'Facture N° {numero} créée avec succès!'
            }, { numero: numeroFactureCree }));
            setIsError(false);
            setFormData(initialFactureState);
            setTimeout(() => navigate('/factures'), 2000);

        } catch (err: any) {
            setIsError(true);
            setMessage(intl.formatMessage({
              id: 'factureAdd.erreur',
              defaultMessage: 'Erreur lors de la création de la facture: {message}'
            }, { message: err.response?.data?.error || 'Erreur réseau/serveur' }));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-xl">
        <h2 className="text-3xl font-bold text-blue-800 mb-6">
          <FormattedMessage id="factureAdd.titre" defaultMessage="📄 Ajouter une Nouvelle Facture" />
        </h2>

        {message && (
          <div className={`p-4 mb-4 rounded-lg font-bold ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="border p-4 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-3 text-indigo-700">
              <FormattedMessage id="factureAdd.informationsGenerales" defaultMessage="Informations Générales" />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-medium">
                  <FormattedMessage id="factureAdd.numeroSiConnu" defaultMessage="N° Facture (si connu)" />
                </label>
                <input
                  type="number"
                  name="numeroFacture"
                  value={formData.numeroFacture}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  <FormattedMessage id="facture.dateFacture" defaultMessage="Date de Facture" />
                </label>
                <input
                  type="date"
                  name="dateFacture"
                  value={formData.dateFacture}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  <FormattedMessage id="facture.dateEcheance" defaultMessage="Date d'Échéance" />
                </label>
                <input
                  type="date"
                  name="dateEcheance"
                  value={formData.dateEcheance}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  <FormattedMessage id="facture.statut" defaultMessage="Statut" />
                </label>
                <select
                  name="statut"
                  value={formData.statut}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-2 border rounded-lg"
                >
                  <option value="En attente">
                    {intl.formatMessage({ id: 'facture.statut.enAttente', defaultMessage: 'En attente' })}
                  </option>
                  <option value="Payée">
                    {intl.formatMessage({ id: 'facture.statut.payee', defaultMessage: 'Payée' })}
                  </option>
                  <option value="Annulée">
                    {intl.formatMessage({ id: 'facture.statut.annulee', defaultMessage: 'Annulée' })}
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  <FormattedMessage id="facture.modePaiement" defaultMessage="Mode de Paiement" />
                </label>
                <select
                  name="modePaiement"
                  value={formData.modePaiement}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-2 border rounded-lg"
                >
                  <option value="Virement">
                    {intl.formatMessage({ id: 'facture.modePaiement.virement', defaultMessage: 'Virement' })}
                  </option>
                  <option value="Carte">
                    {intl.formatMessage({ id: 'facture.modePaiement.carte', defaultMessage: 'Carte' })}
                  </option>
                  <option value="Chèque">
                    {intl.formatMessage({ id: 'facture.modePaiement.cheque', defaultMessage: 'Chèque' })}
                  </option>
                  <option value="Espèces">
                    {intl.formatMessage({ id: 'facture.modePaiement.especes', defaultMessage: 'Espèces' })}
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  <FormattedMessage id="facture.devise" defaultMessage="Devise" />
                </label>
                <input
                  type="text"
                  name="devise"
                  value={formData.devise}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="border p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-indigo-700">
              <FormattedMessage id="factureAdd.detailArticles" defaultMessage="Détail des Articles" />
            </h3>
            <div className="space-y-4">
              {formData.articles.map((article, index) => (
                <div key={index} className="flex flex-wrap items-end gap-2 p-3 border border-gray-200 rounded-lg bg-white">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-gray-700 text-sm">
                      <FormattedMessage id="article.description" defaultMessage="Description" />
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={article.description}
                      onChange={(e) => handleArticleChange(index, e)}
                      required
                      className="w-full p-1 border rounded-md"
                    />
                  </div>
                  <div className="w-20">
                    <label className="block text-gray-700 text-sm">
                      <FormattedMessage id="article.quantite" defaultMessage="Qté" />
                    </label>
                    <input
                      type="number"
                      name="quantite"
                      value={article.quantite}
                      onChange={(e) => handleArticleChange(index, e)}
                      required
                      min="1"
                      className="w-full p-1 border rounded-md"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-gray-700 text-sm">
                      <FormattedMessage id="article.prixUnitaire" defaultMessage="Prix U. (HT)" />
                    </label>
                    <input
                      type="number"
                      name="prixUnitaire"
                      value={article.prixUnitaire}
                      onChange={(e) => handleArticleChange(index, e)}
                      required
                      step="0.01"
                      className="w-full p-1 border rounded-md"
                    />
                  </div>
                  <div className="w-20">
                    <label className="block text-gray-700 text-sm">
                      <FormattedMessage id="article.tauxTVA" defaultMessage="TVA (%)" />
                    </label>
                    <input
                      type="number"
                      name="tauxTVA"
                      value={article.tauxTVA}
                      onChange={(e) => handleArticleChange(index, e)}
                      required
                      step="0.01"
                      className="w-full p-1 border rounded-md"
                    />
                  </div>
                  <div className="w-24 text-right">
                    <label className="block text-gray-700 text-sm">
                      <FormattedMessage id="article.totalLigne" defaultMessage="Total Ligne" />
                    </label>
                    <p className="font-semibold">{article.totalLigne.toFixed(2)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveArticle(index)}
                    className="p-2 text-red-600 hover:text-red-800 transition"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddArticle}
              className="mt-3 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg text-sm transition"
            >
              <FormattedMessage id="factureAdd.ajouterArticle" defaultMessage="+ Ajouter un Article" />
            </button>
          </div>

          <div className="text-right p-4 border rounded-lg bg-gray-50">
            <p>
              <FormattedMessage id="facture.montantHT" defaultMessage="Montant HT" />: 
              <span className="font-bold ml-2">{formData.montantHT.toFixed(2)} {formData.devise}</span>
            </p>
            <p>
              <FormattedMessage id="facture.montantTVA" defaultMessage="Montant TVA" />: 
              <span className="font-bold ml-2">{formData.montantTVA.toFixed(2)} {formData.devise}</span>
            </p>
            <p className="text-xl font-extrabold text-red-600">
              <FormattedMessage id="facture.montantTTC" defaultMessage="Montant TTC" />: {formData.montantTTC.toFixed(2)} {formData.devise}
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              <FormattedMessage id="facture.notes" defaultMessage="Notes (optionnel)" />
            </label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              rows={3}
              maxLength={500}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? (
              <FormattedMessage id="factureAdd.creationEnCours" defaultMessage="Création en cours..." />
            ) : (
              <FormattedMessage id="factureAdd.creerFacture" defaultMessage="Créer la Facture" />
            )}
          </button>
        </form>
      </div>
    );
}

export default FactureAdd;