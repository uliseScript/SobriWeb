// Puedes guardar esto como: /componets/UserManagement.tsx

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase"; 

// Define un tipo para tu usuario, similar a tu UserProfile
interface User {
  id: string;
  age: string;
  displayName: string;
  email: string;
  role: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);

  // 1. (R) READ - Leer todos los usuarios al cargar
  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, "users");
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
      })) as User[];
      setUsers(userList);
    };

    fetchUsers();
  }, []);

  // 2. (D) DELETE - Función para eliminar un usuario
  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      try {
        await deleteDoc(doc(db, "users", id));
        // Actualizar el estado local para quitar al usuario de la lista
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
        alert("Usuario eliminado con éxito");
      } catch (error) {
        console.error("Error al eliminar usuario: ", error);
        alert("Error al eliminar usuario");
      }
    }
  };

  // 3. (U) UPDATE - (Placeholder)
  // Aquí pondrías la lógica para editar,
  // como abrir un modal con un formulario
  const handleEdit = (id: string) => {
    alert(`EDITAR: Próximamente (ID: ${id})`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-xl font-bold mb-4">Gestión de Usuarios</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Edad</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">{user.displayName}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.age}</td>

              <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleEdit(user.id)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}