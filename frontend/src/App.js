import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import {
  FilePlus2,
  MessagesSquare,
  UsersRound,
  Handshake,
  Clock,
  ShieldCheck,
  Menu,
  X,
  MapPin,
  Fuel,
  Calendar,
  Gauge,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// WhatsApp helpers
const WHATSAPP_NUMBER_INTL = "33619186822"; // provided number in international format without +
const waLink = (text) => `https://wa.me/${WHATSAPP_NUMBER_INTL}?text=${encodeURIComponent(text)}`;

// API helper
const api = axios.create({ baseURL: API });

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-800 bg-[#0A0A0A]/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              alt="IDCARS"
              className="h-8 w-8 rounded-sm glow-accent"
              src="https://customer-assets.emergentagent.com/job_site-amelioration/artifacts/4b4n017e_logo.png"
            />
            <span className="font-extrabold tracking-tight" style={{ color: "#C6FF00" }}>ID CARS</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <NavLink to="/presentation">Présentation</NavLink>
            <NavLink to="/deposer">Déposer</NavLink>
            <NavLink to="/annonces">Annonces</NavLink>
            <NavLink to="/import">Import</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <a
              href={waLink("Bonjour IDCARS, je souhaite déposer ma voiture à la vente.")}
              target="_blank"
              rel="noreferrer"
              className="btn-cta rounded-md bg-[#C6FF00] px-4 py-2 text-sm font-semibold text-black shadow hover:shadow-[#C6FF00]/30"
            >
              Déposer via WhatsApp
            </a>
          </nav>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded hover:bg-neutral-900" aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {open && (
          <div className="md:hidden pt-2 pb-3 space-y-1">
            <MobileLink to="/presentation" onClick={() => setOpen(false)}>Présentation</MobileLink>
            <MobileLink to="/deposer" onClick={() => setOpen(false)}>Déposer</MobileLink>
            <MobileLink to="/annonces" onClick={() => setOpen(false)}>Annonces</MobileLink>
            <MobileLink to="/import" onClick={() => setOpen(false)}>Import</MobileLink>
            <MobileLink to="/contact" onClick={() => setOpen(false)}>Contact</MobileLink>
            <a
              href={waLink("Bonjour IDCARS, je souhaite déposer ma voiture à la vente.")}
              target="_blank" rel="noreferrer"
              className="block rounded-md bg-[#C6FF00] px-4 py-2 text-center font-semibold text-black"
            >Déposer via WhatsApp</a>
          </div>
        )}
      </div>
    </header>
  );
}

function NavLink({ to, children }) {
  return (
    <Link to={to} className="text-sm text-neutral-200 hover:text-white transition">
      {children}
    </Link>
  );
}
function MobileLink({ to, onClick, children }) {
  return (
    <Link to={to} onClick={onClick} className="block px-3 py-2 text-neutral-200 hover:bg-neutral-900 rounded">
      {children}
    </Link>
  );
}

function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-[#0A0A0A]">
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-6 md:grid-cols-3 text-sm">
        <div>
          <div className="flex items-center gap-3">
            <img alt="IDCARS" className="h-8 w-8 rounded-sm" src="https://customer-assets.emergentagent.com/job_site-amelioration/artifacts/4b4n017e_logo.png"/>
            <span className="font-bold" style={{ color: "#C6FF00" }}>ID CARS</span>
          </div>
          <p className="mt-3 text-neutral-400">On s'occupe de la vente, vous encaissez le prix.</p>
        </div>
        <div>
          <div className="font-semibold mb-2">Contact</div>
          <div className="space-y-2 text-neutral-300">
            <a className="flex items-center gap-2 hover:text-white" href="mailto:Ydrix07@icloud.com"><Mail size={16}/> Ydrix07@icloud.com</a>
            <a className="flex items-center gap-2 hover:text-white" href={waLink("Bonjour IDCARS, j'ai une question.")} target="_blank" rel="noreferrer"><Phone size={16}/> WhatsApp</a>
          </div>
        </div>
        <div>
          <div className="font-semibold mb-2">Liens</div>
          <div className="space-y-2 text-neutral-300">
            <Link className="block hover:text-white" to="/presentation">Présentation</Link>
            <Link className="block hover:text-white" to="/deposer">Déposer</Link>
            <Link className="block hover:text-white" to="/annonces">Annonces</Link>
            <Link className="block hover:text-white" to="/import">Import</Link>
            <Link className="block hover:text-white" to="/contact">Contact</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-800 py-4 text-center text-neutral-500 text-xs">© {new Date().getFullYear()} IDCARS — Tous droits réservés.</div>
    </footer>
  );
}

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="card-hover rounded-xl bg-[#121212] p-5 border border-neutral-800">
      <div className="flex items-center gap-3">
        <div className="badge-pill bg-[#C6FF00] text-black p-2"><Icon size={18}/></div>
        <div className="font-semibold">{title}</div>
      </div>
      <p className="mt-2 text-sm text-neutral-400">{desc}</p>
    </div>
  );
}

function CarCard({ item, hideImage = false }) {
  const message = `Bonjour IDCARS, je suis intéressé par ${item.brand} ${item.model} ${item.year} (${item.km} km) à ${item.price}€. Est-ce toujours disponible ?`;
  const image = item.imageUrl || "https://images.unsplash.com/photo-1542367597-8849ebf1470a?q=80&w=1200&auto=format&fit=crop";
  return (
    <div className="card-hover overflow-hidden rounded-xl bg-[#121212] border border-neutral-800">
      {!hideImage && (
        <img src={image} alt={`${item.brand} ${item.model}`} className="h-44 w-full object-cover"/>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="font-semibold">{item.brand} {item.model}</div>
          <div className="text-[#C6FF00] font-bold">{item.price.toLocaleString()}€</div>
        </div>
        <div className="mt-1 flex items-center gap-4 text-xs text-neutral-400">
          <span className="flex items-center gap-1"><Calendar size={14}/> {item.year}</span>
          <span className="flex items-center gap-1"><Gauge size={14}/> {item.km.toLocaleString()} km</span>
          <span className="flex items-center gap-1"><Fuel size={14}/> {item.engine}</span>
          <span className="flex items-center gap-1"><MapPin size={14}/> {item.city}</span>
        </div>
        <a href={waLink(message)} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#C6FF00] px-3 py-2 text-black font-semibold">
          Contacter via WhatsApp <ArrowRight size={16}/>
        </a>
      </div>
    </div>
  );
}

function Home() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/listings", { params: { limit: 6 } });
        setItems(data || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const heroStyle = useMemo(() => ({
    backgroundImage: `radial-gradient(rgba(10,10,10,0.72), rgba(10,10,10,0.88)), url('/hero-cars.svg')`,
    backgroundSize: 'cover, 420px 210px',
    backgroundPosition: 'center, top left',
    backgroundRepeat: 'no-repeat, repeat',
  }), []);

  return (
    <main>
      {/* Hero avec motif dessins de voitures très modéré */}
      <section className="bg-[#0A0A0A]" style={heroStyle}>
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 badge-pill bg-neutral-900/70 px-3 py-1 text-xs text-neutral-200 border border-neutral-800">
                100% Gratuit • Service clé en main
              </div>
              <h1 className="mt-4 text-3xl md:text-5xl font-extrabold text-white leading-tight">
                Nous vendons votre voiture à votre place, gratuitement
              </h1>
              <p className="mt-3 text-neutral-200 max-w-xl">
                De la création d'annonce à la négociation et la sélection d'acheteurs: on s'occupe de tout. Vous gagnez du temps, et encaissez le prix.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a href={waLink("Bonjour IDCARS, je souhaite déposer ma voiture à la vente.")} target="_blank" rel="noreferrer" className="btn-cta rounded-md bg-[#C6FF00] px-5 py-3 text-black font-semibold shadow glow-accent text-center">Déposer via WhatsApp</a>
                <Link to="/annonces" className="rounded-md border border-neutral-800/70 bg-black/30 px-5 py-3 text-white text-center">Voir les annonces</Link>
              </div>
            </div>
            <div className="hidden md:block" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#0A0A0A]">
        <div className="mx-auto max-w-7xl px-4 py-12 grid gap-4 md:grid-cols-3">
          <Feature icon={FilePlus2} title="Création d'annonce" desc="Photos et description optimisées, publication rapide." />
          <Feature icon={MessagesSquare} title="Gestion des contacts" desc="Nous filtrons et répondons aux acheteurs." />
          <Feature icon={UsersRound} title="Sélection des acheteurs" desc="Rendez-vous qualifiés, sérieux uniquement." />
          <Feature icon={Handshake} title="Négociation" desc="Nous maximisons votre prix de vente." />
          <Feature icon={Clock} title="Gain de temps" desc="Vous vous concentrez sur l'essentiel." />
          <Feature icon={ShieldCheck} title="Transparence" desc="Zéro frais cachés, 100% gratuit." />
        </div>
      </section>

      {/* Dernières annonces (avec photos et prix) */}
      <section className="bg-[#0A0A0A] border-t border-neutral-900">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Dernières annonces</h2>
            <Link to="/annonces" className="text-sm text-neutral-300 hover:text-white">Tout voir</Link>
          </div>
          {items.length === 0 ? (
            <div className="mt-6 rounded-xl border border-neutral-800 bg-[#121212] p-6 text-neutral-300">
              Aucune annonce pour le moment. Déposez la vôtre via WhatsApp !
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((it) => (<CarCard key={it.id} item={it} />))}
            </div>
          )}
        </div>
      </section>

      {/* Contact rapide */}
      <section className="bg-[#0A0A0A] border-t border-neutral-900">
        <div className="mx-auto max-w-7xl px-4 py-12 grid gap-4 md:grid-cols-2">
          <a href="mailto:Ydrix07@icloud.com" className="card-hover flex items-center gap-3 rounded-xl border border-neutral-800 bg-[#121212] p-5">
            <Mail/> <div><div className="font-semibold">Email</div><div className="text-neutral-400 text-sm">Ydrix07@icloud.com</div></div>
          </a>
          <a href={waLink("Bonjour IDCARS, j'ai une question.")} target="_blank" rel="noreferrer" className="card-hover flex items-center gap-3 rounded-xl border border-neutral-800 bg-[#121212] p-5">
            <Phone/> <div><div className="font-semibold">WhatsApp</div><div className="text-neutral-400 text-sm">+33 6 19 18 68 22</div></div>
          </a>
        </div>
      </section>
    </main>
  );
}

function Presentation() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-extrabold">Qui sommes-nous ?</h1>
      <p className="mt-4 text-neutral-300">
        IDCARS vend votre voiture pour vous, gratuitement. De A à Z: annonce, contacts, rendez-vous, négociation. Transparence et confiance sont au cœur du service — vous gagnez du temps, nous maximisons le prix.
      </p>
      <div className="mt-6 rounded-xl border border-neutral-800 bg-[#121212] p-6">
        <p className="text-lg font-semibold">Slogan</p>
        <p className="text-neutral-300">« On s'occupe de la vente, vous encaissez le prix. »</p>
      </div>
    </div>
  );
}

function Deposer() {
  const [form, setForm] = useState({ brand: "", model: "", year: "", km: "", engine: "", price: "", city: "" });
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const msg = `Dépôt de voiture:\nMarque: ${form.brand}\nModèle: ${form.model}\nAnnée: ${form.year}\nKilométrage: ${form.km}\nMotorisation: ${form.engine}\nPrix souhaité: ${form.price}€\nVille: ${form.city}`;
    window.open(waLink(msg), "_blank");
  };
  const input = "w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#C6FF00]";
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-extrabold">Déposer une annonce</h1>
      <p className="mt-2 text-neutral-300">Remplissez le formulaire ci-dessous. Nous recevons votre message directement sur WhatsApp.</p>
      <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
        {[
          { name: "brand", label: "Marque" },
          { name: "model", label: "Modèle" },
          { name: "year", label: "Année" },
          { name: "km", label: "Kilométrage" },
          { name: "engine", label: "Motorisation" },
          { name: "price", label: "Prix" },
          { name: "city", label: "Ville" },
        ].map((f) => (
          <div key={f.name} className="col-span-1">
            <label className="mb-1 block text-sm text-neutral-300">{f.label}</label>
            <input name={f.name} value={form[f.name]} onChange={onChange} className={input} required />
          </div>
        ))}
        <div className="md:col-span-2">
          <button className="btn-cta w-full rounded-md bg-[#C6FF00] px-4 py-3 font-semibold text-black">Envoyer via WhatsApp</button>
        </div>
      </form>
    </div>
  );
}

function Annonces() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  useEffect(() => { fetch(); }, []);
  const fetch = async () => {
    try {
      const { data } = await api.get("/listings", { params: { q } });
      setItems(data || []);
    } catch(err) { console.error(err); }
  };
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-extrabold">Annonces</h1>
        <div className="flex gap-2">
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Recherche (marque, modèle, ville)" className="w-72 rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm"/>
          <button onClick={fetch} className="rounded-md bg-[#C6FF00] px-4 py-2 text-black font-semibold">Rechercher</button>
        </div>
      </div>
      {items.length===0 ? (
        <div className="mt-6 rounded-xl border border-neutral-800 bg-[#121212] p-6 text-neutral-300">Aucune annonce trouvée.</div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it)=> (<CarCard key={it.id} item={it}/>))}
        </div>
      )}
    </div>
  );
}

function ImportPage() {
  const [form, setForm] = useState({ brandModel: "", yearMin: "", engine: "", trim: "", budgetMax: "", contact: "" });
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/import-requests", {
        brandModel: form.brandModel,
        yearMin: form.yearMin ? Number(form.yearMin) : undefined,
        engine: form.engine || undefined,
        trim: form.trim || undefined,
        budgetMax: form.budgetMax ? Number(form.budgetMax) : undefined,
        contactName: form.contact,
      });
    } catch (err) { console.error(err); }
    const subject = encodeURIComponent("Recherche import véhicule");
    const body = encodeURIComponent(`Bonjour,\nJe cherche: ${form.brandModel}\nAnnée min: ${form.yearMin}\nMotorisation: ${form.engine}\nFinition: ${form.trim}\nBudget max: ${form.budgetMax}€\nContact: ${form.contact}`);
    window.location.href = `mailto:Ydrix07@icloud.com?subject=${subject}&body=${body}`;
  };
  const input = "w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#C6FF00]";
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-extrabold">Import de véhicule</h1>
      <p className="mt-2 text-neutral-300">Dites-nous ce que vous cherchez, nous trouvons et négocions pour vous.</p>
      <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm text-neutral-300">Marque/Modèle</label>
          <input name="brandModel" value={form.brandModel} onChange={onChange} className={input} required/>
        </div>
        <div>
          <label className="mb-1 block text-sm text-neutral-300">Année min</label>
          <input name="yearMin" value={form.yearMin} onChange={onChange} className={input} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-neutral-300">Motorisation</label>
          <input name="engine" value={form.engine} onChange={onChange} className={input} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-neutral-300">Finition</label>
          <input name="trim" value={form.trim} onChange={onChange} className={input} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-neutral-300">Budget max (€)</label>
          <input name="budgetMax" value={form.budgetMax} onChange={onChange} className={input} />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm text-neutral-300">Contact</label>
          <input name="contact" value={form.contact} onChange={onChange} className={input} required/>
        </div>
        <div className="md:col-span-2">
          <button className="btn-cta w-full rounded-md bg-[#C6FF00] px-4 py-3 font-semibold text-black">Envoyer la demande</button>
        </div>
      </form>
    </div>
  );
}

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/contact", form);
      toast.success("Message envoyé ! Nous revenons vers vous rapidement.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("Erreur d'envoi");
    }
  };
  const input = "w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#C6FF00]";
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-extrabold">Contact</h1>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <a href="mailto:Ydrix07@icloud.com" className="card-hover flex items-center gap-3 rounded-xl border border-neutral-800 bg-[#121212] p-5"><Mail/> Email: Ydrix07@icloud.com</a>
        <a href={waLink("Bonjour IDCARS, j'ai une question.")} target="_blank" rel="noreferrer" className="card-hover flex items-center gap-3 rounded-xl border border-neutral-800 bg-[#121212] p-5"><Phone/> WhatsApp</a>
      </div>
      <form onSubmit={submit} className="mt-6 grid gap-4">
        <div>
          <label className="mb-1 block text-sm text-neutral-300">Nom</label>
          <input name="name" value={form.name} onChange={onChange} className={input} required/>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-neutral-300">Email</label>
            <input name="email" value={form.email} onChange={onChange} className={input}/>
          </div>
          <div>
            <label className="mb-1 block text-sm text-neutral-300">Téléphone</label>
            <input name="phone" value={form.phone} onChange={onChange} className={input}/>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm text-neutral-300">Message</label>
          <textarea name="message" value={form.message} onChange={onChange} className={`${input} h-28`} required/>
        </div>
        <button className="btn-cta rounded-md bg-[#C6FF00] px-4 py-3 font-semibold text-black">Envoyer</button>
      </form>
    </div>
  );
}

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-white">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
      <Toaster richColors position="top-center"/>
    </div>
  );
}

function App() {
  useEffect(() => {
    (async () => {
      try { await api.get("/"); } catch(e) { console.warn("Backend indisponible", e?.message); }
    })();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home/></Layout>} />
        <Route path="/presentation" element={<Layout><Presentation/></Layout>} />
        <Route path="/deposer" element={<Layout><Deposer/></Layout>} />
        <Route path="/annonces" element={<Layout><Annonces/></Layout>} />
        <Route path="/import" element={<Layout><ImportPage/></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage/></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;