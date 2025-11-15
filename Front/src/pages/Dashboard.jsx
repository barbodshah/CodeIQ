import { useEffect, useState } from "react";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch("http://localhost:8000/courses");
        if (!response.ok) {
          throw new Error("Failed to load courses");
        }

        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Loading courses...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        <h1 className="text-xl font-bold">Error:</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Courses</h1>

      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <ul className="space-y-4">
          {courses.map((course) => (
            <li key={course._id} className="p-4 border rounded shadow-sm bg-white">
              <h2 className="text-lg font-semibold">{course.title}</h2>
              <p className="text-gray-600">{course.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
