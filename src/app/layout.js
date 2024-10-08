import Provider from "@/SessionProvider";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata= {
  title: "My Blog ",
  description: "Generated by create next app",
  icons: {
    icon: '/next.svg',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href={metadata.icons.icon} sizes="any" />

      </head>
      <Provider>
      <body>
        <Navbar/>
        {children}
        <ToastContainer 
          position="top-center"
          autoClose={2000} // Duration before auto-close (in milliseconds)
          hideProgressBar={false} // Show or hide progress bar
          closeOnClick 
          pauseOnHover
          draggable 
          theme="light" 
        />      
        <Footer/>
      </body>
      </Provider>
    </html>
  );
}
