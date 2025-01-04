/* eslint-disable react/prop-types */
import { Download, Eye, Lock, Globe } from "lucide-react";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const PdfCard = ({ pdf }) => {
  const axiosSecure = useAxiosSecure();
  const { caption, fileUrl, transparency, user, translatedContent, content, createdAt } = pdf;
  const baseUrl = "http://localhost:9000";

  const parseFileUrl = (fileUrl) => {
    try {
      const parts = fileUrl?.split("/").filter(Boolean);
      if (!parts || parts.length < 2) {
        throw new Error("Invalid file URL format.");
      }
      const bucketName = parts[0];
      const fileName = parts[1];
      return { bucketName, fileName };
    } catch (error) {
      console.error(error.message);
      return null;
    }
  };

  const handleDownload = async () => {
    try {
      const parsedUrl = fileUrl ? parseFileUrl(fileUrl) : null;
      const { fileName } = parsedUrl || {};
  
      if (!fileName) {
        console.error("File name is missing.");
        return;
      }
  
      const response = await axiosSecure.get(`http://localhost:3000/api/v1/pdf/file/${fileName}`, {
        responseType: "blob",
      });
  
      // Log response headers and status for debugging
      console.log(response);
      console.log(response.headers['content-type']);  // Ensure it's application/pdf
  
      if (response.status !== 200) {
        console.error("Failed to fetch file. Status code:", response.status);
        return;
      }
  
      const blob = new Blob([response.data], { type: "application/pdf" });
      console.log(blob.size);
  
      // Debug: Try opening the file in a new tab to verify it
      const pdfUrl = window.URL.createObjectURL(blob);
      window.open(pdfUrl, '_blank');
  
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName || "download.pdf";
      link.click();
  
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const cleanContent = content?.replace(/<\/?p>/g, '').slice(0, 150);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-lg truncate w-3/4">
            {caption || "Untitled PDF"}
          </h3>
          {transparency === "private" ? (
            <Lock className="w-5 h-5 text-gray-500" />
          ) : (
            <Globe className="w-5 h-5 text-blue-500" />
          )}
        </div>

        <div className="h-24 overflow-hidden text-gray-600 text-sm mb-4">
        {translatedContent}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{formatDate(createdAt)}</span>
          <span className="text-xs text-gray-500">{user.email}</span>

          <div className="flex gap-2">
            <button
              onClick={() => window.open(`${baseUrl}${fileUrl}`, "_blank")}
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
