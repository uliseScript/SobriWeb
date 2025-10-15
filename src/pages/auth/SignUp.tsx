import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { auth, db, googleProvider } from "../../firebase";
import Alert from "../../components/Alert";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, signOut } from "firebase/auth";
import { doc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import type { UserProfile } from "../../type";

type FormState = { name: string; age: string; email: string; password: string };

export default function SignUp() {
  const [form, setForm] = useState<FormState>({ name: "", age: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{type: 'success' | 'error', message: string}>({ type: 'success', message: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (errorMsg) {
      setAlertConfig({ type: 'error', message: errorMsg });
      setShowAlert(true);
      const timer = setTimeout(() => setShowAlert(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const ageNumber = Number.parseInt(form.age, 10);
    if (!form.name.trim()) {
      setErrorMsg("El nombre es requerido.");
      return;
    }
    if (!Number.isFinite(ageNumber) || ageNumber <= 0) {
      setErrorMsg("Edad inválida.");
      return;
    }
    if (ageNumber < 15) {
      setErrorMsg("Lo sentimos, debes tener al menos 15 años para registrarte en SobriWeb.");
      return;
    }
    if (form.password.length < 6) {
      setErrorMsg("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(cred.user, { displayName: form.name });

      const profile: UserProfile = {
        uid: cred.user.uid,
        displayName: form.name,
        age: ageNumber,
        email: form.email.toLowerCase(),
        createdAt: serverTimestamp(),
        profileCompleted: true
      };
      await setDoc(doc(db, "users", cred.user.uid), profile);
      setAlertConfig({ type: 'success', message: '¡Cuenta creada exitosamente!' });
      setShowAlert(true);
      setTimeout(() => {
        //navigate("/dashboard");
        navigate("/home");
      }, 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes('auth/email-already-in-use')) {
          setErrorMsg("Este correo electrónico ya está registrado. Por favor, inicia sesión.");
        } else {
          setErrorMsg(err.message);
        }
      } else {
        setErrorMsg("Error al registrarse.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb]">
      {showAlert && (
        <Alert 
          type={alertConfig.type} 
          message={alertConfig.message}
          onClose={() => setShowAlert(false)}
        />
      )}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[#36b6e7] flex items-center justify-center mb-2">
            <span className="text-2xl font-bold text-white">S</span>
          </div>
          <span className="text-2xl font-extrabold text-gray-800 tracking-tight">SobriWeb</span>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Crear cuenta</h2>
        {errorMsg && (
          <p className="mb-3 rounded-xl bg-red-50 text-red-700 px-4 py-2 text-sm text-center">{errorMsg}</p>
        )}

        {/* Desactiva validación nativa */}
        <form onSubmit={handleSubmit} className="w-full space-y-4" noValidate>
          <div>
            <input
              name="name"
              placeholder="Nombre"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#36b6e7] bg-gray-50 text-gray-800"
              required
              onInvalid={(e) => e.preventDefault()}
            />
          </div>
          <div>
            <input
              name="age"
              type="number"
              min={15} // se mantiene por accesibilidad, pero no dispara tooltip
              placeholder="Edad"
              value={form.age}
              onChange={handleChange}
              onInvalid={(e) => e.preventDefault()} // evita tooltip del browser
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#36b6e7] bg-gray-50 text-gray-800"
              required
            />
          </div>
          <div>
            <input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              onInvalid={(e) => e.preventDefault()}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#36b6e7] bg-gray-50 text-gray-800"
              required
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              onInvalid={(e) => e.preventDefault()}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#36b6e7] bg-gray-50 text-gray-800"
              required
            />
          </div>
          <button
            disabled={loading}
            className="w-full rounded-lg bg-[#195b8c] text-white py-2 font-semibold text-lg shadow hover:bg-[#174e7a] transition disabled:opacity-60"
          >
            {loading ? "Creando..." : "Registrarme"}
          </button>
        </form>

        <div className="mt-4 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">O continúa con</span>
          </div>
        </div>

        <button
          onClick={async () => {
            try {
              setLoading(true);
              setErrorMsg("");
              const result = await signInWithPopup(auth, googleProvider);
              
              // Verificar si el usuario ya existe
              const userDoc = await getDoc(doc(db, "users", result.user.uid));
              if (userDoc.exists()) {
                await signOut(auth);
                setErrorMsg("Esta cuenta de Google ya está registrada. Por favor, inicia sesión.");
                return;
              }
              
              // Crear perfil de usuario en Firestore
              const profile = {
                uid: result.user.uid,
                displayName: result.user.displayName,
                email: result.user.email?.toLowerCase(),
                age: 0, // Valor por defecto
                createdAt: serverTimestamp(),
                profileCompleted: false
              };
              
              await setDoc(doc(db, "users", result.user.uid), profile);
              setAlertConfig({
                type: 'success',
                message: '¡Registro con Google exitoso!'
              });
              setShowAlert(true);
              setTimeout(() => {
                //navigate("/dashboard");
                navigate("/home");
              }, 3000);
            } catch (err) {
              setErrorMsg(err instanceof Error ? err.message : "Error al registrarse con Google");
              console.error(err);
            } finally {
              setLoading(false);
            }
          }}
          className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#36b6e7] focus:ring-offset-2"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" loading="lazy" alt="google logo"/>
          <span>Continuar con Google</span>
        </button>

        <div className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-green-600 hover:underline font-semibold">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}

//   useEffect(() => {
//     if (errorMsg) {
//       setAlertConfig({
//         type: 'error',
//         message: errorMsg
//       });
//       setShowAlert(true);
//       const timer = setTimeout(() => setShowAlert(false), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [errorMsg]);

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
//     setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setErrorMsg("");

//     const ageNumber = Number.parseInt(form.age, 10);
//     if (!form.name.trim()) {
//       setErrorMsg("El nombre es requerido.");
//       return;
//     }
//     if (!Number.isFinite(ageNumber) || ageNumber <= 0) {
//       setErrorMsg("Edad inválida.");
//       return;
//     }
//     if (ageNumber < 15) {
//       setErrorMsg("Lo sentimos, debes tener al menos 15 años para registrarte en SobriWeb.");
//       return;
//     }
//     if (form.password.length < 6) {
//       setErrorMsg("La contraseña debe tener al menos 6 caracteres.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
//       await updateProfile(cred.user, { displayName: form.name });

//       const profile: UserProfile = {
//         uid: cred.user.uid,
//         displayName: form.name,
//         age: ageNumber,
//         email: form.email.toLowerCase(),
//         createdAt: serverTimestamp(),
//         profileCompleted: true
//       };
//       await setDoc(doc(db, "users", cred.user.uid), profile);
//       setAlertConfig({
//         type: 'success',
//         message: '¡Cuenta creada exitosamente!'
//       });
//       setShowAlert(true);
//       setTimeout(() => {
//         navigate("/dashboard");
//       }, 3000);
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         if (err.message.includes('auth/email-already-in-use')) {
//           setErrorMsg("Este correo electrónico ya está registrado. Por favor, inicia sesión.");
//         } else {
//           setErrorMsg(err.message);
//         }
//       } else {
//         setErrorMsg("Error al registrarse.");
//       }
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb]">
//       {showAlert && (
//         <Alert 
//           type={alertConfig.type} 
//           message={alertConfig.message}
//           onClose={() => setShowAlert(false)}
//         />
//       )}
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
//         <div className="flex flex-col items-center mb-8">
//           <div className="w-14 h-14 rounded-full bg-[#36b6e7] flex items-center justify-center mb-2">
//             <span className="text-2xl font-bold text-white">S</span>
//           </div>
//           <span className="text-2xl font-extrabold text-gray-800 tracking-tight">SobriWeb</span>
//         </div>
//         <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Crear cuenta</h2>
//         {errorMsg && (
//           <p className="mb-3 rounded-xl bg-red-50 text-red-700 px-4 py-2 text-sm text-center">{errorMsg}</p>
//         )}
//         <form onSubmit={handleSubmit} className="w-full space-y-4">
//           <div>
//             <input
//               name="name"
//               placeholder="Nombre"
//               value={form.name}
//               onChange={handleChange}
//               className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#36b6e7] bg-gray-50 text-gray-800"
//               required
//             />
//           </div>
//           <div>
//             <input
//               name="age"
//               type="number"
//               min={15}
//               placeholder="Edad"
//               value={form.age}
//               onChange={handleChange}
//               className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#36b6e7] bg-gray-50 text-gray-800"
//               required
//             />
//           </div>
//           <div>
//             <input
//               name="email"
//               type="email"
//               placeholder="Correo electrónico"
//               value={form.email}
//               onChange={handleChange}
//               className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#36b6e7] bg-gray-50 text-gray-800"
//               required
//             />
//           </div>
//           <div>
//             <input
//               name="password"
//               type="password"
//               placeholder="Contraseña"
//               value={form.password}
//               onChange={handleChange}
//               className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#36b6e7] bg-gray-50 text-gray-800"
//               required
//             />
//           </div>
//           <button
//             disabled={loading}
//             className="w-full rounded-lg bg-[#195b8c] text-white py-2 font-semibold text-lg shadow hover:bg-[#174e7a] transition disabled:opacity-60"
//           >
//             {loading ? "Creando..." : "Registrarme"}
//           </button>
//         </form>

//         <div className="mt-4 relative">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-gray-300"></div>
//           </div>
//           <div className="relative flex justify-center text-sm">
//             <span className="px-2 bg-white text-gray-500">O continúa con</span>
//           </div>
//         </div>

//         <button
//           onClick={async () => {
//             try {
//               setLoading(true);
//               setErrorMsg("");
//               const result = await signInWithPopup(auth, googleProvider);
              
//               // Verificar si el usuario ya existe
//               const userDoc = await getDoc(doc(db, "users", result.user.uid));
//               if (userDoc.exists()) {
//                 await signOut(auth);
//                 setErrorMsg("Esta cuenta de Google ya está registrada. Por favor, inicia sesión.");
//                 return;
//               }
              
//               // Crear perfil de usuario en Firestore
//               const profile = {
//                 uid: result.user.uid,
//                 displayName: result.user.displayName,
//                 email: result.user.email?.toLowerCase(),
//                 age: 0, // Valor por defecto
//                 createdAt: serverTimestamp(),
//                 profileCompleted: false
//               };
              
//               await setDoc(doc(db, "users", result.user.uid), profile);
//               setAlertConfig({
//                 type: 'success',
//                 message: '¡Registro con Google exitoso!'
//               });
//               setShowAlert(true);
//               setTimeout(() => {
//                 navigate("/dashboard");
//               }, 3000);
//             } catch (err) {
//               setErrorMsg(err instanceof Error ? err.message : "Error al registrarse con Google");
//               console.error(err);
//             } finally {
//               setLoading(false);
//             }
//           }}
//           className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#36b6e7] focus:ring-offset-2"
//         >
//           <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" loading="lazy" alt="google logo"/>
//           <span>Continuar con Google</span>
//         </button>

//         <div className="mt-6 text-center text-sm text-gray-600">
//           ¿Ya tienes cuenta?{' '}
//           <Link to="/login" className="text-green-600 hover:underline font-semibold">Inicia sesión</Link>
//         </div>
//       </div>
//     </div>
//   );
// }
