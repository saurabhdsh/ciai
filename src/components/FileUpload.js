import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Check } from 'lucide-react';
import Papa from 'papaparse';

function FileUpload({ onDataLoaded }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv') {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setIsLoading(false);
          if (results.errors.length > 0) {
            setError('Error parsing CSV file');
            return;
          }
          setSuccess(true);
          onDataLoaded(results.data);
        },
        error: () => {
          setIsLoading(false);
          setError('Error parsing CSV file');
        }
      });
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      setError('Excel files are not supported yet. Please convert to CSV.');
      setIsLoading(false);
    } else {
      setError('Unsupported file format. Please upload a CSV or Excel file.');
      setIsLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      processFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      processFile(selectedFile);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border'
        } ${error ? 'border-error bg-error/5' : ''} ${success ? 'border-success bg-success/5' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          {!file ? (
            <>
              <div className="p-3 rounded-full bg-tertiary">
                <Upload className="h-6 w-6 text-secondary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">
                  Drag and drop your CSV or Excel file here
                </p>
                <p className="text-xs text-secondary mt-1">
                  or click to browse files
                </p>
              </div>
              <button
                type="button"
                onClick={handleButtonClick}
                className="apple-button mt-2"
              >
                Browse Files
              </button>
            </>
          ) : (
            <div className="w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-md bg-tertiary">
                    <FileText className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px]">
                      {file.name}
                    </p>
                    <p className="text-xs text-secondary">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1 rounded-full hover:bg-tertiary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              {isLoading && (
                <div className="mt-3 flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                  <p className="text-xs">Processing file...</p>
                </div>
              )}
              
              {error && (
                <div className="mt-3 text-xs text-error">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mt-3 flex items-center space-x-2 text-success">
                  <Check className="h-4 w-4" />
                  <p className="text-xs">File processed successfully!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv,.xlsx,.xls"
        className="hidden"
      />
    </div>
  );
}

export default FileUpload; 