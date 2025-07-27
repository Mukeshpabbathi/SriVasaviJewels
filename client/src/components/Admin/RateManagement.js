import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RateManagement = () => {
  const [currentRates, setCurrentRates] = useState(null);
  const [rateHistory, setRateHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  
  // Form state for updating rates
  const [rateForm, setRateForm] = useState({
    gold: { rate24K: '' },
    silver: { rate999: '' },
    diamond: { ratePerCarat: '' },
    platinum: { rate950: '' },
    notes: ''
  });
  
  // Calculator state
  const [calculator, setCalculator] = useState({
    metal: 'Gold',
    purity: '22K',
    weight: '',
    wastage: '',
    makingCharges: '',
    result: null
  });

  useEffect(() => {
    fetchCurrentRates();
    fetchRateHistory();
  }, []);

  const fetchCurrentRates = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/rates/current');
      if (response.data.success && response.data.data) {
        setCurrentRates(response.data.data);
        setRateForm({
          gold: { rate24K: response.data.data.gold.rate24K },
          silver: { rate999: response.data.data.silver.rate999 },
          diamond: { ratePerCarat: response.data.data.diamond.ratePerCarat },
          platinum: { rate950: response.data.data.platinum.rate950 },
          notes: ''
        });
      }
    } catch (error) {
      console.error('Error fetching current rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRateHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/admin/rates/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setRateHistory(response.data.data.rates);
      }
    } catch (error) {
      console.error('Error fetching rate history:', error);
    }
  };

  const handleRateUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:4000/api/admin/rates/update', rateForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        alert('Rates updated successfully! Product prices are being updated in background.');
        fetchCurrentRates();
        fetchRateHistory();
        setRateForm(prev => ({ ...prev, notes: '' }));
      }
    } catch (error) {
      console.error('Error updating rates:', error);
      alert('Error updating rates: ' + (error.response?.data?.message || error.message));
    } finally {
      setUpdating(false);
    }
  };

  const handleCalculatePrice = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:4000/api/rates/calculate', calculator);
      if (response.data.success) {
        setCalculator(prev => ({ ...prev, result: response.data.data }));
      }
    } catch (error) {
      console.error('Error calculating price:', error);
      alert('Error calculating price: ' + (error.response?.data?.message || error.message));
    }
  };

  const updateAllProductPrices = async () => {
    if (!window.confirm('This will update prices for all products based on current rates. Continue?')) {
      return;
    }
    
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:4000/api/admin/rates/update-all-prices', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        alert(`Updated ${response.data.data.updated} products successfully!`);
      }
    } catch (error) {
      console.error('Error updating all prices:', error);
      alert('Error updating prices: ' + (error.response?.data?.message || error.message));
    } finally {
      setUpdating(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Rate Management</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {showCalculator ? 'Hide Calculator' : 'Price Calculator'}
          </button>
          <button
            onClick={updateAllProductPrices}
            disabled={updating}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {updating ? 'Updating...' : 'Update All Prices'}
          </button>
        </div>
      </div>

      {/* Current Rates Display */}
      {currentRates && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Current Rates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800">Gold Rates</h4>
              <div className="space-y-1 text-sm">
                <div>24K: {formatCurrency(currentRates.gold.rate24K)}/g</div>
                <div>22K: {formatCurrency(currentRates.gold.rate22K)}/g</div>
                <div>18K: {formatCurrency(currentRates.gold.rate18K)}/g</div>
                <div>14K: {formatCurrency(currentRates.gold.rate14K)}/g</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800">Silver Rates</h4>
              <div className="space-y-1 text-sm">
                <div>999: {formatCurrency(currentRates.silver.rate999)}/g</div>
                <div>925: {formatCurrency(currentRates.silver.rate925)}/g</div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800">Diamond Rate</h4>
              <div className="text-sm">
                {formatCurrency(currentRates.diamond.ratePerCarat)}/carat
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800">Platinum Rate</h4>
              <div className="text-sm">
                950: {formatCurrency(currentRates.platinum.rate950)}/g
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Last updated: {formatDate(currentRates.createdAt)}
          </div>
        </div>
      )}

      {/* Price Calculator */}
      {showCalculator && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Price Calculator</h3>
          <form onSubmit={handleCalculatePrice} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Metal</label>
              <select
                value={calculator.metal}
                onChange={(e) => setCalculator(prev => ({ ...prev, metal: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Platinum">Platinum</option>
                <option value="Diamond">Diamond</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purity</label>
              <select
                value={calculator.purity}
                onChange={(e) => setCalculator(prev => ({ ...prev, purity: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                {calculator.metal === 'Gold' && (
                  <>
                    <option value="24K">24K</option>
                    <option value="22K">22K</option>
                    <option value="18K">18K</option>
                    <option value="14K">14K</option>
                  </>
                )}
                {calculator.metal === 'Silver' && (
                  <>
                    <option value="999">999</option>
                    <option value="925">925</option>
                  </>
                )}
                {calculator.metal === 'Platinum' && (
                  <option value="950">950</option>
                )}
                {calculator.metal === 'Diamond' && (
                  <option value="carat">Per Carat</option>
                )}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight ({calculator.metal === 'Diamond' ? 'carats' : 'grams'})
              </label>
              <input
                type="number"
                step="0.01"
                value={calculator.weight}
                onChange={(e) => setCalculator(prev => ({ ...prev, weight: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wastage ({calculator.metal === 'Diamond' ? 'carats' : 'grams'})
              </label>
              <input
                type="number"
                step="0.01"
                value={calculator.wastage}
                onChange={(e) => setCalculator(prev => ({ ...prev, wastage: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Making Charges (₹)</label>
              <input
                type="number"
                step="0.01"
                value={calculator.makingCharges}
                onChange={(e) => setCalculator(prev => ({ ...prev, makingCharges: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Calculate Price
              </button>
            </div>
          </form>
          
          {calculator.result && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Price Calculation Result</h4>
              <div className="space-y-1 text-sm">
                <div>Metal Rate: {formatCurrency(calculator.result.metalRate)}</div>
                <div>Total Weight: {calculator.result.totalWeight} {calculator.metal === 'Diamond' ? 'carats' : 'grams'}</div>
                <div>Metal Cost: {formatCurrency(calculator.result.metalCost)}</div>
                <div>Making Charges: {formatCurrency(calculator.result.makingCharges)}</div>
                <div className="font-semibold text-lg text-green-800">
                  Total Price: {formatCurrency(calculator.result.totalPrice)}
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  Calculation: {calculator.result.calculation}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Update Rates Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Update Rates</h3>
        <form onSubmit={handleRateUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gold 24K Rate (₹/gram) *
              </label>
              <input
                type="number"
                step="0.01"
                value={rateForm.gold.rate24K}
                onChange={(e) => setRateForm(prev => ({
                  ...prev,
                  gold: { ...prev.gold, rate24K: e.target.value }
                }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Silver 999 Rate (₹/gram) *
              </label>
              <input
                type="number"
                step="0.01"
                value={rateForm.silver.rate999}
                onChange={(e) => setRateForm(prev => ({
                  ...prev,
                  silver: { ...prev.silver, rate999: e.target.value }
                }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diamond Rate (₹/carat) *
              </label>
              <input
                type="number"
                step="0.01"
                value={rateForm.diamond.ratePerCarat}
                onChange={(e) => setRateForm(prev => ({
                  ...prev,
                  diamond: { ...prev.diamond, ratePerCarat: e.target.value }
                }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platinum 950 Rate (₹/gram)
              </label>
              <input
                type="number"
                step="0.01"
                value={rateForm.platinum.rate950}
                onChange={(e) => setRateForm(prev => ({
                  ...prev,
                  platinum: { ...prev.platinum, rate950: e.target.value }
                }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={rateForm.notes}
              onChange={(e) => setRateForm(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Optional notes about this rate update..."
            />
          </div>
          
          <button
            type="submit"
            disabled={updating}
            className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white py-2 px-6 rounded-lg transition-colors"
          >
            {updating ? 'Updating Rates...' : 'Update Rates'}
          </button>
        </form>
      </div>

      {/* Rate History */}
      {rateHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Rate History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gold 24K
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Silver 999
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Diamond
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rateHistory.map((rate) => (
                  <tr key={rate._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(rate.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(rate.gold.rate24K)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(rate.silver.rate999)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(rate.diamond.ratePerCarat)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rate.updatedBy?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        rate.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rate.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RateManagement;
