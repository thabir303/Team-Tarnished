import useAxiosSecure from '../Hooks/useAxiosSecure';
import "react-tabs/style/react-tabs.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useState } from 'react';
import PdfCard from './PdfCard';
import { Search } from 'lucide-react';

const Home = () => {
    const [pdfs, setPdfs] = useState([]);
    const axiosSecure = useAxiosSecure();

    const handleAll = () => {
        axiosSecure
            .get("http://localhost:3000/api/v1/pdf")
            .then((res) => {
                setPdfs(res.data.data);
            });
    };

    const handleSearch = (e) => {
        axiosSecure
            .get(`http://localhost:3000/api/v1/pdf?searchTerm=${e.target.value}`)
            .then((res) => {
                setPdfs(res.data.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <Tabs defaultFocus={true}>
                <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4">
                    <TabList className="flex space-x-4 overflow-x-auto pb-2">
                        <Tab 
                            className="px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer outline-none"
                            selectedClassName="bg-blue-50 text-blue-600 font-medium"
                            onFocus={handleAll}
                        >
                            All PDFs
                        </Tab>
                    </TabList>

                    <div className="relative w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search PDFs..."
                            className="w-full md:w-64 px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => handleSearch(e)}
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                </div>

                <div className="mt-8">
                    <TabPanel>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pdfs
                            .filter(pdf => pdf.transparency === "public")
                            .map((pdf) => (
                                <PdfCard key={pdf._id} pdf={pdf} />
                            ))}
                            {pdfs.length === 0 && (
                                <div className="col-span-full text-center py-10 text-gray-500">
                                    No PDFs found.
                                </div>
                            )}
                        </div>
                    </TabPanel>
                </div>
            </Tabs>
        </div>
    );
};

export default Home;