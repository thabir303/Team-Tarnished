import { Download, Eye, Lock, Globe } from 'lucide-react';

const PdfCard = ({ pdf }) => {
  const { caption, fileUrl, transparency, content, createdAt } = pdf;
  
  const handleDownload = () => {
    window.open(fileUrl, '_blank');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-lg truncate w-3/4">{caption || 'Untitled PDF'}</h3>
          {transparency === 'private' ? 
            <Lock className="w-5 h-5 text-gray-500" /> : 
            <Globe className="w-5 h-5 text-blue-500" />
          }
        </div>
        
        <div className="h-24 overflow-hidden text-gray-600 text-sm mb-4">
          {content?.slice(0, 150)}...
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {formatDate(createdAt)}
          </span>
          
          <div className="flex gap-2">
            <button 
              onClick={() => window.open(fileUrl, '_blank')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="View PDF"
            >
              <Eye className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={handleDownload}
              className="p-2 rounded-full hover:bg-blue-50 transition-colors"
              title="Download PDF"
            >
              <Download className="w-5 h-5 text-blue-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfCard;