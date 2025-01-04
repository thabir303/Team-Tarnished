import { useParams } from "react-router-dom";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useEffect, useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, Users, Clock, TrendingUp, Eye, Book } from 'lucide-react';
import PdfCard from "./PdfCard";

const StatCard = ({ title, value, icon: Icon, change }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl border">
    <div className="flex justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-semibold mt-1">{value}</h3>
        {change && (
          <p className={`text-xs mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '+' : ''}{change}% from last month
          </p>
        )}
      </div>
      <Icon className="h-8 w-8 text-blue-500/20" />
    </div>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const [user, setUser] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [editorContent, setEditorContent] = useState("");
  const [transparency, setTransparency] = useState("public");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [stats, setStats] = useState({
    monthlyData: [],
    metrics: {
      totalViews: 0,
      avgWordCount: 0,
      categories: [],
      engagement: 0
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, pdfsData] = await Promise.all([
          axiosSecure.get(`http://localhost:3000/api/v1/user/${id}`),
          axiosSecure.get("http://localhost:3000/api/v1/pdf")
        ]);
        setUser(userData.data.data);
        setPdfs(pdfsData.data.data);

        // Simulated analytics data - replace with real API calls
        const monthlyStats = Array.from({ length: 6 }, (_, i) => ({
          month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
          pdfs: Math.floor(Math.random() * 15) + 5,
          views: Math.floor(Math.random() * 100) + 50
        }));

        const categories = ['Academic', 'Technical', 'Story', 'Article'].map(cat => ({
          name: cat,
          count: Math.floor(Math.random() * 20) + 5
        }));

        setStats({
          monthlyData: monthlyStats,
          metrics: {
            totalViews: monthlyStats.reduce((sum, m) => sum + m.views, 0),
            avgWordCount: Math.floor(Math.random() * 500) + 500,
            categories,
            engagement: Math.floor(Math.random() * 30) + 70
          }
        });
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, [axiosSecure, id]);

  // Speech recognition setup
  useEffect(() => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "bn-BD";
    recognition.interimResults = false;
    recognition.onresult = (e) => setEditorContent(prev => prev + e.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
  }, []);

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handlePdfSubmit = async () => {
    if (!editorContent.trim()) {
      alert("Content is required");
      return;
    }

    try {
      await axiosSecure.post("http://localhost:3000/api/v1/pdf/create-pdf", {
        content: editorContent,
        user: user._id,
        transparency
      });
      
      const [updatedPdfs] = await Promise.all([
        axiosSecure.get("http://localhost:3000/api/v1/pdf"),
        axiosSecure.patch(`http://localhost:3000/api/v1/user/${id}`, {
          totalPdf: (user.totalPdf || 0) + 1
        })
      ]);

      setPdfs(updatedPdfs.data.data);
      setEditorContent("");
      setTransparency("public");
    } catch (error) {
      console.error("Error creating PDF:", error);
      alert("Failed to create PDF");
    }
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {user.photo && (
            <img src={user.photo} alt="" className="w-24 h-24 rounded-xl object-cover" />
          )}
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600 mt-1">{user.email}</p>
            <div className="flex gap-2 mt-3">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                {user.role}
              </span>
              <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">
                {user.totalPdf} PDFs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      {user && id === user._id && (
        <div className="mb-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total PDFs" 
              value={user.totalPdf}
              icon={FileText}
              change={12}
            />
            <StatCard 
              title="Total Views" 
              value={stats.metrics.totalViews}
              icon={Eye}
              change={8}
            />
            <StatCard 
              title="Avg. Words" 
              value={stats.metrics.avgWordCount}
              icon={Book}
            />
            <StatCard 
              title="Engagement" 
              value={`${stats.metrics.engagement}%`}
              icon={TrendingUp}
              change={5}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-medium mb-4">Monthly Activity</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="pdfs" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="PDFs Created"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="Views"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-medium mb-4">Content Categories</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.metrics.categories}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Editor */}
      {user && id === user._id && (
        <div className="bg-white rounded-xl border p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Create New PDF</h2>
            <select
              value={transparency}
              onChange={(e) => setTransparency(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <Editor
            apiKey="6qm56tt07vwxfxp49ag0k9amhh4kii4ehi5ofx7k8zwr22kg"
            value={editorContent}
            init={{
              height: 400,
              menubar: false,
              plugins: ["link", "lists", "code"],
              toolbar: "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | code",
              skin: "oxide",
            }}
            onEditorChange={content => setEditorContent(content)}
          />

          <div className="flex gap-4 mt-4">
            <button
              onClick={toggleVoiceInput}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isListening
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {isListening ? "Stop Recording" : "Start Voice Input"}
            </button>

            <button
              onClick={handlePdfSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Create PDF
            </button>
          </div>
        </div>
      )}

      {/* Published PDFs */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-xl font-semibold mb-6">Published PDFs</h2>
        {pdfs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pdfs
              .filter(pdf => pdf.user._id === id && (pdf.Transparency !== "private" || pdf.user._id === user._id))
              .map(pdf => (
                <PdfCard key={pdf._id} pdf={pdf} />
              ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No PDFs published yet</p>
        )}
      </div>
    </div>
  );
};

export default Profile;