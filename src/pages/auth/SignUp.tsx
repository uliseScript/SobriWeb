// import { useState, useEffect } from "react";
// import type { ChangeEvent, FormEvent } from "react";
// import { auth, db, googleProvider } from "../../firebase";
// import Alert from "../../components/Alert";
// import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, signOut } from "firebase/auth";
// import { doc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";
// import { Link, useNavigate } from "react-router-dom";
// import type { UserProfile } from "../../type";

// type FormState = { name: string; age: string; email: string; password: string };

// export default function SignUp() {
//   const [form, setForm] = useState<FormState>({ name: "", age: "", email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState<string>("");
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertConfig, setAlertConfig] = useState<{type: 'success' | 'error', message: string}>({ type: 'success', message: '' });
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (errorMsg) {
//       setAlertConfig({ type: 'error', message: errorMsg });
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
//       setAlertConfig({ type: 'success', message: '¡Cuenta creada exitosamente!' });
//       setShowAlert(true);
//       setTimeout(() => {
//         //navigate("/dashboard");
//         navigate("/home");
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

//         {/* Desactiva validación nativa */}
//         <form onSubmit={handleSubmit} className="w-full space-y-4" noValidate>
//           <div>
//             <input
//               name="name"
//               placeholder="Nombre"
//               value={form.name}
//               onChange={handleChange}
//               className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#36b6e7] bg-gray-50 text-gray-800"
//               required
//               onInvalid={(e) => e.preventDefault()}
//             />
//           </div>
//           <div>
//             <input
//               name="age"
//               type="number"
//               min={15} // se mantiene por accesibilidad, pero no dispara tooltip
//               placeholder="Edad"
//               value={form.age}
//               onChange={handleChange}
//               onInvalid={(e) => e.preventDefault()} // evita tooltip del browser
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
//               onInvalid={(e) => e.preventDefault()}
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
//               onInvalid={(e) => e.preventDefault()}
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
//                 //navigate("/dashboard");
//                 navigate("/home");
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




////////////////////////////////////




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




// signup.tsx (versión final combinada)

// import { useState, useEffect } from "react";
// import type { ChangeEvent, FormEvent } from "react";
// import { auth, db, googleProvider } from "../../firebase";
// import Alert from "../../components/Alert";
// import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, signOut } from "firebase/auth";
// import { doc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";
// import { Link, useNavigate } from "react-router-dom";
// import type { UserProfile } from "../../type";
// import logo from "../../assets/logo.png";

// type FormState = { name: string; age: string; email: string; password: string };

// export default function SignUp() {
//   const [form, setForm] = useState<FormState>({ name: "", age: "", email: "", password: "" });

//   // NUEVO: rol y nombre del centro (para partners)
//   const [role, setRole] = useState("usuario");
//   const [centerName, setCenterName] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState<string>("");
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertConfig, setAlertConfig] = useState<{type: 'success' | 'error', message: string}>({ type: 'success', message: '' });
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (errorMsg) {
//       setAlertConfig({ type: 'error', message: errorMsg });
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
//     if (role === "partner" && !centerName.trim()) {
//       setErrorMsg("El nombre del centro es requerido.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
//       await updateProfile(cred.user, { displayName: form.name });

//       // perfil con nuevos campos
//       const profile /* : UserProfile & extras */ = {
//         uid: cred.user.uid,
//         displayName: form.name,
//         age: ageNumber,
//         email: form.email.toLowerCase(),
//         role,
//         partnerInfo: role === "partner" ? { centerName } : null,
//         approved: role === "partner" ? false : true,
//         createdAt: serverTimestamp(),
//         profileCompleted: true
//       };
//       await setDoc(doc(db, "users", cred.user.uid), profile);
//       setAlertConfig({ type: 'success', message: '¡Cuenta creada exitosamente!' });
//       setShowAlert(true);
//       setTimeout(() => {
//         navigate("/home");
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
        
//         {/* 1. NUEVO LOGO Y TÍTULO */}
//         <div className="flex flex-col items-center mb-6 space-y-2">
//           <div className="relative w-20 h-20 flex items-center justify-center">
//             <img
//               src={logo}
//               alt="SobriWeb Logo"
//               className="w-full h-full object-contain"
//               loading="lazy"
//             />
//           </div>
//           <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
//             Sobri<span className="text-[#195b8c]">Web</span>
//           </h1>
//         </div>

//         <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Crear cuenta</h2>
//         {errorMsg && (
//           <p className="mb-3 rounded-xl bg-red-50 text-red-700 px-4 py-2 text-sm text-center">{errorMsg}</p>
//         )}

//         <form onSubmit={handleSubmit} className="w-full space-y-4" noValidate>
//           <div>
//             <input
//               name="name"
//               placeholder="Nombre"
//               value={form.name}
//               onChange={handleChange}
//               className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#36b6e7] bg-gray-50 text-gray-800"
//               required
//               onInvalid={(e) => e.preventDefault()}
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
//               onInvalid={(e) => e.preventDefault()}
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
//               onInvalid={(e) => e.preventDefault()}
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
//               onInvalid={(e) => e.preventDefault()}
//               className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#36b6e7] bg-gray-50 text-gray-800"
//               required
//             />
//           </div>

//           {/* NUEVO: selector de rol */}
//           <div>
//             <select
//               onChange={(e) => setRole(e.target.value)}
//               value={role}
//               className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#36b6e7] bg-gray-50 text-gray-800"
//             >
//               <option value="usuario">Persona en recuperación</option>
//               <option value="familiar">Familiar que busca ayuda</option>
//               <option value="partner">Partner (centro A.A.)</option>
//             </select>
//           </div>

//           {/* NUEVO: campo condicional si es partner */}
//           {role === "partner" && (
//             <div>
//               <input
//                 type="text"
//                 placeholder="Nombre del centro"
//                 onChange={(e) => setCenterName(e.target.value)}
//                 value={centerName}
//                 onInvalid={(e) => e.preventDefault()}
//                 className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#36b6e7] bg-gray-50 text-gray-800"
//                 required
//               />
//             </div>
//           )}

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
              
//               const profile = {
//                 uid: result.user.uid,
//                 displayName: result.user.displayName,
//                 email: result.user.email?.toLowerCase(),
//                 age: 0,
//                 role: "usuario",
//                 partnerInfo: null,
//                 approved: true,
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
//                 navigate("/home");
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




import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { auth, db, googleProvider } from "../../firebase";
import Alert from "../../components/Alert";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, signOut } from "firebase/auth";
import { doc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

type FormState = { name: string; age: string; email: string; password: string };

// mapeamos el valor del select al valor que se guarda en firestore
const mapRoleToDb = (r: string) => (r === "usuario" ? "user AA" : r);

// devuelvemos la ruta segun corresponda el rol que se selecciono
const getRouteForRole = (r: string) => {
  const dbRole = mapRoleToDb(r);
  switch (dbRole) {
    case "user AA":
      return "/home";
    case "familiar":
      return "/homeFamily";
    case "partner":
      return "/homePartner";
    default:
      return "/home";
  }
};

export default function SignUp() {
  const [form, setForm] = useState<FormState>({ name: "", age: "", email: "", password: "" });

  // el rol comienza en vacio para poder seleccionar
  const [role, setRole] = useState<string>("");
  const [centerName, setCenterName] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{ type: "success" | "error"; message: string }>({
    type: "success",
    message: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (errorMsg) {
      setAlertConfig({ type: "error", message: errorMsg });
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
    if (!role) {
      setErrorMsg("Selecciona tu tipo de usuario.");
      return;
    }
    if (role === "partner" && !centerName.trim()) {
      setErrorMsg("El nombre del centro es requerido.");
      return;
    }

    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(cred.user, { displayName: form.name });

      // rol guardamos en firestore
      const roleForDb = mapRoleToDb(role);

      const profile = {
        uid: cred.user.uid,
        displayName: form.name,
        age: ageNumber,
        email: form.email.toLowerCase(),
        role: roleForDb, 
        partnerInfo: role === "partner" ? { centerName } : null,
        approved: role === "partner" ? false : true,
        createdAt: serverTimestamp(),
        profileCompleted: true,
      };
      await setDoc(doc(db, "users", cred.user.uid), profile);

      setAlertConfig({ type: "success", message: "¡Cuenta creada exitosamente!" });
      setShowAlert(true);

      // redirigimos segun el tipo de rol
      const route = getRouteForRole(role);
      setTimeout(() => navigate(route), 1000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes("auth/email-already-in-use")) {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f7fafc] to-[#eef5fb] px-4">
      {showAlert && (
        <Alert type={alertConfig.type} message={alertConfig.message} onClose={() => setShowAlert(false)} />
      )}

      <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-3xl shadow-xl border border-gray-100 p-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="SobriWeb" className="w-16 h-16 object-contain mb-2" loading="lazy" />
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Sobri<span className="text-[#195b8c]">Web</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Crea tu cuenta para comenzar</p>
        </div>

        {errorMsg && (
          <p className="mb-3 rounded-xl bg-red-50 text-red-700 px-4 py-2 text-sm text-center border border-red-100">
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Nombre */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              id="name"
              name="name"
              placeholder="Tu nombre completo"
              value={form.name}
              onChange={handleChange}
              onInvalid={(e) => e.preventDefault()}
              className="h-11 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 text-gray-900 placeholder-gray-400
                         focus:outline-none focus:ring-4 focus:ring-[#36b6e7]/30 focus:border-[#36b6e7] transition"
              required
            />
          </div>

          {/* Edad */}
          <div className="space-y-1.5">
            <label htmlFor="age" className="text-sm font-medium text-gray-700">
              Edad (mínimo 15 años)
            </label>
            <input
              id="age"
              name="age"
              type="number"
              min={15}
              placeholder="Ej. 23"
              value={form.age}
              onChange={handleChange}
              onInvalid={(e) => e.preventDefault()}
              className="h-11 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 text-gray-900 placeholder-gray-400
                         focus:outline-none focus:ring-4 focus:ring-[#36b6e7]/30 focus:border-[#36b6e7] transition"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="tucorreo@dominio.com"
              value={form.email}
              onChange={handleChange}
              onInvalid={(e) => e.preventDefault()}
              className="h-11 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 text-gray-900 placeholder-gray-400
                         focus:outline-none focus:ring-4 focus:ring-[#36b6e7]/30 focus:border-[#36b6e7] transition"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChange={handleChange}
              onInvalid={(e) => e.preventDefault()}
              className="h-11 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 text-gray-900 placeholder-gray-400
                         focus:outline-none focus:ring-4 focus:ring-[#36b6e7]/30 focus:border-[#36b6e7] transition"
              required
            />
          </div>

          {/* Select rol */}
          <div className="space-y-1.5">
            <label htmlFor="role" className="text-sm font-medium text-gray-700">
              Tipo de usuario
            </label>
            <div className="relative">
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-gray-300 bg-gray-50 px-4 pr-11
                           text-gray-900 placeholder-gray-400
                           focus:outline-none focus:ring-4 focus:ring-[#36b6e7]/30 focus:border-[#36b6e7] transition"
                required
              >
                <option value="" disabled>
                  Selecciona tu tipo de usuario
                </option>
                <option value="usuario">Persona en recuperación</option>
                <option value="familiar">Familiar que busca ayuda</option>
                <option value="partner">Partner (centros AA)</option>
              </select>

              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9.75L12 13.5l3.75-3.75" />
                </svg>
              </span>
            </div>
            <p className="text-xs text-gray-500">Esto nos ayuda a personalizar y mejorar tu experiencia.</p>
          </div>

          {/* Campo condicional si es partner */}
          {role === "partner" && (
            <div className="space-y-1.5">
              <label htmlFor="centerName" className="text-sm font-medium text-gray-700">
                Nombre del centro
              </label>
              <input
                id="centerName"
                type="text"
                placeholder="Ej. Grupo A.A. Esperanza"
                onChange={(e) => setCenterName(e.target.value)}
                value={centerName}
                onInvalid={(e) => e.preventDefault()}
                className="h-11 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 text-gray-900 placeholder-gray-400
                           focus:outline-none focus:ring-4 focus:ring-[#36b6e7]/30 focus:border-[#36b6e7] transition"
                required
              />
            </div>
          )}

          {/* Botón submit */}
          <button
            disabled={loading}
            className="h-11 w-full rounded-xl bg-[#195b8c] text-white font-semibold shadow-md
                       hover:bg-[#174e7a] active:bg-[#154666] transition disabled:opacity-60"
          >
            {loading ? "Creando..." : "Registrarme"}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-500">o continúa con</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Google */}
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

              // Para Google, por defecto guardamos "user AA" como rol y navegamos a /home
              //ESTO SE DEBE CAMBIAR PARA QUE SI SOLICITE EL TIPO DE ROL Y NO PONERLO POR DEFECTO
              const profile = {
                uid: result.user.uid,
                displayName: result.user.displayName,
                email: result.user.email?.toLowerCase(),
                age: 0,
                role: "user AA",
                partnerInfo: null,
                approved: true,
                createdAt: serverTimestamp(),
                profileCompleted: false,
              };

              await setDoc(doc(db, "users", result.user.uid), profile);
              setAlertConfig({ type: "success", message: "¡Registro con Google exitoso!" });
              setShowAlert(true);
              setTimeout(() => navigate("/home"), 800);
            } catch (err) {
              setErrorMsg(err instanceof Error ? err.message : "Error al registrarse con Google");
              console.error(err);
            } finally {
              setLoading(false);
            }
          }}
          className="mt-3 h-11 w-full rounded-xl border border-gray-300 bg-white text-gray-800
                     flex items-center justify-center gap-2 hover:bg-gray-50 focus:outline-none
                     focus:ring-4 focus:ring-[#36b6e7]/20 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
            loading="lazy"
            alt="Google"
          />
          <span className="text-sm font-medium">Continuar con Google</span>
        </button>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-green-600 hover:underline font-semibold">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}


