import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { ArrowRight, Menu, X, ArrowUpRight, Github, Twitter, Linkedin, Mail, CheckCircle2 } from 'lucide-react';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Center, Text3D } from '@react-three/drei';
import * as THREE from 'three';

// --- Types ---
interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string;
}

const PROJECTS: Project[] = [
  {
    id: '01',
    title: 'Lumina OS',
    category: 'Product Design',
    year: '2024',
    image: 'https://picsum.photos/seed/lumina/1600/900?grayscale',
  },
  {
    id: '02',
    title: 'Aether Mobile',
    category: 'UI/UX Design',
    year: '2023',
    image: 'https://picsum.photos/seed/aether/1200/1600?grayscale',
  },
  {
    id: '03',
    title: 'Echo Audio',
    category: 'Creative Tech',
    year: '2024',
    image: 'https://picsum.photos/seed/echo/1600/1200?grayscale',
  },
  {
    id: '04',
    title: 'Zenith Hub',
    category: 'SaaS Platform',
    year: '2022',
    image: 'https://picsum.photos/seed/zenith/1600/900?grayscale',
  },
];

// --- Components ---

// --- 3D Components ---

const IntroSwarm = ({ count = 20000 }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useRef(new THREE.Object3D());
  const color = useRef(new THREE.Color());
  const target = useRef(new THREE.Vector3());

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Transition effect: start contracting after 2.5s
    const isShrinking = time > 2.5;
    const shrinkFactor = isShrinking ? Math.max(0, 1 - (time - 2.5) * 2) : 1;

    for (let i = 0; i < count; i++) {
       const baseR = 15 + Math.sin(time * 0.5 + i * 0.001) * 2;
       const r = baseR * shrinkFactor;
       const phi = Math.acos(-1 + (2 * i) / count);
       const theta = Math.sqrt(count * Math.PI) * phi + time * 0.2;
       
       target.current.set(
         r * Math.cos(theta) * Math.sin(phi),
         r * Math.sin(theta) * Math.sin(phi),
         r * Math.cos(phi)
       );

       dummy.current.position.set(target.current.x, target.current.y, target.current.z);
       
       const baseS = 0.05 + Math.sin(time * 2 + i) * 0.02;
       const s = baseS * (isShrinking ? shrinkFactor : 1);
       dummy.current.scale.set(s, s, s);
       dummy.current.updateMatrix();
       meshRef.current.setMatrixAt(i, dummy.current.matrix);
       
       const mix = Math.sin(time + i * 0.01) * 0.5 + 0.5;
       color.current.set(mix > 0.8 ? '#C8B89A' : '#EDEDE8');
       meshRef.current.setColorAt(i, color.current);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    
    meshRef.current.rotation.y = time * 0.1;
  });

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial transparent opacity={0.6 * (1)} />
    </instancedMesh>
  );
};

const Logo3D = () => {
  const meshRef = useRef<THREE.Group>(null);
  const { scrollYProgress } = useScroll();
  const rotationY = useTransform(scrollYProgress, [0, 0.5], [0, Math.PI * 2]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.5]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.25 + rotationY.get();
      const s = scale.get();
      meshRef.current.scale.set(s, s, s);
    }
  });

  return (
    <Center position={[0, -0.4, 0]}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text3D
          font="https://cdn.jsdelivr.net/npm/three@0.160.0/examples/fonts/gentilis_bold.typeface.json"
          size={1.6}
          height={0.1}
          curveSegments={32}
          bevelEnabled
          bevelThickness={0.18} 
          bevelSize={0.08}
          bevelOffset={0}
          bevelSegments={20}
          ref={meshRef}
        >
          Me
          <meshStandardMaterial
            color="#ffffff"
            metalness={1}
            roughness={0}
            envMapIntensity={3}
          />
        </Text3D>
      </Float>
    </Center>
  );
};

const BackgroundText = () => {
  const { scrollY } = useScroll();
  const xLeft = useTransform(scrollY, [0, 1000], [0, -500]);
  const xRight = useTransform(scrollY, [0, 1000], [0, 500]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-[0.03] select-none pointer-events-none overflow-hidden space-y-[-5vw]">
      <motion.h1 
        style={{ x: xLeft }}
        className="text-[25vw] font-display font-bold uppercase tracking-tighter whitespace-nowrap"
      >
        MATS ERDKAMP MATS ERDKAMP MATS ERDKAMP
      </motion.h1>
      <motion.h1 
        style={{ x: xRight }}
        className="text-[25vw] font-display font-bold uppercase tracking-tighter whitespace-nowrap"
      >
        DESIGN ENGINEER DESIGN ENGINEER DESIGN ENGINEER
      </motion.h1>
    </div>
  );
};

const Scene = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#C8B89A" />
        <Logo3D />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('button') ||
        target.closest('a') ||
        target.getAttribute('data-cursor') === 'hover'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-3 h-3 bg-[var(--color-accent)] rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      animate={{
        x: mousePos.x - 6,
        y: mousePos.y - 6,
        scale: isHovering ? 4 : 1,
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 250, mass: 0.5 }}
    />
  );
};

const NAV_GROUPS = [
  {
    id: 'profile',
    title: 'Mats Erdkamp',
    links: [
      { name: 'About', href: '#about' },
      { name: 'Career', href: '#career' },
      { name: 'Contact', href: '#contact' },
    ],
  },
  {
    id: 'design',
    title: 'Web Design',
    links: [
      { name: 'Projects', href: '#work' },
      { name: 'Designs', href: '#designs' },
    ],
  },
  {
    id: 'products',
    title: 'Products',
    links: [
      { name: 'Prototypes', href: '#products' },
      { name: 'Concepts', href: '#concepts' },
    ],
  },
  {
    id: 'writings',
    title: 'Writings',
    links: [
      { name: 'Blog', href: '#blog' },
      { name: 'Research', href: '#research' },
    ],
  },
];

const Navbar = () => {
  const [activeGroup, setActiveGroup] = useState('profile');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Simple scroll spy logic
      const sections = ['about', 'work', 'products', 'blog'];
      const current = sections.find(id => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 200 && rect.bottom >= 200;
        }
        return false;
      });

      if (current) {
        if (current === 'about') setActiveGroup('profile');
        if (current === 'work') setActiveGroup('design');
        if (current === 'products') setActiveGroup('products');
        if (current === 'blog') setActiveGroup('writings');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 font-sans ${
        scrolled ? 'bg-black/90 backdrop-blur-md py-6' : 'bg-transparent py-10'
      } border-b border-white/5`}
    >
      <div className="max-w-[var(--max-width)] mx-auto px-6 md:px-20">
        <div className="flex justify-between items-start">
          {NAV_GROUPS.map((group, i) => (
            <div key={group.id} className="flex group items-start gap-6 md:gap-10 lg:gap-16">
              {i > 0 && (
                <div className="mt-2">
                  <div className={`w-2 h-2 rounded-full border border-white/30 transition-colors duration-500 ${
                    activeGroup === group.id ? 'bg-white' : 'bg-transparent'
                  }`} />
                </div>
              )}
              
              <div className="flex flex-col gap-3">
                <h3 className={`text-[11px] md:text-[13px] uppercase tracking-[0.15em] font-bold transition-colors duration-500 ${
                  activeGroup === group.id ? 'text-white' : 'text-white/40'
                }`}>
                  {group.title}
                </h3>
                <div className="flex flex-col gap-1.5">
                  {group.links.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className="text-[10px] md:text-[12px] text-white/30 hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center px-6 md:px-20 max-w-[var(--max-width)] mx-auto overflow-hidden">
      <Scene />
      <BackgroundText />

      <div className="relative z-10 w-full flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute top-[-30vh] md:top-[-35vh] text-[11px] uppercase tracking-[0.5em] font-bold text-[var(--color-accent)]"
        >
          Product Designer / Creative Technologist
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-[50vh] max-w-xl text-center text-lg md:text-xl font-light leading-relaxed text-[var(--color-text-secondary)] mix-blend-difference"
        >
          Bridging the gap between conceptual design and engineering. Specializing in high-end digital interfaces and immersive user experiences.
        </motion.div>
      </div>

      {/* Footer Info in Hero - as seen in image */}
      <div className="absolute bottom-12 w-full max-w-[var(--max-width)] px-10 md:px-20 flex justify-between items-end text-[10px] uppercase tracking-widest font-bold text-[var(--color-text-secondary)]">
        <div className="flex flex-col gap-2">
          <span className="opacity-40">Availability</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Available Today</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <span className="opacity-40">Location</span>
          <span>Maastricht, The Netherlands</span>
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const isLarge = index === 0 || index === 3;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`group cursor-pointer ${isLarge ? 'md:col-span-12' : 'md:col-span-6'}`}
    >
      <div className="relative overflow-hidden aspect-[16/9] bg-[var(--color-surface)]">
        <motion.img
          src={project.image}
          alt={project.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] grayscale"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
        
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-md">
            <ArrowUpRight size={20} className="text-white" />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h3 className="text-3xl font-display font-medium tracking-tight uppercase group-hover:text-[var(--color-accent)] transition-colors">
            {project.title}
          </h3>
          <div className="flex items-center gap-3">
             <span className="text-[12px] uppercase tracking-widest text-[var(--color-text-secondary)]">
              {project.category}
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
            <span className="text-[12px] uppercase tracking-widest text-[var(--color-text-secondary)]">
              {project.year}
            </span>
          </div>
        </div>
        <span className="text-sm font-mono opacity-20">0{index + 1}</span>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  return (
    <section id="work" className="py-40 px-6 md:px-20 max-w-[var(--max-width)] mx-auto">
      <div className="flex items-center gap-12 mb-32 overflow-hidden">
        <motion.span 
          initial={{ x: -100 }}
          whileInView={{ x: 0 }}
          viewport={{ once: true }}
          className="text-[12px] uppercase tracking-[0.4em] font-bold text-[var(--color-text-secondary)] whitespace-nowrap"
        >
          Selected Works
        </motion.span>
        <motion.div 
           initial={{ scaleX: 0 }}
           whileInView={{ scaleX: 1 }}
           viewport={{ once: true }}
           className="w-full h-[1px] bg-[var(--color-border)] origin-left"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-40">
        {PROJECTS.map((project, idx) => (
          <ProjectCard key={project.id} project={project} index={idx} />
        ))}
      </div>
    </section>
  );
};

const PlaceholderSection = ({ id, title }: { id: string; title: string }) => (
  <section id={id} className="py-40 px-6 md:px-20 max-w-[var(--max-width)] mx-auto border-t border-white/5">
    <div className="mb-20">
      <span className="text-[12px] uppercase tracking-[0.4em] font-bold text-[var(--color-text-secondary)]">/ {title}</span>
    </div>
    <div className="h-[20vh] flex items-center justify-center text-white/10 text-4xl uppercase font-display italic">
      Section under construction
    </div>
  </section>
);

const About = () => {
  return (
    <section id="about" className="py-[var(--spacing-xl)] bg-[var(--color-surface)] overflow-hidden">
      <div className="max-w-[var(--max-width)] mx-auto px-6 md:px-20 py-20 md:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-[4/5]"
            >
              <img 
                src="https://picsum.photos/seed/mats/800/1000?grayscale" 
                alt="Portrait"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-sm grayscale contrast-125"
              />
              <div className="absolute inset-0 bg-[var(--color-accent)] opacity-5 mix-blend-overlay" />
            </motion.div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-8xl font-display mb-12 leading-[0.9] tracking-tight uppercase">
                Bridging <span className="italic text-[var(--color-accent)]">Logic</span> & <span className="italic">Emotion</span>.
              </h2>
              
              <div className="max-w-xl space-y-8">
                <p className="text-xl md:text-2xl text-[var(--color-text-secondary)] font-light leading-relaxed">
                  I am a Design Engineer driven by the intersection of form and function. My process is rooted in technical precision and aesthetic intuition.
                </p>
                <p className="text-lg text-[var(--color-text-secondary)]/60 font-light leading-relaxed">
                  Currently based in Maastricht, I help forward-thinking companies build digital products that leave a lasting impression.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20 pt-12 border-t border-[var(--color-border)]">
                <div className="space-y-6">
                  <div className="text-[11px] uppercase tracking-[0.3em] font-bold text-[var(--color-accent)]">Expertise</div>
                  <ul className="space-y-3 text-sm text-[var(--color-text-secondary)] font-medium uppercase tracking-wider">
                    <li>— Product Strategy</li>
                    <li>— UI/UX Design</li>
                    <li>— Interaction Systems</li>
                    <li>— Systems Design</li>
                  </ul>
                </div>
                <div className="space-y-6">
                  <div className="text-[11px] uppercase tracking-[0.3em] font-bold text-[var(--color-accent)]">Stack</div>
                  <ul className="space-y-3 text-sm text-[var(--color-text-secondary)] font-medium uppercase tracking-wider">
                    <li>— React / Next.js</li>
                    <li>— TypeScript</li>
                    <li>— Framer Motion</li>
                    <li>— WebGL / GLSL</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="contact" className="py-[var(--spacing-xl)] px-6 md:px-20 border-t border-[var(--color-border)]">
      <div className="max-w-[var(--max-width)] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-6xl md:text-9xl font-display uppercase tracking-tighter mb-8 italic">Let's Talk</h2>
          <motion.a
            href="mailto:hello@mats.zip"
            className="text-2xl md:text-4xl font-light underline underline-offset-8 decoration-[var(--color-border)] hover:decoration-[var(--color-accent)] transition-all flex items-center justify-center gap-4 group"
          >
            hello@mats.zip
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </motion.a>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-20 gap-10">
          <div className="text-[11px] uppercase tracking-widest font-bold text-[var(--color-text-secondary)]">
            © 2024 Mats Erdkamp / Maastricht, NL
          </div>
          
          <div className="flex gap-8">
            <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"><Twitter size={18} /></a>
            <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"><Github size={18} /></a>
            <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"><Linkedin size={18} /></a>
            <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"><Mail size={18} /></a>
          </div>

          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-[11px] uppercase tracking-[0.2em] font-bold text-[var(--color-accent)] hover:underline"
          >
            Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.2], [1, 0.6]), { stiffness: 100, damping: 30 });
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -100]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative selection:bg-[var(--color-accent)] selection:text-[var(--color-bg)]">
      <CustomCursor />
      
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-[var(--color-bg)] flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 z-0">
              <Canvas camera={{ position: [0, 0, 40], fov: 60 }}>
                <IntroSwarm />
              </Canvas>
            </div>
            
            <motion.div
               initial={{ opacity: 0, tracking: '1em' }}
               animate={{ opacity: 1, tracking: '0.5em' }}
               exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="relative z-10 text-[10px] uppercase font-bold text-[var(--color-accent)]"
            >
              Mats Erdkamp Portfolio
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Navbar />
            <main>
              <motion.div style={{ scale, opacity, y }}>
                <Hero />
              </motion.div>
              <div id="about_anchor">
                <About />
              </div>
              <Projects />
              <PlaceholderSection id="products" title="Products" />
              <PlaceholderSection id="blog" title="Writings" />
              <div id="career" className="hidden" />
              <div id="designs" className="hidden" />
              <div id="concepts" className="hidden" />
              <div id="research" className="hidden" />
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>
    </div>
  );
}
