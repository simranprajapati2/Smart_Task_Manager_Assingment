import "./globals.css";

export const metadata = {
  title: "Assignment Task Manager",
  description: "Task Management Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}