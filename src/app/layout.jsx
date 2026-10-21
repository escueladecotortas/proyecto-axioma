// Archivo: src/app/layout.jsx
import "./globals.css";

export const metadata = {
  title: "AXIOMA // OBSERVATORIO",
  description: "Plataforma de telemetría personal, bio-alineación y coherencia neurovisceral con experiencia cinemática IMAX.",
};

export const viewport = {
  themeColor: "#030305",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="antialiased selection:bg-[#00F2FE]/20 selection:text-[#00F2FE]">
        {children}
      </body>
    </html>
  );
}
