import { motion } from "framer-motion";

export default function Hamburger({ animatedOpen }) {
  const topV = { closed: { rotate: 0, translateY: 0 }, open: { rotate: 45, translateY: 8 } };
  const centerV = { closed: { opacity: 1 }, open: { opacity: 0 } };
  const bottomV = { closed: { rotate: 0, translateY: 0 }, open: { rotate: -45, translateY: -8 } };

  return (
    <motion.svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" strokeLinecap="round" className="absolute inset-0 m-auto">
      <motion.line x1="3" x2="21" y1="6" y2="6" variants={topV} initial="closed" animate={animatedOpen ? "open" : "closed"} />
      <motion.line x1="3" x2="21" y1="12" y2="12" variants={centerV} initial="closed" animate={animatedOpen ? "open" : "closed"} />
      <motion.line x1="3" x2="21" y1="18" y2="18" variants={bottomV} initial="closed" animate={animatedOpen ? "open" : "closed"} />
    </motion.svg>
  );
}
