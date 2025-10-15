

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./index.html",
//     "./src/**/*.{ts,tsx,js,jsx}",
//   ],
//   theme: {
//     extend: {
//       // Paleta y tokens para el look azul/ligero del mockup
//       colors: {
//         brand: {
//           50:  "#F6FAFF", // fondo superior
//           100: "#EDF2FE",
//           200: "#DBEAFE",
//           300: "#BFDBFE",
//           600: "#2563EB", // primario
//           700: "#1D4ED8",
//         },
//       },
//       boxShadow: {
//         card: "0 8px 24px rgba(37,99,235,.12)",
//         cardHover: "0 12px 32px rgba(37,99,235,.18)",
//       },
//       borderRadius: {
//         xl2: "1rem",
//       },
//       // Tu animación existente + fadeInUp base
//       keyframes: {
//         'fade-in': {
//           '0%':   { opacity: '0', transform: 'translateY(-10px)' },
//           '100%': { opacity: '1', transform: 'translateY(0)' },
//         },
//         'fade-in-up': {
//           '0%':   { opacity: '0', transform: 'translateY(8px)' },
//           '100%': { opacity: '1', transform: 'translateY(0)' },
//         },
//       },
//       animation: {
//         'fade-in': 'fade-in 0.5s ease-out',
//         'fade-in-up': 'fade-in-up .38s ease-out',
//       },
//       container: {
//         center: true,
//         padding: { DEFAULT: "1rem", lg: "1.5rem" },
//       },
//     },
//   },
//   plugins: [],
// };
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      // Paleta y tokens para el look azul/ligero del mockup
      colors: {
        brand: {
          50:  "#F6FAFF", // fondo superior
          100: "#EDF2FE",
          200: "#DBEAFE",
          300: "#BFDBFE",
          600: "#2563EB", // primario
          700: "#1D4ED8",
        },
      },
      boxShadow: {
        card: "0 8px 24px rgba(37,99,235,.12)",
        cardHover: "0 12px 32px rgba(37,99,235,.18)",
      },
      borderRadius: {
        xl2: "1rem",
      },
      // Animaciones existentes + borde degradado animado
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // NUEVO: mueve el fondo para el borde degradado
        gradientMove: {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-up': 'fade-in-up .38s ease-out',
        // NUEVO: animación para el borde degradado
        'gradient-move': 'gradientMove 6s ease infinite',
      },
      container: {
        center: true,
        padding: { DEFAULT: "1rem", lg: "1.5rem" },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // porque usas `prose` en el modal
  ],
};

