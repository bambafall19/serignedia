import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function MagneticButton({ children, strength = 0.3, className = '', ...props }) {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 300, damping: 20 });
    const sy = useSpring(y, { stiffness: 300, damping: 20 });

    const handleMove = (e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        x.set(relX * strength);
        y.set(relY * strength);
    };

    const handleLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            style={{ x: sx, y: sy, display: 'inline-block' }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}
