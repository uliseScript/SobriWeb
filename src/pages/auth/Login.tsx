// import { useState, useEffect } from "react";
// import type { ChangeEvent, FormEvent } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import logo from "../../assets/logo.png";

// import Alert from "../../components/Alert";

// import { auth, googleProvider, db } from "../../firebase";
// import { signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, signOut } from "firebase/auth";
// import { doc, getDoc, setDoc, serverTimestamp, getDocs, query, where, collection } from "firebase/firestore";

// async function getUserDocByEmail(email: string){
//   const q = query(collection(db, "users"), where("email", "==", email));
//   const snap = await getDocs(q);
//   if(snap.empty) return null;
//   const d = snap.docs[0];
//   return { id: d.id, ...d.data()} as { id: string; role?: string; uid?: string; email?: string};
  
// }

// type FormState = { email: string; password: string };

// export default function Login() {
//   const [form, setForm] = useState<FormState>({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [infoMsg, setInfoMsg] = useState("");
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertConfig, setAlertConfig] = useState<{type: 'success' | 'error', message: string}>({ type: 'success', message: '' });
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (errorMsg || infoMsg) {
//       setAlertConfig({
//         type: errorMsg ? 'error' : 'success',
//         message: errorMsg || infoMsg
//       });
//       setShowAlert(true);
//       const timer = setTimeout(() => setShowAlert(false), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [errorMsg, infoMsg]);

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
//     setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setErrorMsg("");
//     setInfoMsg("");
//     try {
//       setLoading(true);
//       // await signInWithEmailAndPassword(auth, form.email.trim().toLowerCase(), form.password);
//       // setInfoMsg("¡Inicio de sesión exitoso!");
//       // setTimeout(() => {
//       //   //navigate("/dashboard");
//       //   navigate("/home");
//       // }, 3000);
//       const cred = await signInWithEmailAndPassword(
//         auth,
//         form.email.trim().toLowerCase(),
//         form.password
//       );
//       const userDoc = await getUserDocByEmail(cred.user.email ?? "");
//       if(!userDoc){
//         setErrorMsg("Tu cuenta no esta registrada. Por favor regístrate primero.");
//         return;
//       }
//       const isAdmin = String(userDoc.uid) === "1";
//       setInfoMsg("!Inicio de sesión exitoso¡");
//       setTimeout(() => {
//         navigate(isAdmin ? "/admin" : "/home");
//       })
//     } catch (err: unknown) {
//       setErrorMsg(err instanceof Error ? err.message : "Error al iniciar sesión.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleForgot = async () => {
//     if (!form.email.trim()) {
//       return setErrorMsg("Ingresa tu correo para enviarte el enlace de recuperación.");
//     }
//     setErrorMsg("");
//     try {
//       await sendPasswordResetEmail(auth, form.email.trim().toLowerCase());
//       setInfoMsg("Te enviamos un correo para restablecer tu contraseña.");
//     } catch (err: unknown) {
//       setErrorMsg(err instanceof Error ? err.message : "No se pudo enviar el correo.");
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
//         {/* Logo + marca */}
//         <div className="flex flex-col items-center mb-6">
//           <img src={logo} alt="SobriWeb" className="w-16 h-16 object-contain mb-2" loading="lazy" />
//           <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
//             Sobri<span className="text-[#195b8c]">Web</span>
//           </h1>
//         </div>

//         {/* Título */}
//         <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Iniciar sesión</h2>

//         {/* Mensajes */}
//         {errorMsg && (
//           <p className="mb-3 rounded-xl bg-red-50 text-red-700 px-4 py-2 text-sm text-center">{errorMsg}</p>
//         )}
//         {infoMsg && (
//           <p className="mb-3 rounded-xl bg-green-50 text-green-700 px-4 py-2 text-sm text-center">{infoMsg}</p>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="w-full space-y-4">
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

//         <div className="text-sm">
//             <button
//               type="button"
//               onClick={handleForgot}
//               className="text-gray-500 hover:underline"
//             >
//               ¿Olvidaste tu contraseña?
//             </button>
//           </div>

//           <button
//             disabled={loading}
//             className="w-full rounded-lg bg-[#195b8c] text-white py-2 font-semibold text-lg shadow hover:bg-[#174e7a] transition disabled:opacity-60"
//           >
//             {loading ? "Entrando..." : "Iniciar sesión"}
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
//               // const result = await signInWithPopup(auth, googleProvider);
//               // const userDoc = await getDoc(doc(db, "users", result.user.uid));
              
//               // if (!userDoc.exists()) {
//               //   setErrorMsg("Esta cuenta de Google no está registrada. Por favor, regístrate primero.");
//               //   await signOut(auth);
//               //   return;
//               // }
              
//               // setInfoMsg("¡Inicio de sesión con Google exitoso!");
//               // setTimeout(() => {
//               //   //navigate("/dashboard");
//               //   navigate("/home");
//               // }, 3000);
//               const result = await signInWithPopup(auth, googleProvider);

//               const userDoc = await getUserDocByEmail(result.user.email ?? "");
//               if (!userDoc) {
//                 setErrorMsg("Esta cuenta de Google no está registrada. Por favor, regístrate primero.");
//                 await signOut(auth);
//                 return; 
//               }
//               const isAdmin = String(userDoc.uid) === "1";
//               setInfoMsg("¡Inicio de sesión con Google exitoso!");
//               setTimeout(() => {
//                 navigate(isAdmin ? "/admin" : "/home");
//               }, 3000);
//             } catch (err) {
//               setErrorMsg(err instanceof Error ? err.message : "Error al iniciar sesión con Google");
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
//           ¿No tienes una cuenta?{" "}
//           <Link to="/signup" className="text-green-600 hover:underline font-semibold">
//             Registrate
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

////////////////
// import { useState, useEffect } from "react";
// import type { ChangeEvent, FormEvent } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import logo from "../../assets/logo.png";

// import Alert from "../../components/Alert";

// import { auth, googleProvider, db } from "../../firebase";
// import {
//   signInWithEmailAndPassword,
//   sendPasswordResetEmail,
//   signInWithPopup,
//   signOut,
// } from "firebase/auth";
// import {
//   doc,
//   getDoc,
//   setDoc,
//   serverTimestamp,
//   getDocs,
//   query,
//   where,
//   collection,
// } from "firebase/firestore";

// async function getUserDocByEmail(email: string) {
//   const q = query(collection(db, "users"), where("email", "==", email));
//   const snap = await getDocs(q);
//   if (snap.empty) return null;
//   const d = snap.docs[0];
//   return { id: d.id, ...d.data() } as {
//     id: string;
//     role?: string;
//     uid?: string;
//     email?: string;
//   };
// }

// type FormState = { email: string; password: string };

// export default function Login() {
//   const [form, setForm] = useState<FormState>({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [infoMsg, setInfoMsg] = useState("");
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertConfig, setAlertConfig] = useState<{
//     type: "success" | "error";
//     message: string;
//   }>({ type: "success", message: "" });
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (errorMsg || infoMsg) {
//       setAlertConfig({
//         type: errorMsg ? "error" : "success",
//         message: errorMsg || infoMsg,
//       });
//       setShowAlert(true);
//       const timer = setTimeout(() => setShowAlert(false), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [errorMsg, infoMsg]);

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
//     setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setErrorMsg("");
//     setInfoMsg("");

//     try {
//       setLoading(true);

//       const cred = await signInWithEmailAndPassword(
//         auth,
//         form.email.trim().toLowerCase(),
//         form.password
//       );

//       const userDoc = await getUserDocByEmail(cred.user.email ?? "");
//       if (!userDoc) {
//         setErrorMsg("Tu cuenta no está registrada. Por favor, regístrate primero.");
//         return;
//       }

//       const isAdmin = String(userDoc.uid) === "1";
//       setInfoMsg("¡Inicio de sesión exitoso!");
//       setTimeout(() => {
//         navigate(isAdmin ? "/admin" : "/home");
//       }, 1200);
//     } catch (err: unknown) {
//       setErrorMsg(err instanceof Error ? err.message : "Error al iniciar sesión.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleForgot = async () => {
//     if (!form.email.trim()) {
//       return setErrorMsg("Ingresa tu correo para enviarte el enlace de recuperación.");
//     }
//     setErrorMsg("");
//     try {
//       await sendPasswordResetEmail(auth, form.email.trim().toLowerCase());
//       setInfoMsg("Te enviamos un correo para restablecer tu contraseña.");
//     } catch (err: unknown) {
//       setErrorMsg(err instanceof Error ? err.message : "No se pudo enviar el correo.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f7fafc] to-[#eef5fb] px-4">
//       {showAlert && (
//         <Alert
//           type={alertConfig.type}
//           message={alertConfig.message}
//           onClose={() => setShowAlert(false)}
//         />
//       )}

//       <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-3xl shadow-xl border border-gray-100 p-8">
//         {/* Header */}
//         <div className="flex flex-col items-center mb-6">
//           <img src={logo} alt="SobriWeb" className="w-16 h-16 object-contain mb-2" loading="lazy" />
//           <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
//             Sobri<span className="text-[#195b8c]">Web</span>
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">Bienvenido de vuelta</p>
//         </div>

//         {/* Título */}
//         <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Iniciar sesión</h2>

//         {/* Mensajes inline (opcionales) */}
//         {errorMsg && (
//           <p className="mb-3 rounded-xl bg-red-50 text-red-700 px-4 py-2 text-sm text-center border border-red-100">
//             {errorMsg}
//           </p>
//         )}
//         {infoMsg && (
//           <p className="mb-3 rounded-xl bg-green-50 text-green-700 px-4 py-2 text-sm text-center border border-green-100">
//             {infoMsg}
//           </p>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4" noValidate>
//           {/* Email */}
//           <div className="space-y-1.5">
//             <label htmlFor="email" className="text-sm font-medium text-gray-700">
//               Correo electrónico
//             </label>
//             <input
//               id="email"
//               name="email"
//               type="email"
//               placeholder="tucorreo@dominio.com"
//               value={form.email}
//               onChange={handleChange}
//               onInvalid={(e) => e.preventDefault()}
//               className="h-11 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 text-gray-900 placeholder-gray-400
//                          focus:outline-none focus:ring-4 focus:ring-[#36b6e7]/30 focus:border-[#36b6e7] transition"
//               required
//             />
//           </div>

//           {/* Password */}
//           <div className="space-y-1.5">
//             <label htmlFor="password" className="text-sm font-medium text-gray-700">
//               Contraseña
//             </label>
//             <input
//               id="password"
//               name="password"
//               type="password"
//               placeholder="••••••••"
//               value={form.password}
//               onChange={handleChange}
//               onInvalid={(e) => e.preventDefault()}
//               className="h-11 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 text-gray-900 placeholder-gray-400
//                          focus:outline-none focus:ring-4 focus:ring-[#36b6e7]/30 focus:border-[#36b6e7] transition"
//               required
//             />
//           </div>

//           <div className="text-sm">
//             <button
//               type="button"
//               onClick={handleForgot}
//               className="text-gray-600 hover:text-gray-800 hover:underline transition"
//             >
//               ¿Olvidaste tu contraseña?
//             </button>
//           </div>

//           <button
//             disabled={loading}
//             className="h-11 w-full rounded-xl bg-[#195b8c] text-white font-semibold shadow-md
//                        hover:bg-[#174e7a] active:bg-[#154666] transition disabled:opacity-60"
//           >
//             {loading ? "Entrando..." : "Iniciar sesión"}
//           </button>
//         </form>

//         {/* Divider */}
//         <div className="mt-6 flex items-center gap-3">
//           <div className="h-px flex-1 bg-gray-200" />
//           <span className="text-xs text-gray-500">o continúa con</span>
//           <div className="h-px flex-1 bg-gray-200" />
//         </div>

//         {/* Google */}
//         <button
//           onClick={async () => {
//             try {
//               setLoading(true);
//               setErrorMsg("");
//               const result = await signInWithPopup(auth, googleProvider);

//               const userDoc = await getUserDocByEmail(result.user.email?.toLowerCase() ?? "");
//               if (!userDoc) {
//                 setErrorMsg("Esta cuenta de Google no está registrada. Por favor, regístrate primero.");
//                 await signOut(auth);
//                 return;
//               }
//               const isAdmin = String(userDoc.uid) === "1";
//               setInfoMsg("¡Inicio de sesión con Google exitoso!");
//               setTimeout(() => {
//                 navigate(isAdmin ? "/admin" : "/home");
//               }, 1200);
//             } catch (err) {
//               setErrorMsg(
//                 err instanceof Error ? err.message : "Error al iniciar sesión con Google"
//               );
//               console.error(err);
//             } finally {
//               setLoading(false);
//             }
//           }}
//           className="mt-3 h-11 w-full rounded-xl border border-gray-300 bg-white text-gray-800
//                      flex items-center justify-center gap-2 hover:bg-gray-50 focus:outline-none
//                      focus:ring-4 focus:ring-[#36b6e7]/20 transition"
//         >
//           <img
//             src="https://www.svgrepo.com/show/475656/google-color.svg"
//             className="w-5 h-5"
//             loading="lazy"
//             alt="Google"
//           />
//           <span className="text-sm font-medium">Continuar con Google</span>
//         </button>

//         {/* Footer */}
//         <div className="mt-6 text-center text-sm text-gray-600">
//           ¿No tienes una cuenta?{" "}
//           <Link to="/signup" className="text-green-600 hover:underline font-semibold">
//             Regístrate
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

//////


import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

import Alert from "../../components/Alert";

import { auth, googleProvider, db } from "../../firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  collection,
} from "firebase/firestore";


async function getUserDocByEmail(email: string) {
  const q = query(collection(db, "users"), where("email", "==", email));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as {
    id: string;
    role?: string;
    uid?: string;
    email?: string;
  };
}

const getRouteForRole = (role?: string) => {
  switch ((role || "").toLowerCase()) {
    case "user aa":
      return "/home";
    case "familiar":
      return "/homeFamily";
    case "partner":
      return "/homePartner";
    default:
      return "/home"; // por si no tiene role
  }
};


type FormState = { email: string; password: string };

export default function Login() {
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    type: "success" | "error";
    message: string;
  }>({ type: "success", message: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (errorMsg || infoMsg) {
      setAlertConfig({
        type: errorMsg ? "error" : "success",
        message: errorMsg || infoMsg,
      });
      setShowAlert(true);
      const timer = setTimeout(() => setShowAlert(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg, infoMsg]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");

    try {
      setLoading(true);

      const cred = await signInWithEmailAndPassword(
        auth,
        form.email.trim().toLowerCase(),
        form.password
      );

      const userDoc = await getUserDocByEmail(cred.user.email ?? "");
      if (!userDoc) {
        setErrorMsg("Tu cuenta no está registrada. Por favor, regístrate primero.");
        return;
      }

      //  validación por la uid cuando sea 1
      const isAdmin = String(userDoc.uid) === "1";

      setInfoMsg("¡Inicio de sesión exitoso!");
      setTimeout(() => {
        if (isAdmin) {
          navigate("/admin");
        } else {
          // aqui vamos a redireccionar por role
          navigate(getRouteForRole(userDoc.role));
        }
      }, 1200);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Error al iniciar sesión.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!form.email.trim()) {
      return setErrorMsg("Ingresa tu correo para enviarte el enlace de recuperación.");
    }
    setErrorMsg("");
    try {
      await sendPasswordResetEmail(auth, form.email.trim().toLowerCase());
      setInfoMsg("Te enviamos un correo para restablecer tu contraseña.");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "No se pudo enviar el correo.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f7fafc] to-[#eef5fb] px-4">
      {showAlert && (
        <Alert
          type={alertConfig.type}
          message={alertConfig.message}
          onClose={() => setShowAlert(false)}
        />
      )}

      <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-3xl shadow-xl border border-gray-100 p-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="SobriWeb" className="w-16 h-16 object-contain mb-2" loading="lazy" />
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Sobri<span className="text-[#195b8c]">Web</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Bienvenido de vuelta</p>
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Iniciar sesión</h2>

        {/* Mensajes inline */}
        {errorMsg && (
          <p className="mb-3 rounded-xl bg-red-50 text-red-700 px-4 py-2 text-sm text-center border border-red-100">
            {errorMsg}
          </p>
        )}
        {infoMsg && (
          <p className="mb-3 rounded-xl bg-green-50 text-green-700 px-4 py-2 text-sm text-center border border-green-100">
            {infoMsg}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              onInvalid={(e) => e.preventDefault()}
              className="h-11 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 text-gray-900 placeholder-gray-400
                         focus:outline-none focus:ring-4 focus:ring-[#36b6e7]/30 focus:border-[#36b6e7] transition"
              required
            />
          </div>

          <div className="text-sm">
            <button
              type="button"
              onClick={handleForgot}
              className="text-gray-600 hover:text-gray-800 hover:underline transition"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button
            disabled={loading}
            className="h-11 w-full rounded-xl bg-[#195b8c] text-white font-semibold shadow-md
                       hover:bg-[#174e7a] active:bg-[#154666] transition disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Iniciar sesión"}
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

              const userDoc = await getUserDocByEmail(result.user.email?.toLowerCase() ?? "");
              if (!userDoc) {
                setErrorMsg("Esta cuenta de Google no está registrada. Por favor, regístrate primero.");
                await signOut(auth);
                return;
              }

              // validación por el uid
              const isAdmin = String(userDoc.uid) === "1";

              setInfoMsg("¡Inicio de sesión con Google exitoso!");
              setTimeout(() => {
                if (isAdmin) {
                  navigate("/admin");
                } else {
                  //  por rol
                  navigate(getRouteForRole(userDoc.role));
                }
              }, 1200);
            } catch (err) {
              setErrorMsg(
                err instanceof Error ? err.message : "Error al iniciar sesión con Google"
              );
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
          ¿No tienes una cuenta?{" "}
          <Link to="/signup" className="text-green-600 hover:underline font-semibold">
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}
