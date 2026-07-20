"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Mic,
  Shield,
  Users,
  BookOpen,
  ArrowRight,
  Play,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Send,
  Building2,
  GraduationCap,
  HeartHandshake,
  Landmark,
  Briefcase,
  Quote,
  Star,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import { useTheme } from "@/app/contexts/ThemeContext";
import { toast } from "sonner";

interface LandingProps {
  onStart: () => void;
}

const navLinks = [
  { label: "About", href: "#about" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Partners", href: "#partners" },
  { label: "Contact", href: "#contact" },
];

const stats = [
  { value: "1,248", label: "Contributions" },
  { value: "312", label: "Active speakers" },
  { value: "4", label: "Partner institutions" },
  { value: "87%", label: "Quality score" },
];

const steps = [
  { icon: Mic, title: "Record", desc: "Contributors record natural Koloqua speech from prepared prompts or free conversation." },
  { icon: Users, title: "Review", desc: "Independent reviewers validate transcription, translation, and audio quality before approval." },
  { icon: BookOpen, title: "Publish", desc: "Approved data is released under governance-approved licenses for research and AI training." },
];

const principles = [
  { icon: Shield, title: "Informed consent", desc: "Revocable and clearly explained before any data is used." },
  { icon: Users, title: "Community ownership", desc: "Liberians shape how the language is represented." },
  { icon: CheckCircle, title: "Verified quality", desc: "Two independent reviews for every training item." },
  { icon: BookOpen, title: "Open governance", desc: "Dataset licenses approved by project governance." },
];

const partners = [
  { name: "University of Liberia", role: "Research partner", icon: GraduationCap },
  { name: "Starz University", role: "Community partner", icon: Building2 },
  { name: "Ministry of Education", role: "Policy partner", icon: Landmark },
  { name: "TeachForLiberia", role: "Education partner", icon: HeartHandshake },
  { name: "Koloqua Foundation", role: "Funding partner", icon: Briefcase },
  { name: "BWI", role: "Pilot partner", icon: Building2 },
];

const testimonials = [
  { name: "Dr. Amara Jalloh", role: "Linguist, University of Liberia", text: "Koloqua AI is the first platform that treats our language as infrastructure, not folklore. The governance model gives the community real ownership." },
  { name: "James Kollie", role: "Reviewer, Monrovia", text: "I validate clips every evening after work. Knowing my ear for Koloqua helps build something the whole country can use is deeply motivating." },
  { name: "Sarah Weah", role: "Contributor, BWI", text: "The payment PIN, the consent page, and the transparent ledger made me trust the system before I even recorded my first sentence." },
];

const easing: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easing } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: easing } },
};

const letterReveal = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Landing({ onStart }: LandingProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [contact, setContact] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState("");

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      setActiveSection(href);
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", href);
      setTimeout(() => setActiveSection(""), 1000);
    }
  };

  const sendMessage = () => {
    if (!contact.name || !contact.email || !contact.message) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }
    setSending(true);
    setTimeout(() => {
      toast.success("Message sent. We will reply within 48 hours.");
      setContact({ name: "", email: "", subject: "", message: "" });
      setSending(false);
    }, 1200);
  };

  const renderAnimatedHeading = (text: string) => (
    <motion.span
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerContainer}
      aria-label={text}
    >
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block mr-[0.25em]">
          <motion.span variants={letterReveal} className="inline-block">
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );

  const ThemeIcon = resolvedTheme === "dark" ? Sun : Moon;

  return (
    <div className="min-h-screen bg-cream overflow-x-hidden transition-colors duration-300">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/80 backdrop-blur-xl border-b border-cream-dark/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-terracotta to-terracotta-light flex items-center justify-center text-white font-bold shadow-soft">
              K
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-charcoal leading-tight">Koloqua AI</span>
              <span className="text-[10px] text-charcoal-light uppercase tracking-wider hidden sm:block">Liberian Language Lab</span>
            </div>
          </motion.button>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                whileHover={{ y: -1 }}
                transition={{ duration: 0.2 }}
                className="relative text-sm font-medium text-charcoal-light hover:text-terracotta transition-colors group"
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-terracotta transition-all duration-300 ${activeSection === link.href ? "w-full" : "w-0 group-hover:w-full"}`} />
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="w-9 h-9 rounded-xl bg-cream-100 border border-cream-dark flex items-center justify-center text-charcoal hover:text-terracotta hover:border-terracotta/30 transition-colors"
            >
              <motion.div
                key={resolvedTheme}
                initial={{ rotate: -30, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 30, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <ThemeIcon className="w-4 h-4" />
              </motion.div>
            </motion.button>

            <Button size="sm" onClick={onStart}>Get started</Button>
          </div>
        </div>
      </nav>

      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-terracotta/5 to-cream pointer-events-none" />
        <motion.div
          animate={{ y: [0, -16, 0], x: [0, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 -right-24 w-[420px] h-[420px] bg-terracotta/8 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-12 -left-24 w-[360px] h-[360px] bg-gold-200/40 rounded-full blur-3xl pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="show"
              variants={staggerContainer}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream-100 border border-cream-dark text-terracotta text-sm font-medium mb-6 shadow-soft"
              >
                <Image src="/assets/liberia-flag.png" alt="Liberia flag" width={20} height={12} className="rounded-sm" />
                <span className="w-2 h-2 rounded-full bg-forest-600 animate-pulse" />
                Pilot program now live in Liberia
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal leading-[1.1] mb-6 font-display">
                {renderAnimatedHeading("Preserving Liberia's voice for the age of AI")}
              </h1>

              <motion.p
                variants={fadeUp}
                className="text-lg sm:text-xl text-charcoal-light leading-relaxed mb-8 max-w-xl"
              >
                A community-powered language lab collecting, verifying, and publishing Koloqua speech and text with informed consent, fair rewards, and transparent governance.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <Button size="lg" onClick={onStart}>
                  Join the pilot <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="secondary" size="lg">
                  <Play className="w-5 h-5" /> Watch how it works
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: easing }}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-2xl overflow-hidden shadow-elevated border border-cream-dark aspect-[4/3]"
              >
                <Image
                  src="/assets/hero-people.jpg"
                  alt="Liberian community members collaborating"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/40 to-transparent" />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute bottom-4 left-4 right-4 bg-cream-100/95 backdrop-blur rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3"
                >
                  <Image src="/assets/liberia-flag.png" alt="Liberia" width={28} height={17} className="rounded-sm" />
                  <div>
                    <p className="text-xs font-bold text-charcoal">Liberia-first initiative</p>
                    <p className="text-[10px] text-charcoal-light">Owned by Liberians, for Liberians</p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: easing }}
            className="mt-16 max-w-5xl mx-auto"
          >
            <div className="bg-cream-100 rounded-2xl border border-cream-dark shadow-card p-2">
              <div className="bg-cream-light rounded-xl border border-cream-dark p-6 sm:p-10">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.12, duration: 0.5, ease: easing }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <strong className="block text-3xl font-bold text-terracotta">{stat.value}</strong>
                      <span className="text-sm text-charcoal-light">{stat.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="about" className="py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease: easing }}
                className="relative rounded-2xl overflow-hidden shadow-elevated border border-cream-dark aspect-[4/3] group"
              >
                <Image
                  src="/assets/community-voice.jpg"
                  alt="Community voices coming together"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-surface-dark/20 to-transparent" />
              </motion.div>
            </div>

            <div className="order-1 lg:order-2">
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                variants={staggerContainer}
              >
                <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream border border-cream-dark text-terracotta text-xs font-bold uppercase tracking-wider mb-4">
                  <Image src="/assets/liberia-flag.png" alt="Liberia flag" width={16} height={10} className="rounded-sm" />
                  About us
                </motion.div>
                <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-5 font-display">
                  {renderAnimatedHeading("Language data built by Liberians")}
                </h2>
                <motion.p variants={fadeUp} className="text-charcoal-light leading-relaxed mb-4">
                  Koloqua AI Language Lab collects authentic speech, sentences, and translations from native speakers, then validates every contribution through a community review process before it is used for research, education, and AI training.
                </motion.p>
                <motion.p variants={fadeUp} className="text-charcoal-light leading-relaxed mb-6">
                  Our mission is simple: preserve Liberia&apos;s voice on our own terms, train the next generation of Liberian language technologists, and ensure that the economic value of our languages flows back to the communities that created them.
                </motion.p>
                <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                  <Button onClick={onStart}>Become a contributor</Button>
                  <Button variant="secondary" onClick={() => scrollTo("#partners")}>Meet our partners</Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
            >
              <motion.span variants={fadeUp} className="section-title">How it works</motion.span>
              <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mt-2 font-display">
                {renderAnimatedHeading("Built for community, powered by people")}
              </h2>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={scaleIn}
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="h-full bg-cream-100 rounded-2xl p-8 border border-cream-dark shadow-soft transition-shadow duration-300 hover:shadow-card"
              >
                <motion.div
                  animate={hoveredStep === index ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center text-terracotta mb-5"
                >
                  <step.icon className="w-6 h-6" />
                </motion.div>
                <h3 className="text-xl font-bold text-charcoal mb-3">{step.title}</h3>
                <p className="text-charcoal-light leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-surface-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
            >
              <motion.span variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cream text-xs font-bold uppercase tracking-wider mb-4"
              >
                <Image src="/assets/liberia-flag.png" alt="Liberia flag" width={16} height={10} className="rounded-sm" />
                Principles
              </motion.span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3 font-display">
                {renderAnimatedHeading("Technology that respects the people behind the data")}
              </h2>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {principles.map((item) => (
              <motion.div
                key={item.title}
                variants={scaleIn}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-colors duration-300 hover:bg-white/10"
              >
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.05 }}
                  className="w-10 h-10 rounded-lg bg-terracotta flex items-center justify-center text-white mb-4"
                >
                  <item.icon className="w-5 h-5" />
                </motion.div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-cream/80 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="testimonials" className="py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
            >
              <motion.span variants={fadeUp} className="section-title">Community voices</motion.span>
              <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mt-2 font-display">
                {renderAnimatedHeading("What contributors say")}
              </h2>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="h-full bg-cream rounded-2xl p-6 border border-cream-dark shadow-soft flex flex-col transition-shadow duration-300 hover:shadow-card"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-terracotta/20 mb-3" />
                <p className="text-charcoal-light leading-relaxed flex-1 mb-5">“{t.text}”</p>
                <div className="flex items-center gap-3 pt-4 border-t border-cream-dark">
                  <div className="w-10 h-10 rounded-full bg-terracotta text-white flex items-center justify-center font-bold text-sm">
                    {t.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-charcoal text-sm">{t.name}</p>
                    <p className="text-xs text-charcoal-light">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="partners" className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
            >
              <motion.span variants={fadeUp} className="section-title">Partners</motion.span>
              <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mt-2 font-display">
                {renderAnimatedHeading("Working together for Liberia's languages")}
              </h2>
              <motion.p variants={fadeUp} className="text-charcoal-light mt-3 max-w-2xl mx-auto">
                Our pilot is made possible by institutions, educators, and organizations committed to protecting and advancing Liberian languages.
              </motion.p>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {partners.map((partner) => (
              <motion.div
                key={partner.name}
                variants={scaleIn}
                whileHover={{ y: -6, borderColor: "rgba(154, 52, 18, 0.35)", transition: { duration: 0.25 } }}
                className="bg-cream-100 rounded-2xl p-6 border border-cream-dark shadow-soft flex items-center gap-4 transition-shadow duration-300 hover:shadow-card"
              >
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center text-terracotta shrink-0"
                >
                  <partner.icon className="w-6 h-6" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-charcoal">{partner.name}</h3>
                  <p className="text-xs text-charcoal-light">{partner.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="contact" className="py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
            >
              <motion.span variants={fadeUp} className="section-title">Contact</motion.span>
              <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mt-2 font-display">
                {renderAnimatedHeading("Get in touch")}
              </h2>
              <motion.p variants={fadeUp} className="text-charcoal-light mt-3 max-w-2xl mx-auto">
                Have questions about the pilot, partnership opportunities, or how to contribute? We would love to hear from you.
              </motion.p>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              {[Mail, Phone, MapPin].map((Icon, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5, ease: easing }}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-cream border border-cream-dark"
                >
                  <div className="w-10 h-10 rounded-lg bg-terracotta/10 flex items-center justify-center text-terracotta">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-charcoal-light uppercase tracking-wider">
                      {idx === 0 ? "Email" : idx === 1 ? "Phone" : "Office"}
                    </p>
                    <p className="text-sm font-medium text-charcoal">
                      {idx === 0 ? "hello@koloquaai.org" : idx === 1 ? "+231 77 000 0000" : "Monrovia, Liberia"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: easing }}
                className="bg-cream rounded-2xl border border-cream-dark shadow-soft p-6 sm:p-8"
              >
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <Input label="Your name" placeholder="e.g. James Kollie" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
                  <Input label="Email address" type="email" placeholder="you@example.com" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                </div>
                <div className="mb-4">
                  <Input label="Subject" placeholder="How can we help?" value={contact.subject} onChange={(e) => setContact({ ...contact, subject: e.target.value })} icon={<MessageSquare className="w-4 h-4" />} />
                </div>
                <div className="mb-5">
                  <Textarea label="Message" placeholder="Tell us about your interest in Koloqua AI..." value={contact.message} onChange={(e) => setContact({ ...contact, message: e.target.value })} className="min-h-[140px]" />
                </div>
                <Button onClick={sendMessage} loading={sending} className="w-full sm:w-auto">
                  <Send className="w-4 h-4" /> Send message
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-terracotta text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold mb-6 font-display">Ready to contribute?</motion.h2>
            <motion.p variants={fadeUp} className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
              Join schools, reviewers, and contributors across Liberia in building the first community-owned Koloqua language dataset.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Button size="lg" variant="white" onClick={onStart}>
                Start contributing <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-surface-dark text-cream/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-terracotta to-terracotta-light flex items-center justify-center text-white font-bold">K</div>
                <span className="font-bold text-white text-lg">Koloqua AI</span>
                <Image src="/assets/liberia-flag.png" alt="Liberia" width={24} height={15} className="rounded-sm ml-1" />
              </div>
              <p className="text-sm text-cream/60 max-w-sm leading-relaxed">
                A community-powered language lab preserving Liberia&apos;s voice and preparing it for the age of AI.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollTo("#about")} className="hover:text-white transition-colors">About us</button></li>
                <li><button onClick={() => scrollTo("#how-it-works")} className="hover:text-white transition-colors">How it works</button></li>
                <li><button onClick={() => scrollTo("#partners")} className="hover:text-white transition-colors">Partners</button></li>
                <li><button onClick={() => scrollTo("#contact")} className="hover:text-white transition-colors">Contact</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> hello@koloquaai.org</li>
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +231 77 000 0000</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Monrovia, Liberia</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-cream/50">© 2026 Koloqua AI Language Lab. Pilot release.</p>
            <Button size="sm" onClick={onStart}>Get started</Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
