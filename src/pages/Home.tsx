

import NavbarHome from "../components/NavbarHome";
import { Lock, Bell, Smartphone } from "lucide-react";

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
  return (
  
    <div className="bg-[#2E2D2D] text-white min-h-screen w-full">
        <NavbarHome/> 
    
     <section className="flex flex-col-reverse md:flex-row items-center justify-between md:px-20 py-[7rem] px-6">
 
  <div className="mt-12 md:mt-0 text-center md:text-left">
    <h1 className="text-4xl md:text-6xl  font-bold mb-6">
      YOUR SMART LOCKER SECURED.
    </h1>
    <p className="text-lg md:text-2xl text-gray-400 mb-8">
      Advanced biometric technology to keep your belongings safe. Anytime. Anywhere.
    </p>
    <div className="space-x-4">
      <button className="bg-[#FFD166] text-black px-6 py-2  font-semibold hover:bg-[#e2ba5d] transition">
        Get Started
      </button>
      <button  className="bg-[#515355] text-white px-6 py-2  font-semibold hover:bg-[#444] transition ">
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
<section className="w-full px-6 md:px-24 py-16 text-center bg-[#2E2D2D]">
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


{/* Contact Form */}
<section className="w-full px-6 md:px-24 py-[8rem] bg-[#2E2D2D]">
  <h2 className="text-xl font-semibold mb-10 text-center">Contact Us!</h2>
  <div className="flex flex-col md:flex-row items-center justify-center gap-40">
    

    <form className="max-w-md w-full space-y-4 text-left">

  <div className="space-y-1">
    <label htmlFor="name" className="text-sm text-gray-300">
      Enter Name
    </label>
    <input
      id="name"
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
      className="w-full px-4 py-2 bg-[#515355] text-white text-sm  border border-[A6A4A4] focus:outline-none focus:ring-0 focus:border-[#A3A8AF]"
      rows={4}
    ></textarea>
  </div>


  <button className="bg-[#FFD166] text-black px-6 py-2 font-semibold hover:brightness-90 transition w-full">
    Send
  </button>
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
