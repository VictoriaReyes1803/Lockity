

import NavbarHome from "../components/NavbarHome";
import { Lock, Bell, Smartphone, Contact } from "lucide-react";
import {contactanos} from "../services/lockersService";
import type {Contactanos} from "../models/locker";
import { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";
import Turnstile from "react-turnstile";

declare global {
  interface Window {
    turnstile?: any;
  }
}

const testimonials = [
  {
    quote: "LOCKITY makes me feel safe leaving my gear at the gym. ",
    user: "— Jordan M.",
  },
  {
    quote: "Finally a locker system that doesn't require keys. The fingerprint access is flawless.",
    user: "— Ayesha K.",
  },
  {
    quote: "Super intuitive and secure. I love the smart alerts when someone accesses my locker.",
    user: "— Carlos R.",
  },
];


export default function Home() {
const [captchaToken, setCaptchaToken] = useState<string | null>(null);
const [scriptLoaded, setScriptLoaded] = useState(false);

const [form, setForm] = useState<Contactanos>({
  name: "",
  email: "",
  description: "",
  captchaToken: null,
  public_key: null
});
const [sending, setSending] = useState(false);
const [messageSent, setMessageSent] = useState(false);
const toast = useRef<Toast>(null);
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  setForm({ ...form, [e.target.id]: e.target.value });
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSending(true);
  setMessageSent(false);

  try {
    if (!form.name || !form.email || !form.description || !captchaToken) {
      toast.current?.show({ severity: "warn", summary: "Warning", detail: "Please fill in all fields.", life: 3000 });
      setSending(false);
      return;
    }
    if (!captchaToken) {
  toast.current?.show({ severity: "warn", summary: "Captcha", detail: "Please complete the captcha", life: 3000 });
  setSending(false);
  return;
}
form.public_key = import.meta.env.VITE_SITE_KEY;


    await contactanos(form);
    setForm({ name: "", email: "", description: "", captchaToken: null, public_key: null });
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: "Your message has been sent successfully!",
      life: 3000,
    });
    setMessageSent(true);
  } catch (err) {
    console.error("Failed to send contact form:", err);
    toast.current?.show({ severity: "error", summary: "Error", detail: "There was an error sending your message. Please try again.", life: 3000 });
  } finally {
    setSending(false);
  }
};
useEffect(() => {
  const scriptId = "cf-turnstile-script";

  if (!document.getElementById(scriptId)) {
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setScriptLoaded(true); 
    };
    document.body.appendChild(script);
  } else {
    setScriptLoaded(true); 
  }
}, []);


  return (
  
    <div className="bg-[#2E2D2D] text-white min-h-screen w-full">
        <NavbarHome/> 
         <Toast ref={toast} />
    
     <section className="flex flex-col-reverse md:flex-row items-center justify-between md:px-20 py-[7rem] px-6">
 
  <div className="mt-12 md:mt-0 text-center md:text-left">
    <h1 className="text-4xl md:text-6xl  font-bold mb-6">
      YOUR SMART LOCKER SECURED.
    </h1>
    <p className="text-lg md:text-2xl text-gray-400 mb-8">
      Advanced biometric technology to keep your belongings safe. Anytime. Anywhere.
    </p>
    <div className="space-x-4">
      <button
  onClick={() => {
    const section = document.getElementById("contact");
    section?.scrollIntoView({ behavior: "smooth" });
  }}
  className="bg-[#FFD166] text-black px-6 py-2 font-semibold hover:bg-[#e2ba5d] transition"
>
  Get Started
</button>

      <button 
      onClick={() => {
        const section = document.getElementById("why-choose-lockity");
        section?.scrollIntoView({ behavior: "smooth" });
      }}
      className="bg-[#515355] text-white px-6 py-2  font-semibold hover:bg-[#444] transition ">
        Learn More
      </button>
    </div>
  </div>


  <div className="mb-12 md:mb-0">
    <img
      src="/images/logosin.svg"
      alt="Fingerprint Icon"
      className="w-[14rem] md:w-[19rem] h-auto mx-auto opacity-80"
    />
  </div>
</section>


      {/* Why Choose LOCKITY */}
<section id="why-choose-lockity" className="w-full px-6 md:px-24 py-16 text-center bg-[#2E2D2D]">
  <h2 className="text-2xl font-bold mb-8">Why Choose LOCKITY?</h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-300">
    {/* Feature 1 */}
    <div className="flex flex-col items-center">
      <Lock className="w-12 h-12 mb-4 text-[#515355]" />

      <h3 className="font-semibold text-lg mb-2">Secure Access</h3>
      <p className="text-sm text-gray-400 max-w-xs">
        Biometric fingerprints and mobile access for ultimate control.
      </p>
    </div>

    {/* Feature 2 */}
    <div className="flex flex-col items-center">
      <Bell className="w-12 h-12 mb-4 text-[#515355]" />
      <h3 className="font-semibold text-lg mb-2">Smart Notifications</h3>
      <p className="text-sm text-gray-400 max-w-xs">
        Get real-time alerts right on your phone.
      </p>
    </div>

    {/* Feature 3 */}
    <div className="flex flex-col items-center">
        <Smartphone className="w-12 h-12 mb-4 text-[#515355]" />
      <h3 className="font-semibold text-lg mb-2">Anywhere Access</h3>
      <p className="text-sm text-gray-400 max-w-xs">
        Manage your locker remotely from any device.
      </p>
    </div>
  </div>
</section>
{/* Security Priority Section */}
<section className="w-full px-6 md:px-24 bg-[#2E2D2D]">
  <div className="flex flex-col md:flex-row items-center justify-center gap-10 text-center md:text-left">
    
    <img
      src="/images/escudo.svg"
      alt="Security Icon"
      className="w-[10rem] h-[10rem] opacity-80"
    />

    <div className="max-w-xl">
      <h2 className="text-xl font-semibold mb-4">
        Your Safety is Our Priority
      </h2>
      <p className="text-gray-400">
        LOCKITY is built using military-grade encryption and secure cloud storage. Your data and belongings are always protected.
      </p>
    </div>
  </div>
</section>


<section className="w-full px-6 md:px-24 py-16 text-center bg-[#2E2D2D]">
  <h2 className="text-xl font-semibold text-white mb-10">Trusted by Users Worldwide</h2>

   <div className="flex flex-col md:flex-row justify-center items-center gap-6">
    {testimonials.map((testimonial, i) => (
      <div
        key={i}
        className="bg-[#333232]/60 border border-[#3c3c3c] rounded-2xl px-6 py-5 max-w-xs text-left shadow-lg backdrop-blur-md"
      >
        <div className="text-lg text-[#A3A8AF] mb-2 leading-none">“</div>
        <p className="text-sm text-white font-light leading-relaxed mb-4">
          {testimonial.quote}
        </p>
        <span className="text-xs text-[#A3A8AF] font-medium">{testimonial.user}</span>
      </div>
    ))}
  </div>
</section>

<section className="w-full px-6 md:px-24 py-16 bg-[#2E2D2D] text-center">
  <h2 className="text-xl font-semibold text-white mb-6">
    Desktop App for Admins
  </h2>
  <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-sm md:text-base">
    Manage lockers, monitor activity, and perform secure operations with our dedicated desktop application.
    Only users with <span className="text-[#FFD166] font-medium">Admin</span> role can use the desktop app.
  </p>

  <a
    href="/downloads/Lockity Setup 0.0.0.exe"
    className="inline-block bg-[#FFD166] text-black px-6 py-2 font-semibold rounded-full hover:brightness-90 transition"
    download
  >
    Download for Windows
  </a>

  <div className="mt-6">
    <img
      src="/images/logosin.svg"
      alt="Desktop app preview"
      className="w-[30px] md:w-[40px] mx-auto opacity-90"
    />
  </div>
</section>


{/* Contact Form */}
<section id="contact"  className="w-full px-6 md:px-24 py-[8rem] bg-[#2E2D2D]">
  <h2 className="text-xl font-semibold mb-10 text-center">Contact Us!</h2>
  <div className="flex flex-col md:flex-row items-center justify-center gap-40">
    

    <form onSubmit={handleSubmit} className="max-w-md w-full space-y-4 text-left">

  <div className="space-y-1">
    <label htmlFor="name" className="text-sm text-gray-300">
      Enter Name
    </label>
    <input
      id="name"
      value={form.name}
      onChange={handleInputChange}
      className="w-full px-4 py-2 bg-[#515355] text-white text-sm border border-[#A6A4A4] focus:outline-none focus:ring-0 focus:border-[#FFD166]"
      type="text"
    />
  </div>

  <div className="space-y-1">
    <label htmlFor="email" className="text-sm text-gray-300">
      Enter Email
    </label>
    <input
      id="email"
      value={form.email}
      onChange={handleInputChange}
      className="w-full px-4 py-2 bg-[#515355] text-white text-sm  border border-[#A6A4A4] focus:outline-none focus:ring-0 focus:border-[#A3A8AF]"
      type="email"
    />
  </div>

  <div className="space-y-1">
    <label htmlFor="description" className="text-sm text-gray-300">
      Enter Description
    </label>
    <textarea
      id="description"
      value={form.description}
      onChange={handleInputChange}
      className="w-full px-4 py-2 bg-[#515355] text-white text-sm  border border-[A6A4A4] focus:outline-none focus:ring-0 focus:border-[#A3A8AF]"
      rows={4}
    ></textarea>
  </div>

{scriptLoaded && (
  <Turnstile
    sitekey={import.meta.env.VITE_SITE_KEY}
    onVerify={(token) => {
      setCaptchaToken(token);
      setForm((prev) => ({ ...prev, captchaToken: token }));
    }}
    onExpire={() => {
      setCaptchaToken(null);
      setForm((prev) => ({ ...prev, captchaToken: null }));
    }}
    onError={() => {
      toast.current?.show({
        severity: "error",
        summary: "Captcha Error",
        detail: "Captcha verification failed. Please try again.",
        life: 3000,
      });
    }}
    theme="dark"
    size="normal"
    style={{ marginTop: "1rem" }}
    className="mt-2"
    id="turnstile"
  />
)}


  <button
    type="submit"
    className="bg-[#FFD166] text-black px-6 py-2 font-semibold hover:brightness-90 transition w-full"
  
    disabled={sending || messageSent}>
    {sending ? "Sending..." : "Send Message"}
  </button>
    {messageSent && (
    <p className="text-sm text-green-400 mt-2">Message sent successfully!</p>
  )}
</form>

    {/* Logo */}
    <div className="flex justify-center">
      <img
        src="/images/logo.svg"
        alt="LOCKITY logo"
        className="w-[20rem] h-auto opacity-90"
      />
    </div>
  </div>
</section>

    </div>
  );
}
