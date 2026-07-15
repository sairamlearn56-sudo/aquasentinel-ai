/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			aqua: 'hsl(var(--aqua))',
  			teal: 'hsl(var(--teal))',
  			safe: 'hsl(var(--safe))',
  			warning: 'hsl(var(--warning))',
  			danger: 'hsl(var(--danger))',
  			purple: 'hsl(var(--purple))',
  			blue: 'hsl(var(--blue))',
  			coral: 'hsl(var(--coral))',
  			gold: 'hsl(var(--gold))',
  			orange: 'hsl(var(--orange))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},
  			cyan: { DEFAULT: 'hsl(var(--primary))', 50: 'hsl(var(--primary) / 0.05)', 100: 'hsl(var(--primary) / 0.1)', 200: 'hsl(var(--primary) / 0.2)', 300: 'hsl(var(--primary))', 400: 'hsl(var(--primary))', 500: 'hsl(var(--primary))', 600: 'hsl(var(--primary))', 700: 'hsl(var(--primary))', 800: 'hsl(var(--primary))', 900: 'hsl(var(--primary))' },
  			emerald: { DEFAULT: 'hsl(var(--safe))', 50: 'hsl(var(--safe) / 0.05)', 100: 'hsl(var(--safe) / 0.1)', 200: 'hsl(var(--safe) / 0.2)', 300: 'hsl(var(--safe))', 400: 'hsl(var(--safe))', 500: 'hsl(var(--safe))', 600: 'hsl(var(--safe))', 700: 'hsl(var(--safe))', 800: 'hsl(var(--safe))', 900: 'hsl(var(--safe))' },
  			amber: { DEFAULT: 'hsl(var(--warning))', 50: 'hsl(var(--warning) / 0.05)', 100: 'hsl(var(--warning) / 0.1)', 200: 'hsl(var(--warning) / 0.2)', 300: 'hsl(var(--warning))', 400: 'hsl(var(--warning))', 500: 'hsl(var(--warning))', 600: 'hsl(var(--warning))', 700: 'hsl(var(--warning))', 800: 'hsl(var(--warning))', 900: 'hsl(var(--warning))' },
  			rose: { DEFAULT: 'hsl(var(--danger))', 50: 'hsl(var(--danger) / 0.05)', 100: 'hsl(var(--danger) / 0.1)', 200: 'hsl(var(--danger) / 0.2)', 300: 'hsl(var(--danger))', 400: 'hsl(var(--danger))', 500: 'hsl(var(--danger))', 600: 'hsl(var(--danger))', 700: 'hsl(var(--danger))', 800: 'hsl(var(--danger))', 900: 'hsl(var(--danger))' },
  			red: { DEFAULT: 'hsl(var(--danger))', 50: 'hsl(var(--danger) / 0.05)', 100: 'hsl(var(--danger) / 0.1)', 200: 'hsl(var(--danger) / 0.2)', 300: 'hsl(var(--danger))', 400: 'hsl(var(--danger))', 500: 'hsl(var(--danger))', 600: 'hsl(var(--danger))', 700: 'hsl(var(--danger))', 800: 'hsl(var(--danger))', 900: 'hsl(var(--danger))' },
  			teal: { DEFAULT: 'hsl(var(--primary))', 50: 'hsl(var(--primary) / 0.05)', 100: 'hsl(var(--primary) / 0.1)', 200: 'hsl(var(--primary) / 0.2)', 300: 'hsl(var(--primary))', 400: 'hsl(var(--primary))', 500: 'hsl(var(--primary))', 600: 'hsl(var(--primary))', 700: 'hsl(var(--primary))', 800: 'hsl(var(--primary))', 900: 'hsl(var(--primary))' },
  			sky: { DEFAULT: 'hsl(var(--blue))', 50: 'hsl(var(--blue) / 0.05)', 100: 'hsl(var(--blue) / 0.1)', 200: 'hsl(var(--blue) / 0.2)', 300: 'hsl(var(--blue))', 400: 'hsl(var(--blue))', 500: 'hsl(var(--blue))', 600: 'hsl(var(--blue))', 700: 'hsl(var(--blue))', 800: 'hsl(var(--blue))', 900: 'hsl(var(--blue))' },
  			blue: { DEFAULT: 'hsl(var(--blue))', 50: 'hsl(var(--blue) / 0.05)', 100: 'hsl(var(--blue) / 0.1)', 200: 'hsl(var(--blue) / 0.2)', 300: 'hsl(var(--blue))', 400: 'hsl(var(--blue))', 500: 'hsl(var(--blue))', 600: 'hsl(var(--blue))', 700: 'hsl(var(--blue))', 800: 'hsl(var(--blue))', 900: 'hsl(var(--blue))' },
  			indigo: { DEFAULT: 'hsl(var(--primary))', 50: 'hsl(var(--primary) / 0.05)', 100: 'hsl(var(--primary) / 0.1)', 200: 'hsl(var(--primary) / 0.2)', 300: 'hsl(var(--primary))', 400: 'hsl(var(--primary))', 500: 'hsl(var(--primary))', 600: 'hsl(var(--primary))', 700: 'hsl(var(--primary))', 800: 'hsl(var(--primary))', 900: 'hsl(var(--primary))' },
  			violet: { DEFAULT: 'hsl(var(--purple))', 50: 'hsl(var(--purple) / 0.05)', 100: 'hsl(var(--purple) / 0.1)', 200: 'hsl(var(--purple) / 0.2)', 300: 'hsl(var(--purple))', 400: 'hsl(var(--purple))', 500: 'hsl(var(--purple))', 600: 'hsl(var(--purple))', 700: 'hsl(var(--purple))', 800: 'hsl(var(--purple))', 900: 'hsl(var(--purple))' },
  			purple: { DEFAULT: 'hsl(var(--purple))', 50: 'hsl(var(--purple) / 0.05)', 100: 'hsl(var(--purple) / 0.1)', 200: 'hsl(var(--purple) / 0.2)', 300: 'hsl(var(--purple))', 400: 'hsl(var(--purple))', 500: 'hsl(var(--purple))', 600: 'hsl(var(--purple))', 700: 'hsl(var(--purple))', 800: 'hsl(var(--purple))', 900: 'hsl(var(--purple))' },
  			pink: { DEFAULT: 'hsl(var(--purple))', 50: 'hsl(var(--purple) / 0.05)', 100: 'hsl(var(--purple) / 0.1)', 200: 'hsl(var(--purple) / 0.2)', 300: 'hsl(var(--purple))', 400: 'hsl(var(--purple))', 500: 'hsl(var(--purple))', 600: 'hsl(var(--purple))', 700: 'hsl(var(--purple))', 800: 'hsl(var(--purple))', 900: 'hsl(var(--purple))' },
  			yellow: { DEFAULT: 'hsl(var(--warning))', 50: 'hsl(var(--warning) / 0.05)', 100: 'hsl(var(--warning) / 0.1)', 200: 'hsl(var(--warning) / 0.2)', 300: 'hsl(var(--warning))', 400: 'hsl(var(--warning))', 500: 'hsl(var(--warning))', 600: 'hsl(var(--warning))', 700: 'hsl(var(--warning))', 800: 'hsl(var(--warning))', 900: 'hsl(var(--warning))' },
  			orange: { DEFAULT: 'hsl(var(--orange))', 50: 'hsl(var(--orange) / 0.05)', 100: 'hsl(var(--orange) / 0.1)', 200: 'hsl(var(--orange) / 0.2)', 300: 'hsl(var(--orange))', 400: 'hsl(var(--orange))', 500: 'hsl(var(--orange))', 600: 'hsl(var(--orange))', 700: 'hsl(var(--orange))', 800: 'hsl(var(--orange))', 900: 'hsl(var(--orange))' }
  		},
  		fontFamily: {
  			heading: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  			body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  			display: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  			mono: ['var(--font-mono)']
  		},
  		fontWeight: {
  			normal: '400',
  			medium: '500',
  			semibold: '600',
  			bold: '600',
  			extrabold: '600',
  			black: '600'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: { height: '0' },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: '0' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
