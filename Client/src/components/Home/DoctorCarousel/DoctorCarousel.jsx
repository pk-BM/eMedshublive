import { useEffect, useState } from "react";
import { GetLeaders } from "../../../lib/APIs/leaderAPI";
import { Link } from "react-router-dom";


export default function LatestLeaders() {
  const [leaders, setLeaders] = useState([]);

  const GetLeader = async () => {
    const response = await GetLeaders()
    setLeaders(response?.data)
  }

  useEffect(() => {
    GetLeader()
  }, []);

  return (
    <div className="py-3 bg-blue text-center">
      <div className="flex flex-wrap justify-center gap-8">
        {leaders.map((leader) => (
          <div
            key={leader._id}
            className="w-48 flex flex-col items-center transition-transform hover:scale-105"
          >
       <Link 
        to={`/leaders/${leader._id}`}
      >
            <img
              src={leader.profilePicture}
              alt={leader.name}
              className="w-40 h-40 object-cover rounded-full shadow-md mb-3"
            />
      </Link>
            <h3 className="text-lg font-semibold">{leader.name}</h3>
          </div>
        ))}
      </div>
      <div className="py-10" >
      <Link 
        to="/leaders"
        className="px-4 py-2 border rounded-md text-sm font-medium transition-all border-[#34d399] text-[#34d399] hover:bg-[#34d399] hover:text-white  "
      >
        View More
      </Link>
      </div>
    </div>
  );
}
