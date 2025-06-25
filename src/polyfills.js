// Polyfills for browser environment
import { Buffer } from 'buffer';

// Make Buffer available globally
if (typeof window !== 'undefined') {
    window.Buffer = Buffer;
    window.global = window.globalThis = window;
} 