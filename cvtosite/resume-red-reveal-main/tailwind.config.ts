
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
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
				brand: {
					red: "#FF4D61",
					dark: "#121418", // Darker background
					darker: "#0a0b0e", // Even darker shade
					black: "#000000e6",
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-soft': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' },
				},
				'reveal': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				'glow': {
					'0%, 100%': { 
						'box-shadow': '0 0 5px rgba(255, 77, 97, 0.6), 0 0 10px rgba(255, 77, 97, 0.4)' 
					},
					'50%': { 
						'box-shadow': '0 0 15px rgba(255, 77, 97, 0.8), 0 0 20px rgba(255, 77, 97, 0.6)' 
					}
				},
				'hover-glow': {
					'0%': { 
						'box-shadow': '0 0 5px rgba(255, 77, 97, 0.1), 0 0 10px rgba(255, 77, 97, 0)' 
					},
					'100%': { 
						'box-shadow': '0 0 10px rgba(255, 77, 97, 0.3), 0 0 15px rgba(255, 77, 97, 0.2)' 
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-8px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
				'reveal': 'reveal 0.5s ease-out forwards',
				'glow': 'glow 2s ease-in-out infinite',
				'hover-glow': 'hover-glow 0.3s ease-out forwards',
				'float': 'float 3s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'tech-pattern': 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
			},
			boxShadow: {
				'card-hover': '0 4px 15px -3px rgba(0,0,0,0.1), 0 2px 6px -2px rgba(0,0,0,0.05)',
				'card-hover-dark': '0 4px 15px -3px rgba(255,255,255,0.1), 0 2px 6px -2px rgba(255,255,255,0.05)',
				'glow-red': '0 0 10px rgba(255, 77, 97, 0.3), 0 0 15px rgba(255, 77, 97, 0.2)',
				'glow-red-dark': '0 0 10px rgba(255, 77, 97, 0.4), 0 0 15px rgba(255, 77, 97, 0.3)',
				'glow-red-light': '0 0 8px rgba(255, 77, 97, 0.2), 0 0 12px rgba(255, 77, 97, 0.1)',
			},
			transitionProperty: {
				'shadow': 'box-shadow, transform',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
