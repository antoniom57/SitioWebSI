// pages/index.js
import Link from 'next/link';

export default function Home() {
    return (
        <main className="hero-container">
            <h1>GymForce</h1>
            <p>Tu viaje hacia la fuerza y la salud comienza aquí. Únete a nuestra comunidad.</p>
            
            <nav className="hero-nav">
                <Link href="/register">Registrarse</Link>
                <Link href="/login">Iniciar sesión</Link>
            </nav>
        </main>
    );
}