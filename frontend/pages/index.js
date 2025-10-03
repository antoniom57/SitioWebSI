// pages/index.js (Versión Mejorada en un solo archivo)
import Link from 'next/link';
import Head from 'next/head'; // 1. Importar Head para SEO
import { useState, useEffect } from 'react';

// 2. Centralizar los datos (Data-Driven Approach)
const featuresData = [
  { icon: '💪', title: 'Equipamiento de primera', description: 'Máquinas y pesas de la más alta calidad para tu entrenamiento.' },
  { icon: '👨‍🏫', title: 'Entrenadores expertos', description: 'Profesionales certificados que te guiarán en tu proceso.' },
  { icon: '🔄', title: 'Rutinas personalizadas', description: 'Planes de entrenamiento adaptados a tus objetivos específicos.' },
];

const classesData = [
  { imageClass: 'cardio', title: 'Cardio Intenso', description: 'Mejora tu resistencia y quema calorías.', schedule: 'Lunes, Miércoles, Viernes - 18:00h' },
  { imageClass: 'strength', title: 'Fuerza y Potencia', description: 'Desarrolla músculo y aumenta tu fuerza.', schedule: 'Martes, Jueves - 19:00h' },
  { imageClass: 'yoga', title: 'Yoga Fitness', description: 'Combina flexibilidad, equilibrio y fuerza.', schedule: 'Sábados - 10:00h' },
];

const testimonialsData = [
  { quote: '"En solo 3 meses he transformado mi cuerpo y ganado confianza. Los entrenadores son increíbles."', author: 'Carlos M.', since: 'Miembro desde 2022' },
  { quote: '"El ambiente motivador y las instalaciones de primera hacen que siempre quiera volver."', author: 'Ana L.', since: 'Miembro desde 2023' },
];

// 3. Crear mini-componentes para elementos repetidos
const FeatureCard = ({ icon, title, description }) => (
  <div className="feature-card">
    <div className="feature-icon" aria-label={`Ícono de ${title}`}>{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const ClassCard = ({ imageClass, title, description, schedule }) => (
  <div className="class-card">
    <div className={`class-image ${imageClass}`}></div>
    <div className="class-content">
      <h3>{title}</h3>
      <p>{description}</p>
      <span>{schedule}</span>
    </div>
  </div>
);

// --- COMPONENTE PRINCIPAL DE LA PÁGINA ---
export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="home-container">
      {/* 1. Head para SEO y Metadatos */}
      <Head>
        <title>GymForce - Página Principal</title>
        <meta name="description" content="Tu viaje hacia la fuerza y la salud comienza aquí. Únete a nuestra comunidad de GymForce." />
      </Head>

      {/* Hero Section */}
      <section className="hero-container">
        <div className={`hero-content ${isVisible ? 'fade-in' : ''}`}>
          <h1>GymForce</h1>
          <p>Tu viaje hacia la fuerza y la salud comienza aquí. Únete a nuestra comunidad.</p>
          <nav className="hero-nav">
            <Link href="/register" className="cta-button primary">Registrarse</Link>
            <Link href="/login" className="cta-button secondary">Iniciar sesión</Link>
          </nav>
        </div>
      </section>

      {/* Features Section - Ahora usando .map() */}
      <section className="features-section">
        <div className="container">
          <h2>¿Por qué elegirnos?</h2>
          <div className="features-grid">
            {featuresData.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Classes Section - Ahora usando .map() */}
      <section className="classes-section">
        <div className="container">
          <h2>Nuestras Clases</h2>
          <div className="classes-grid">
            {classesData.map((classItem) => (
              <ClassCard key={classItem.title} {...classItem} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Ahora usando .map() */}
      <section className="testimonials-section">
        <div className="container">
          <h2>Lo que dicen nuestros miembros</h2>
          <div className="testimonials-grid">
            {testimonialsData.map(({ quote, author, since }) => (
              <div key={author} className="testimonial-card">
                <p>{quote}</p>
                <div className="testimonial-author">
                  <strong>{author}</strong>
                  <span>{since}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>¿Listo para transformar tu vida?</h2>
          <p>Únete hoy mismo y obtén tu primera semana gratis</p>
          <Link href="/register" className="cta-button large">Comenzar ahora</Link>
        </div>
      </section>

      {/* Footer - Con mejoras semánticas */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>GymForce</h3>
              <p>Tu camino hacia una vida más fuerte y saludable.</p>
            </div>
            <div className="footer-section">
              <h4>Horario</h4>
              <p>Lunes a Viernes: 5:00 - 23:00</p>
              <p>Sábados y Domingos: 7:00 - 21:00</p>
            </div>
            <div className="footer-section">
              <h4>Contacto</h4>
              {/* 4. Usar etiquetas semánticas como <address> */}
              <address>
                <p>info@gymforce.com</p>
                <p>+34 912 345 678</p>
              </address>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} GymForce. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
