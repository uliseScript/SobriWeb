
// import { useState, useEffect } from "react";
// import type { ChangeEvent, FormEvent } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Alert from "./components/Alert";
// import { auth, googleProvider, db } from "./firebase";
// import { signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, signOut } from "firebase/auth";
// import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

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
//       await signInWithEmailAndPassword(auth, form.email.trim().toLowerCase(), form.password);
//       setInfoMsg("¡Inicio de sesión exitoso!");
//       setTimeout(() => {
//         //navigate("/dashboard");
//         navigate("/home");
//       }, 3000);
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
//         <div className="flex flex-col items-center mb-8">
//           <div className="w-14 h-14 rounded-full bg-[#36b6e7] flex items-center justify-center mb-2">
//             <span className="text-2xl font-bold text-white">S</span>
//           </div>
//           <span className="text-2xl font-extrabold text-gray-800 tracking-tight">SobriWeb</span>
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
//               const result = await signInWithPopup(auth, googleProvider);
//               const userDoc = await getDoc(doc(db, "users", result.user.uid));
              
//               if (!userDoc.exists()) {
//                 setErrorMsg("Esta cuenta de Google no está registrada. Por favor, regístrate primero.");
//                 await signOut(auth);
//                 return;
//               }
              
//               setInfoMsg("¡Inicio de sesión con Google exitoso!");
//               setTimeout(() => {
//                 //navigate("/dashboard");
//                 navigate("/home");
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



import Navbar from "./components/Navbar";
function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* 🟦 Sección Hero */}
        <section
          id="comunidad"
          className="min-h-screen flex items-center justify-center text-center"
        >
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
              No estás solo en este camino
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Encuentra apoyo, comparte tu historia y recupera tu bienestar con
              nuestra comunidad.
            </p>
            <a
              href="register.html"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all"
            >
              Únete a la Comunidad Gratis
            </a>
          </div>
        </section>

        {/* 🗺️ Sección de Mapa / Cómo te apoyamos */}
        <section
          id="mapa"
          className="min-h-screen flex items-center justify-center bg-blue-50"
        >
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Cómo te Apoyamos
            </h2>

            <div className="grid gap-10 md:grid-cols-3">
              {/* Foro Comunitario */}
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all">
                <div className="flex justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    className="text-blue-600 w-12 h-12"
                  >
                    <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-2">Foro Comunitario</h3>
                <p className="text-gray-600">
                  Un espacio seguro y moderado para compartir experiencias,
                  resolver dudas y encontrar apoyo entre pares.
                </p>
              </div>

              {/* Mapa de Centros */}
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all">
                <div className="flex justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    className="text-green-600 w-12 h-12"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.157 2.176a1.5 1.5 0 0 0-1.147 0l-4.084 1.69A1.5 1.5 0 0 0 2 5.25v10.877a1.5 1.5 0 0 0 2.074 1.386l3.51-1.452 4.26 1.762a1.5 1.5 0 0 0 1.146 0l4.083-1.69A1.5 1.5 0 0 0 18 14.75V3.872a1.5 1.5 0 0 0-2.073-1.386l-3.51 1.452-4.26-1.762ZM7.58 5a.75.75 0 0 1 .75.75v6.5a.75.75 0 0 1-1.5 0v-6.5A.75.75 0 0 1 7.58 5Zm5.59 2.75a.75.75 0 0 0-1.5 0v6.5a.75.75 0 0 0 1.5 0v-6.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-2">
                  Mapa de Centros de Apoyo
                </h3>
                <p className="text-gray-600">
                  Localiza fácilmente centros de rehabilitación y grupos de
                  autoayuda cercanos, con información de contacto.
                </p>
              </div>

              {/* Chatbot */}
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all">
                <div className="flex justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    className="text-purple-600 w-12 h-12"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3c-4.31 0-8 3.033-8 7 0 2.024.978 3.825 2.499 5.085a3.478 3.478 0 0 1-.522 1.756.75.75 0 0 0 .584 1.143 5.976 5.976 0 0 0 3.936-1.108c.487.082.99.124 1.503.124 4.31 0 8-3.033 8-7s-3.69-7-8-7Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-2-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm5 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-2">
                  Chatbot de Autocuidado
                </h3>
                <p className="text-gray-600">
                  Asistente virtual con consejos, recursos verificados y
                  recomendaciones personalizadas para tu bienestar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 🟩 Nosotros */}
        <section
          id="nosotros"
          className="min-h-screen flex items-center justify-center "
        >


<div className="sm:flex items-center max-w-screen-xl">
    <div className="sm:w-1/2 p-10">
        <div className="image object-center text-center">
            <img src="/src/assets/logo.png"/> 
        </div>
    </div>
    <div className="sm:w-1/2 p-5">
        <div className="text">
            <span className="text-gray-500 border-b-2 border-indigo-600 uppercase">Sobre Nosotros</span>
            <h2 className="my-4 font-bold text-3xl  sm:text-4xl "> Conoce a <span className="text-indigo-600">SobriWeb</span>
            </h2>
            <p className="text-gray-700">
            SobriWeb es una comunidad dedicada a acompañar procesos de recuperación y bienestar.
              Combinamos apoyo entre pares, recursos verificados y herramientas digitales para que cada persona
              pueda avanzar con seguridad y confianza.
            </p>
        </div>
    </div>
</div>
          <div className="text-center px-6">
            <h2 className="text-3xl font-bold text-green-800 mb-4"></h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
            
            </p>
          </div>
        </section>

        {/* 🟪 Funciones Premium (SECCIÓN RESTAURADA) */}
        <section
          id="gallery"
          className="min-h-screen flex items-center justify-center "
        >
          <div className="container relative flex flex-col justify-between h-full max-w-6xl px-10 mx-auto xl:px-0 mt-5">
            <h2 className="mb-1 text-3xl font-semibold leading-tight text-gray-900">
              Lleva tu Progreso al Siguiente Nivel
            </h2>
            <p className="mb-12 text-lg text-gray-500">
              Nuestras funciones Premium te ofrecen herramientas avanzadas para un
              seguimiento detallado, acompañamiento continuo y una experiencia más
              personalizada en tu proceso de bienestar emocional.
            </p>

            <div className="w-full">
              {/* 1️⃣ Grupos de apoyo personalizados */}
              <div className="flex flex-col w-full mb-10 sm:flex-row">
                <div className="w-full mb-10 sm:mb-0 sm:w-1/2">
                  <div className="relative h-full ml-0 mr-0 sm:mr-10">
                    <span className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-indigo-500 rounded-lg"></span>
                    <div className="relative h-full p-5 bg-white border-2 border-indigo-500 rounded-lg">
                      <div className="flex items-center -mt-1">
                        <h3 className="my-2 ml-3 text-lg font-bold text-gray-800">
                          Grupos de apoyo personalizados
                        </h3>
                      </div>

                      <p className="mb-2 text-gray-600">
                        Accede a grupos temáticos guiados por moderadores especializados,
                        donde podrás compartir experiencias, recibir orientación y sentirte
                        acompañado en tu proceso.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2️⃣ Panel de progreso con gráficas */}
                <div className="w-full sm:w-1/2">
                  <div className="relative h-full ml-0 md:mr-10">
                    <span className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-purple-500 rounded-lg"></span>
                    <div className="relative h-full p-5 bg-white border-2 border-purple-500 rounded-lg">
                      <div className="flex items-center -mt-1">
                        <h3 className="my-2 ml-3 text-lg font-bold text-gray-800">
                          Panel de progreso con gráficas
                        </h3>
                      </div>

                      <p className="mb-2 text-gray-600">
                        Monitorea tu avance con gráficas interactivas que muestran tu evolución
                        emocional y tus logros a lo largo del tiempo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3️⃣ Exportación de reportes */}
              <div className="flex flex-col w-full mb-5 sm:flex-row">
                <div className="w-full mb-10 sm:mb-0 sm:w-1/2">
                  <div className="relative h-full ml-0 mr-0 sm:mr-10">
                    <span className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-blue-400 rounded-lg"></span>
                    <div className="relative h-full p-5 bg-white border-2 border-blue-400 rounded-lg">
                      <div className="flex items-center -mt-1">
                        <h3 className="my-2 ml-3 text-lg font-bold text-gray-800">
                          Exportación de reportes en PDF
                        </h3>
                      </div>

                      <p className="mb-2 text-gray-600">
                        Genera reportes detallados en formato PDF con tus métricas,
                        reflexiones y progreso para compartir con terapeutas o mentores.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4️⃣ Reconocimientos */}
                <div className="w-full mb-10 sm:mb-0 sm:w-1/2">
                  <div className="relative h-full ml-0 mr-0 sm:mr-10">
                    <span className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-yellow-400 rounded-lg"></span>
                    <div className="relative h-full p-5 bg-white border-2 border-yellow-400 rounded-lg">
                      <div className="flex items-center -mt-1">
                        <h3 className="my-2 ml-3 text-lg font-bold text-gray-800">
                          Sistema de reconocimientos por logros
                        </h3>
                      </div>

                      <p className="mb-2 text-gray-600">
                        Gana insignias y reconocimientos al alcanzar metas importantes.
                        Una forma divertida y motivadora de seguir avanzando hacia tu bienestar.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

    
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6 mt-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2025 SobriWeb. Todos los derechos reservados.</p>
          <div className="space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">
              Términos
            </a>
            <a href="#" className="hover:text-white">
              Privacidad
            </a>
            <a href="#" className="hover:text-white">
              Contacto
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
