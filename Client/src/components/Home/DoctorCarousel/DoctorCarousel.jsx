import { useEffect, useState } from "react";
import axios from "axios";

export default function LatestLeaders() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    axios
      .get("/api/leaders") // same endpoint
      .then((res) => setLeaders(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="py-12 bg-white text-center">
      <h2 className="text-2xl font-bold mb-6">Our Leaders</h2>

      <div className="flex flex-wrap justify-center gap-8">
        {leaders.map((leader) => (
          <div
            key={leader._id}
            className="w-48 flex flex-col items-center transition-transform hover:scale-105"
          >
            <img
              src={leader.profilePicture}
              alt={leader.name}
              className="w-40 h-40 object-cover rounded-full shadow-md mb-3"
            />
            <h3 className="text-lg font-semibold">{leader.name}</h3>
          </div>
        ))}
      </div>

      <button className="mt-8 px-6 py-2 bg-indigo-700 text-white rounded-full hover:bg-indigo-800 transition">
        View More
      </button>
    </div>
  );
}
