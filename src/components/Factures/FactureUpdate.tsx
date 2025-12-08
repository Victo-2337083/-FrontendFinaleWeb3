/**
 * Fichier: FactureUpdate.tsx
 * Description: Formulaire avance de modification de facture avec gestion complete des articles
 * Auteur: Bady pascal fouowa ----PhenixMation
 * Version: 2.0.0
 * Date: 2025-12-04
 */
import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

interface IFacture {
  _id?: string;
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

const formatToInputDate = (isoDate: string | Date): string => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  const offset = date.getTimezoneOffset() * 60000; 
  const localTime = new Date(date.getTime() - offset).toISOString().substring(0, 10);
  return localTime;
};

const calculateTotals = (articles: IArticle[]) => {
    let ht = 0;
    let tva = 0;

    const updatedArticles = articles.map(item => {
        const totalLigneHT = item.quantite * item.prixUnitaire;
        const totalLigneTVA = totalLigneHT * (item.tauxTVA / 100);
        
        const updatedItem = {
            ...item,
            totalLigne: parseFloat((totalLigneHT + totalLigneTVA).toFixed(2))
        };
        
        ht += totalLigneHT;
        tva += totalLigneTVA;
        
        return updatedItem;
    });

    return { 
        articles: updatedArticles,
        montantHT: parseFloat(ht.toFixed(2)),
        montantTVA: parseFloat(tva.toFixed(2)),
        montantTTC: parseFloat((ht + tva).toFixed(2))
    };
};

function FactureUpdate() {
  const { numeroFacture } = useParams<{ numeroFacture: string }>(); 
  const [formData, setFormData] = useState<IFacture | null>(null); 
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const { token, logout } = useContext(LoginContext);
  const navigate = useNavigate();
  const intl = useIntl();

  useEffect(() => {
    const fetchFacture = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/api/factures/${numeroFacture}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const factureData = response.data.facture;

        factureData.dateFacture = formatToInputDate(factureData.dateFacture);
        factureData.dateEcheance = formatToInputDate(factureData.dateEcheance);

        setFormData(factureData); 
        setIsError(false);

      } catch (err: any) {
        setIsError(true);
        
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404 || err.response?.status === 400) {
            const errorMessage = intl.formatMessage({
              id: 'factureUpdate.introuvable',
              defaultMessage: 'Erreur: Facture N° {numero} introuvable.'
            }, { numero: numeroFacture });
            
            navigate('/factures', { state: { error: errorMessage } });
            
          } else if (err.response?.status === 401 || err.response?.status === 403) {
             logout(); 
             navigate('/login');
          } else {
            setMessage(intl.formatMessage({
              id: 'factureUpdate.erreurChargement',
              defaultMessage: 'Erreur inconnue lors du chargement.'
            }));
          }
        } else {
          setMessage(intl.formatMessage({
            id: 'factureUpdate.erreurReseau',
            defaultMessage: 'Erreur réseau: Impossible de charger la facture.'
          }));
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (numeroFacture) {
      fetchFacture();
    }
  }, [numeroFacture, token, logout, navigate, intl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value } as IFacture);
  };
  
  const handleArticleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    const parsedValue: string | number = ['quantite', 'prixUnitaire', 'tauxTVA'].includes(name) 
                                       ? parseFloat(value) || 0
                                       : value;

    const articlesBeforeRecalc = formData!.articles.map((item, i) => {
      if (i === index) {
        return { ...item, [name]: parsedValue };
      }
      return item;
    });
    
    const updatedTotalsAndArticles = calculateTotals(articlesBeforeRecalc);

    setFormData(prev => ({ 
        ...prev!, 
        ...updatedTotalsAndArticles 
    }));
  };

  const handleAddArticle = () => {
    const newArticle: IArticle = {
      description: 'Nouvel article',
      quantite: 1,
      prixUnitaire: 0.00,
      tauxTVA: 5.0,
      totalLigne: 0.00,
    };
    
    const articlesBeforeRecalc = [...(formData?.articles || []), newArticle];
    const updatedTotalsAndArticles = calculateTotals(articlesBeforeRecalc);

    setFormData(prev => ({ 
        ...prev!, 
        ...updatedTotalsAndArticles 
    }));
  };
  
  const handleRemoveArticle = (index: number) => {
    const articlesBeforeRecalc = formData!.articles.filter((_, i) => i !== index);
    
    const updatedTotalsAndArticles = calculateTotals(articlesBeforeRecalc);

    setFormData(prev => ({ 
        ...prev!, 
        ...updatedTotalsAndArticles 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (!formData) return;

    const finalData = calculateTotals(formData.articles);

    try {
      const updateData = {
        facture: {
          ...formData,
          ...finalData, 
          numeroFacture: parseInt(numeroFacture || '0'), 
        }
      };
      
      await axios.put('http://localhost:3000/api/factures', updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setMessage(intl.formatMessage({
        id: 'factureUpdate.succes',
        defaultMessage: 'Facture N° {numero} mise à jour avec succès!'
      }, { numero: numeroFacture }));

      setTimeout(() => navigate(`/factures/${numeroFacture}`), 2000); 

    } catch (err) {
      setIsError(true);
      setMessage(intl.formatMessage({
        id: 'factureUpdate.erreur',
        defaultMessage: 'Erreur lors de la mise à jour de la facture.'
      }));
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-10 text-blue-600">
        <FormattedMessage 
          id="factureUpdate.chargement" 
          defaultMessage="Chargement de la facture..." 
        />
      </div>
    );
  }

  if (isError && !formData) {
    return (
      <div className="text-center p-10 text-red-600">{message}</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-2xl rounded-xl">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">
        <FormattedMessage 
          id="factureUpdate.titre" 
          defaultMessage="Modifier Facture N° {numero}"
          values={{ numero: numeroFacture }}
        />
      </h2>
      
      {message && (
        <div className={`p-4 mb-4 rounded-lg font-bold ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {formData && (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-lg bg-gray-50">
            <div>
              <label className="block text-gray-700 font-medium">
                <FormattedMessage id="facture.dateFacture" defaultMessage="Date de Facture" />
              </label>
              <input type="date" name="dateFacture" value={formData.dateFacture} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">
                <FormattedMessage id="facture.dateEcheance" defaultMessage="Date d'Échéance" />
              </label>
              <input type="date" name="dateEcheance" value={formData.dateEcheance} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">
                <FormattedMessage id="facture.statut" defaultMessage="Statut" />
              </label>
              <select name="statut" value={formData.statut} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-lg">
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
              <input type="text" name="modePaiement" value={formData.modePaiement} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">
                <FormattedMessage id="facture.devise" defaultMessage="Devise" />
              </label>
              <input type="text" name="devise" value={formData.devise} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-lg" />
            </div>
          </div>

          <div className="border p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-indigo-700">
              <FormattedMessage id="factureAdd.detailArticles" defaultMessage="Détail des Articles" />
            </h3>
            <div className="space-y-4">
              {formData.articles.map((article, index) => (
                <div key={index} className="flex flex-wrap items-end gap-2 p-3 border border-gray-200 rounded-lg bg-white">
                  
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-gray-700 text-sm">
                      <FormattedMessage id="article.description" defaultMessage="Description" />
                    </label>
                    <input type="text" name="description" value={article.description} onChange={(e) => handleArticleChange(index, e as React.ChangeEvent<HTMLInputElement>)} required className="w-full p-1 border rounded-md" />
                  </div>
                  
                  <div className="w-20">
                    <label className="block text-gray-700 text-sm">
                      <FormattedMessage id="article.quantite" defaultMessage="Qté" />
                    </label>
                    <input type="number" name="quantite" value={article.quantite} onChange={(e) => handleArticleChange(index, e as React.ChangeEvent<HTMLInputElement>)} required step="1" className="w-full p-1 border rounded-md" />
                  </div>
                  
                  <div className="w-24">
                    <label className="block text-gray-700 text-sm">
                      <FormattedMessage id="article.prixUnitaire" defaultMessage="Prix U. (HT)" />
                    </label>
                    <input type="number" name="prixUnitaire" value={article.prixUnitaire} onChange={(e) => handleArticleChange(index, e as React.ChangeEvent<HTMLInputElement>)} required step="0.01" className="w-full p-1 border rounded-md" />
                  </div>

                  <div className="w-20">
                    <label className="block text-gray-700 text-sm">
                      <FormattedMessage id="article.tauxTVA" defaultMessage="TVA (%)" />
                    </label>
                    <input type="number" name="tauxTVA" value={article.tauxTVA} onChange={(e) => handleArticleChange(index, e as React.ChangeEvent<HTMLInputElement>)} required step="0.01" className="w-full p-1 border rounded-md" />
                  </div>

                  <div className="w-24 text-right">
                    <label className="block text-gray-700 text-sm">
                      <FormattedMessage id="article.totalLigne" defaultMessage="Total Ligne" />
                    </label>
                    <p className="font-semibold">{article.totalLigne.toFixed(2)}</p>
                  </div>
                  
                  <button type="button" onClick={() => handleRemoveArticle(index)} className="p-2 text-red-600 hover:text-red-800 transition">
                    ❌
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={handleAddArticle} className="mt-3 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg text-sm transition">
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
            <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={3} className="w-full mt-1 p-3 border border-gray-300 rounded-lg"></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            <FormattedMessage id="factureUpdate.sauvegarder" defaultMessage="Sauvegarder et Mettre à Jour" />
          </button>
        </form>
      )}
    </div>
  );
}

export default FactureUpdate;