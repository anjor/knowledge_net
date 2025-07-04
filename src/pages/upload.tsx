import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useWeb3 } from '../hooks/useWeb3';
import { Toast } from '../components/Toast';

const UploadPage = () => {
  const router = useRouter();
  const { registerDataset, account, connectWallet, isConnected } = useWeb3();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: '',
    format: 'json',
    license: 'CC-BY-4.0',
    price: '0.05'
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    type: "success" | "error";
    title: string;
    message: string;
    transactionHash?: string;
  }>({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      await connectWallet();
      return;
    }

    if (!file) {
      setToast({
        show: true,
        type: "error",
        title: "File Required",
        message: "Please select a file to upload.",
      });
      return;
    }

    setUploading(true);
    
    try {
      // For demo purposes, use a mock IPFS hash
      // In production, you'd upload to IPFS first
      const mockIpfsHash = `Qm${Math.random().toString(36).substring(2, 48)}`;
      
      const metadata = {
        name: formData.name,
        description: formData.description,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        format: formData.format,
        size: file.size,
        license: formData.license
      };

      const txHash = await registerDataset(mockIpfsHash, metadata, formData.price);

      setToast({
        show: true,
        type: "success",
        title: "Dataset Uploaded Successfully!",
        message: `Your dataset "${formData.name}" has been registered on the Filecoin blockchain. It will need to be validated before users can purchase it.`,
        transactionHash: txHash,
      });

      // Reset form
      setFormData({
        name: '',
        description: '',
        tags: '',
        format: 'json',
        license: 'CC-BY-4.0',
        price: '0.05'
      });
      setFile(null);

    } catch (error: any) {
      setToast({
        show: true,
        type: "error",
        title: "Upload Failed",
        message: error.message || "Failed to upload dataset.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Toast
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        transactionHash={toast.transactionHash}
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button 
                onClick={() => router.push('/')}
                className="text-2xl font-bold text-gray-900 hover:text-blue-600"
              >
                KnowledgeNet
              </button>
              {account && (
                <span className="text-sm text-gray-600">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              )}
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Upload Dataset
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Share your scientific data with AI researchers worldwide and earn FIL rewards
            </p>
          </div>

          {/* Upload Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dataset Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dataset Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Medical Image Dataset"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your dataset, its contents, and potential use cases..."
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., medical, ai-training, imaging"
                />
              </div>

              {/* Format and License */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Format
                  </label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="json">JSON</option>
                    <option value="csv">CSV</option>
                    <option value="parquet">Parquet</option>
                    <option value="xml">XML</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License
                  </label>
                  <select
                    value={formData.license}
                    onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="CC-BY-4.0">CC-BY-4.0</option>
                    <option value="Open Data">Open Data</option>
                    <option value="Commercial">Commercial</option>
                    <option value="MIT">MIT</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Access (FIL)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.05"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dataset File *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept=".json,.csv,.xml,.txt,.parquet"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer"
                  >
                    {file ? (
                      <div>
                        <p className="text-sm text-gray-600">
                          Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                        <p className="text-xs text-blue-600 mt-2">Click to change file</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-600">Click to select a file</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Supports JSON, CSV, XML, TXT, Parquet files
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={uploading || !isConnected}
                  className={`px-8 py-3 rounded-lg font-semibold transition ${
                    isConnected && !uploading
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {!isConnected ? "Connect Wallet First" : 
                   uploading ? "Uploading..." : "Upload Dataset"}
                </button>
              </div>
            </form>
          </div>

          {/* Info Section */}
          <div className="mt-12 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              How it works
            </h3>
            <div className="space-y-2 text-blue-800">
              <p>1. Upload your dataset and fill in the metadata</p>
              <p>2. Pay registration fee and submit to Filecoin blockchain</p>
              <p>3. Validators review and score your dataset quality</p>
              <p>4. Once verified, users can purchase access and you earn FIL</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadPage;