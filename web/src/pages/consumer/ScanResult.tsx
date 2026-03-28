import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle, Shield, FileText, AlertTriangle, ChevronRight, Activity } from "lucide-react";

import { consumerAPI } from "../../api/axiosInstance";
import { ConsumerScanResult } from "../../types";
import { formatDate, stageToLabel } from "../../utils/helpers";
import { Card } from "../../components/common/Card";
import { Spinner } from "../../components/common/Spinner";
import { Badge } from "../../components/common/Badge";

export const ScanResult: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<ConsumerScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerification = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const result = await consumerAPI.verify(token);
        setData(result);
      } catch (err: any) {
        setError(err.response?.data?.error || "Could not verify this product.");
      } finally {
        setLoading(false);
      }
    };
    fetchVerification();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface">
        <Spinner size="lg" className="mb-4" />
        <p className="text-gray-500 animate-pulse font-medium">Verifying Product Authenticity on AyurChain...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-surface p-4">
        <Card className="max-w-md w-full text-center p-8 border-red-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
          <p className="text-gray-600 mb-6">{error || "Invalid QR code or product not found."}</p>
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-500">
            Please ensure you scanned a valid AyurChain product QR code. If the problem persists, contact support.
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen pb-12">
      {/* Hero Banner */}
      <div className="bg-primary text-white pt-10 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {data.blockchainVerified && (
                  <Badge label="Blockchain Verified" colorClass="bg-green-400/20 text-green-300 border border-green-400/30" />
                )}
                {data.isCertified && (
                  <Badge label="Certified Organic" colorClass="bg-accent/20 text-accent-light border border-accent/30" />
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{data.herbName}</h1>
              <p className="text-primary-light text-lg italic">{data.scientificName}</p>
            </div>
            
            {/* Trust Score indicator */}
            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/20 text-center min-w-[140px]">
              <div className="text-sm font-medium text-white/80 mb-1 uppercase tracking-wide">Trust Score</div>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold">{data.trustScore}</span>
                <span className="text-xl text-white/60">/100</span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-white/20 h-1.5 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-accent h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${data.trustScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-8 space-y-6">
        
        {/* Source Card */}
        <Card className="shadow-lg border-white/50 backdrop-blur-xl">
          <div className="flex items-start gap-4 p-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Source Origin</h3>
              <p className="text-gray-600 flex items-center gap-2">
                <span className="font-medium">{data.farmerName}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span>{data.farmerLocation}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">Harvested on {formatDate(data.harvestDate)}</p>
            </div>
          </div>
        </Card>

        {/* Timeline */}
        <Card title="Traceability Journey" className="shadow-md">
          <div className="relative border-l-2 border-primary/20 ml-3 md:ml-6 my-4">
            {data.journey.map((step, idx) => {
              return (
                <div key={idx} className="mb-8 ml-6 relative">
                  <span className="absolute -left-[35px] top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center border-4 border-white shadow-sm">
                    <CheckCircle size={12} className="text-white" />
                  </span>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{stageToLabel(step.stage)}</h4>
                      <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-100">
                        {formatDate(step.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Processed by <span className="font-medium text-gray-800">{step.actorName}</span></p>
                    {step.notes && <p className="text-sm text-gray-500 italic">"{step.notes}"</p>}
                    
                    {step.txHash && (
                      <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-light">
                        <Activity size={14} />
                        <a href={`https://mumbai.polygonscan.com/tx/${step.txHash}`} target="_blank" rel="noreferrer" className="flex items-center">
                          View on Blockchain <ChevronRight size={14} />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Certificates */}
        {data.certificates && data.certificates.length > 0 && (
          <Card title="Certificates & Lab Reports" className="shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {data.certificates.map((cert, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-accent/10 text-accent-dark flex items-center justify-center flex-shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-900 truncate">{cert.certType}</h5>
                    <p className="text-xs text-gray-500 truncate">Issued by {cert.certifierOrgName}</p>
                    {cert.ipfsHash && (
                      <a 
                        href={`https://ipfs.io/ipfs/${cert.ipfsHash}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex mt-1 text-xs font-medium text-primary hover:underline items-center gap-1"
                      >
                        <Shield size={12} /> View Document
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
