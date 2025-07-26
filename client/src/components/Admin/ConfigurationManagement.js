import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ConfigurationManagement = ({ user }) => {
  const [configurations, setConfigurations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingConfig, setEditingConfig] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Fetch all configurations
  const fetchConfigurations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/admin/config', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setConfigurations(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching configurations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigurations();
  }, []);

  // Handle edit configuration
  const handleEdit = (config) => {
    setEditingConfig(config);
    setEditValue(Array.isArray(config.value) ? config.value.join(', ') : JSON.stringify(config.value, null, 2));
  };

  // Handle save configuration
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      let parsedValue;
      
      // Try to parse as JSON first, then as comma-separated array
      try {
        parsedValue = JSON.parse(editValue);
      } catch {
        // If JSON parse fails, treat as comma-separated string for arrays
        if (Array.isArray(editingConfig.value)) {
          parsedValue = editValue.split(',').map(item => item.trim()).filter(item => item);
        } else {
          parsedValue = editValue;
        }
      }
      
      const response = await axios.put(
        `http://localhost:4000/api/admin/config/${editingConfig.key}`,
        {
          value: parsedValue,
          description: editingConfig.description
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        fetchConfigurations();
        setEditingConfig(null);
        setEditValue('');
        alert('Configuration updated successfully!');
      }
    } catch (error) {
      console.error('Error updating configuration:', error);
      alert(error.response?.data?.message || 'Failed to update configuration');
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setEditingConfig(null);
    setEditValue('');
  };

  // Format value for display
  const formatValue = (value) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return value.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
        <span className="ml-2 text-gray-600">Loading configurations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage categories, metals, and other system settings
          </p>
        </div>
      </div>

      {/* Configuration List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Configuration Settings</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {configurations.map((config) => (
            <div key={config.key} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 capitalize">
                    {config.key.replace(/_/g, ' ')}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{config.description}</p>
                  
                  {editingConfig && editingConfig.key === config.key ? (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Configuration Value
                        </label>
                        {Array.isArray(config.value) ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="Enter comma-separated values"
                          />
                        ) : typeof config.value === 'object' ? (
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            rows={8}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-mono text-sm"
                            placeholder="Enter JSON configuration"
                          />
                        ) : (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="Enter configuration value"
                          />
                        )}
                        {Array.isArray(config.value) && (
                          <p className="mt-1 text-xs text-gray-500">
                            Separate multiple values with commas
                          </p>
                        )}
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                          {formatValue(config.value)}
                        </pre>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Last updated: {new Date(config.updatedAt).toLocaleString()}
                        {config.updatedBy && ` by ${config.updatedBy.name}`}
                      </div>
                    </div>
                  )}
                </div>
                
                {(!editingConfig || editingConfig.key !== config.key) && (
                  <button
                    onClick={() => handleEdit(config)}
                    className="ml-4 px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Configuration Help</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>Categories:</strong> Product categories for jewelry items (comma-separated)</p>
          <p><strong>Metals:</strong> Available metal types (comma-separated)</p>
          <p><strong>Purities:</strong> Metal purity options (comma-separated)</p>
          <p><strong>Site Settings:</strong> JSON object with site information and settings</p>
          <p className="mt-4 text-blue-600">
            <strong>Note:</strong> Changes to configurations will affect all product forms and frontend displays immediately.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationManagement;
