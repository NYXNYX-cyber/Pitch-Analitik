import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Syne', 'Figtree', ...defaultTheme.fontFamily.sans],
                mono: ['Space Mono', 'JetBrains Mono', ...defaultTheme.fontFamily.mono],
            },
            colors: {
                neo: {
                    sand: '#F4F0EA',
                    charcoal: '#111111',
                    orange: '#FF4F00',
                    crimson: '#E63946',
                    teal: '#2A9D8F',
                }
            },
            boxShadow: {
                neo: '4px 4px 0px 0px rgba(0, 0, 0, 1)',
                'neo-lg': '8px 8px 0px 0px rgba(0, 0, 0, 1)',
            }
        },
    },

    plugins: [forms],
};
