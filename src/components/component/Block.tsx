"use client";

import { useState, ChangeEvent } from "react";

type ReportType = {
  t1: string | null;
  t2: string | null;
  t3: string | null;
  finalResult: string | null;
};

export function Block() {
  const [file, setFile] = useState<File | null>(null);
  const [reports, setReports] = useState<ReportType>({
    t1: null,
    t2: null,
    t3: null,
    finalResult: null,
  });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile && uploadedFile.type === "image/tiff") {
      setFile(uploadedFile);
      analyzeImage(uploadedFile);
    } else {
      alert("Please upload a TIFF image file.");
    }
  };

  const analyzeImage = async (file: File) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await fetch('https://backend-at.onrender.com/api/predict', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      setReports({
        t1: data[0]?.url || null,
        t2: data[1]?.url || null,
        t3: data[2]?.url || null,
        finalResult: data[3]?.url || null,
      });
    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("An error occurred while analyzing the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          className={`bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 transition-all duration-300 ${
            hoveredIndex === 0 ? "transform scale-105" : ""
          }`}
          onMouseEnter={() => setHoveredIndex(0)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <h2 className="text-2xl font-bold mb-4">Upload TIFF Image</h2>
          <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg p-8">
            {file ? (
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">{file.name}</p>
                <button
                  onClick={() => setFile(null)}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
                >
                  Remove File
                </button>
              </div>
            ) : (
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
                <div className="h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
                <span className="text-gray-500 dark:text-gray-400">Drop file or click to upload</span>
                <input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} />
              </label>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <ReportCard
            title="Crop Growth Report - T1"
            url={reports.t1}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            index={1}
            loading={loading}
          />
          <ReportCard
            title="Crop Growth Report - T2"
            url={reports.t2}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            index={2}
            loading={loading}
          />
          <ReportCard
            title="Crop Growth Report - T3"
            url={reports.t3}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            index={3}
            loading={loading}
          />
          <ReportCard
            title="Final Crop Growth Report"
            url={reports.finalResult}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            index={4}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

interface ReportCardProps {
  title: string;
  url: string | null;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
  index: number;
  loading: boolean;
}

const ReportCard: React.FC<ReportCardProps> = ({
  title,
  url,
  hoveredIndex,
  setHoveredIndex,
  index,
  loading,
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 transition-all duration-300 ${
        hoveredIndex === index ? "transform scale-105" : ""
      }`}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      ) : url ? (
        <img src={url} alt={title} className="w-full h-auto rounded-lg" />
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400">
          No report available. Please upload a TIFF image to generate the report.
        </div>
      )}
    </div>
  );
};
