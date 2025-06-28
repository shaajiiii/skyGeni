import { motion } from "framer-motion";
import type { ReactNode } from "react";

// made this component to add an animation effect to the application
const PageWrapper = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
  >
    {children}  
  </motion.div>
);

export default PageWrapper;
