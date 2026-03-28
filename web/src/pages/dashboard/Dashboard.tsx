import { useEffect } from "react";
import { PlusCircle, Search } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchBatchesThunk, selectBatch } from "../../store/batchSlice";

import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { Spinner } from "../../components/common/Spinner";
import { formatDate } from "../../utils/helpers";

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { batches, loading, error } = useAppSelector(selectBatch);

  useEffect(() => {
    dispatch(fetchBatchesThunk());
  }, [dispatch]);

  const renderRoleSpecificAction = () => {
    if (!user) return null;
    switch (user.role) {
      case "farmer":
        return <Button className="gap-2"><PlusCircle size={18} /> Register Harvest</Button>;
      case "lab":
        return <Button variant="secondary" className="gap-2"><Search size={18} /> View Pending Queue</Button>;
      case "certifier":
        return <Button variant="secondary" className="gap-2">Issue Certifications</Button>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <p className="text-gray-500 mt-1">Here is the overview of your AyurChain activities.</p>
        </div>
        <div>
          {renderRoleSpecificAction()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-primary to-primary-light text-white p-6 rounded-xl border-none">
          <h3 className="text-white/80 font-medium">Total Batches</h3>
          <p className="text-4xl font-bold mt-2">{batches.length}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-gray-500 font-medium">Pending Actions</h3>
          <p className="text-4xl font-bold mt-2 text-gray-900">0</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-gray-500 font-medium">Active Certificates</h3>
          <p className="text-4xl font-bold mt-2 text-gray-900">--</p>
        </Card>
      </div>

      <Card title="Recent Supply Chain Activity">
        {loading ? (
          <div className="py-12 flex justify-center"><Spinner size="lg" /></div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
        ) : batches.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            No batches found. Start by creating your first batch.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Herb Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {batches.map((batch) => (
                  <tr key={batch._id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">#{batch.batchId.substring(0, 8)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{batch.herbName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(batch.harvestDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge stage={batch.currentStage} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {batch.isCertified ? <Badge label="Certified" colorClass="bg-green-100 text-green-800" /> : <span className="text-gray-400">Pending</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
