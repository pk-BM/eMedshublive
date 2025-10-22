import React, { useEffect, useState } from "react";
import "./TestPage.css";
import NewsCard from "../../components/News/NewsCard.jsx";
import TestCard from "../../components/Test/TestCard.jsx"
import { GetAllTests } from "../../lib/APIs/testAPI.js";
import { TrustedCenterOptions } from "../../lib/APIs/TrustedCenterAPI";

const TestPage = () => {
  const [testList, setTestList] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [centers, setCenters] = useState([]);

  // ✅ Fetch Tests
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await GetAllTests();
        const data = response.data || [];
        setTestList(data);
        setFilteredTests(data);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };

    fetchTests();
  }, []);

  // ✅ Fetch Trusted Centers
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await TrustedCenterOptions();
        setCenters(response.data || []);
      } catch (error) {
        console.error("Error fetching centers:", error);
      }
    };

    fetchCenters();
  }, []);

  // ✅ Filter tests when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTests(testList);
    } else {
      const filtered = testList.filter((test) =>
        test.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTests(filtered);
    }
  }, [searchTerm, testList]);

  return (
    <div className="test-page">
      {/* ✅ SearchBar at top */}
      {/* <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> */}
        <input
          type="text"
          placeholder="Search Test"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

      {/* ✅ Tests List */}
      <div className="test-list">
        {filteredTests.length > 0 ? (
          filteredTests.map((test) => {
            const centerNames = test.trustedCenters
              ?.map((id) => centers.find((c) => c._id === id)?.name)
              .filter(Boolean);

            return (
              <TestCard
                key={test._id}
                name={test.name}
                image={test.image}
                description={test.description}
                trustedCenters={centerNames || []}
              />
            );
          })
        ) : (
          <p>No medical tests found.</p>
        )}
      </div>
    </div>
  );
};

export default TestPage;

