import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    axios
      .get(`${apiUrl}/api/emails/extract`)
      .then((res) => {
        if (res.data.success) {
          const data = res.data.data;
          for (let i = 0; i < data.length; i++) {
            let time = new Date(data[i].time_received);
            data[
              i
            ].time_received = `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()}`;
          }
          setTasks(data);
        } else {
          console.error("Failed to fetch data");
        }
      })
      .catch((err) => {
        console.error("API error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">📬 Email Tasks</h1>
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="flex items-center justify-between bg-white shadow-md rounded-2xl p-4 border border-gray-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <h2 className="text-lg font-semibold text-gray-800">{task.sender}</h2>
                <p className="text-gray-600 mt-2 sm:mt-0 break-words">{task.task}</p>
              </div>
              <div className="flex items-center mt-4 sm:mt-0 text-sm text-gray-500">
                <span className="inline-block bg-gray-200 px-2 py-1 rounded-full text-xs font-medium text-gray-700 mr-2">
                  {task.type}
                </span>
                <span className="whitespace-nowrap text-gray-700 font-medium">
                  {task.time_received}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
