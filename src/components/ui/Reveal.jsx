import { motion } from 'framer-motion';

/** Scroll reveal: a seção entra uma única vez ao aparecer na tela. */
export default function Reveal({ as = 'div', delay = 0, y = 24, className, children, ...props }) {
  const Component = motion[as] ?? motion.div;
  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}
