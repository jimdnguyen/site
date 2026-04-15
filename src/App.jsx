import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Timeline from './components/Timeline';
import Skills from './components/Skills';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import DigitalTwin from './components/DigitalTwin';

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <div class="divider" />
        <About />
        <div class="divider" />
        <Timeline />
        <div class="divider" />
        <Skills />
        <div class="divider" />
        <Portfolio />
        <div class="divider" />
        <Contact />
      </main>
      <DigitalTwin />
    </>
  );
}
