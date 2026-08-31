export const fadeInUp = {
    hidden: { opacity: 0, y: 36 },
    visible: (custom = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: custom * 0.1, ease: [0.22, 1, 0.36, 1] },
    }),
};

export const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
};

export const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
};
