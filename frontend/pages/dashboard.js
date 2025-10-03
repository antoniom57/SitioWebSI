// pages/dashboard.js
import Head from 'next/head';
import Router from 'next/router';
import { parseCookies } from 'nookies'; // Una librería útil para manejar cookies en el servidor

// --- COMPONENTE PRINCIPAL DE LA PÁGINA ---
export default function Dashboard({ user }) {
  
  const handleLogout = () => {
    // Es mejor manejar el logout en una función separada
    localStorage.removeItem('token');
    // Opcional: podrías usar una cookie en su lugar y borrarla también
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    Router.push('/');
  };

  // El estado de "Cargando..." ya no es necesario, los datos vienen del servidor
  // if (!user) { ... } ya no se necesita

  return (
    <>
      <Head>
        <title>Dashboard - {user.name || user.email.split('@')[0]}</title>
      </Head>
      <main className="dashboard-container">
        <div className="dashboard-header">
          {/* Usamos un nombre si existe, si no, el email como antes */}
          <h2>Bienvenido de nuevo, {user.name || user.email.split('@')[0]}!</h2>
          <p>Este es tu panel de control personal.</p>
        </div>
        
        <div className="dashboard-info">
          <h3>Tu Información</h3>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Rol:</strong> {user.role === 'admin' ? 'Administrador' : 'Miembro'}</p>
        </div>
        
        <button onClick={handleLogout} className="btn-primary btn-logout">
          Salir
        </button>
      </main>
    </>
  );
}

// --- FUNCIÓN DEL LADO DEL SERVIDOR ---
export async function getServerSideProps(context) {
  // 1. Obtener el token (idealmente de una cookie)
  // `nookies` facilita esto tanto en cliente como en servidor
  const cookies = parseCookies(context);
  const token = cookies.token || null; // O busca en localStorage si insistes, pero cookie es mejor

  // 2. Si no hay token, redirigir desde el servidor
  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false, // No es una redirección permanente
      },
    };
  }

  try {
    // 3. Obtener los datos del usuario desde el servidor
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      // Si el token es inválido o expiró, la API dará un error
      throw new Error('Token inválido');
    }

    const userData = await res.json();

    // 4. Pasar los datos del usuario como props a la página
    return {
      props: {
        user: userData,
      },
    };
  } catch (error) {
    // 5. Si algo falla (token inválido, API caída), redirigir a login
    console.error('Error al autenticar en el servidor:', error);
    // Es buena idea destruir la cookie si es inválida
    context.res.setHeader('Set-Cookie', 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;');

    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
}
