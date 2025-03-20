// "use client";

// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
// } from "react";
// import { supabase } from "superbase";
// import { fetchProfile } from "@/utils/user";
// import { Company } from "@/types/company";

// // Define UserContextType interface
// interface CompanyContextType {
//   company: Company | null;
//   setCompany: (user: Company | null) => void;
//   companyLoading: boolean;
// }

// // Create the context
// const UserContext = createContext<CompanyContextType | undefined>(undefined);

// // Define the UserProvider component
// export const UserProvider = ({ children }: { children: ReactNode }) => {
//   const [company, setCompany] = useState<Company | null>(null);
//   const [companyLoading, setCompanyLoading] = useState<boolean>(true);
//   useEffect(() => {
//     // Function to fetch user session
//     const fetchCompany = async () => {
//       setCompanyLoading(true);
//       // fetch users company
//       setCompanyLoading(false);
//     };

//     fetchCompany();

//     // Listen for changes in auth state
//     const { data: listener } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         if (session?.user) {
//           fetchCompany();
//         } else {
//           if (typeof window !== "undefined") {
//             localStorage.removeItem("company");
//           }
//         }
//       }
//     );

//     // Type the listener to ensure the subscription property is used
//     const typedListener = listener as {
//       subscription: { unsubscribe: () => void };
//     };

//     return () => {
//       typedListener.subscription?.unsubscribe();
//     };
//   }, []);

//   return (
//     <UserContext.Provider value={{ company, setCompany, companyLoading }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// // Custom hook to access the UserContext
// export const useUser = () => {
//   const context = useContext(UserContext);

//   // Check if context is undefined, which means it's used outside of the provider
//   if (context === undefined) {
//     throw new Error("useUser must be used within a UserProvider");
//   }

//   return context;
// };
