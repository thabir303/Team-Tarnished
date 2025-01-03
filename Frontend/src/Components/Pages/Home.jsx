import useAxiosSecure from '../Hooks/useAxiosSecure';
import "react-tabs/style/react-tabs.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useState } from 'react';

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
          .get(
            `http://localhost:3000/api/v1/pdf?searchTerm=${e.target.value}`
          )
          .then((res) => {
            setPdfs(res.data.data);
          })
          .catch((err) => {
            console.error(err);
          });
      };
    return (
        <div className="max-w-7xl mx-auto flex flex-col py-10 justify-center gap-8 px-5">
      <div>
        <Tabs defaultFocus={true}>
          <div className="flex flex-col-reverse md:flex-row md:space-x-2 md:items-center justify-between items-end gap-2 text-xs md:text-base">
            <TabList className="grid grid-cols-3 md:grid-cols-5 justify-between gap-x-4">
              <Tab onFocus={handleAll}>
                <h1>All PDFs</h1>
              </Tab>
            </TabList>
            <div className="">
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Search"
                  className="input input-bordered w-24 md:w-auto"
                  onChange={(e) => handleSearch(e)}
                />
              </div>
            </div>
          </div>
          <div className="my-10"></div>
          <TabPanel>
            <div className="flex flex-col gap-10">
              {pdfs.map((vehicle) => (
                <div>Hello</div>
              ))}
            </div>
          </TabPanel>
          <TabPanel>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 py-10 justify-center items-center sm:grid-cols-2 gap-x-12 gap-y-8 ">
              {pdfs.map((document) => (
                <div>Hello</div>
              ))}
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
    );
};

export default Home;