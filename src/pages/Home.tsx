

export default function Home() {
  return (
    <div className="bg-[#2E2D2D] text-white min-h-screen w-full">
      {/* Hero section */}
      <section className="flex flex-col md:flex-row items-center justify-between  md:px-20 py-20">
        <div className="">
          <h1 className="text-5xl font-bold mb-6">YOUR SMART LOCKER SECURED.</h1>
          <p className="text-2xl text-gray-400 mb-8">
            Advanced biometric technology to keep your belongings safe. Anytime. Anywhere.
          </p>
          <div className="space-x-4">
            <button className="bg-[#FFD166] text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-300 transition">
              Get Started
            </button>
            <button className="bg-[#333] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#444] transition">
              Learn More
            </button>
          </div>
        </div>

        <div className="mt-12 md:mt-0">
          <img src="/images/logosin.svg" alt="Fingerprint Icon" className="w-[19rem] h-[25rem] mx-auto opacity-80" />
        </div>
      </section>

      {/* Why Choose LOCKITY */}
<section className="w-full px-6 md:px-24 py-16 text-center bg-[#2E2D2D]">
  <h2 className="text-2xl font-bold mb-8">Why Choose LOCKITY?</h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-300">
    {/* Feature 1 */}
    <div className="flex flex-col items-center">
      <div className="text-4xl mb-4">🔒</div>
      <h3 className="font-semibold text-lg mb-2">Secure Access</h3>
      <p className="text-sm text-gray-400 max-w-xs">
        Biometric fingerprints and mobile access for ultimate control.
      </p>
    </div>

    {/* Feature 2 */}
    <div className="flex flex-col items-center">
      <div className="text-4xl mb-4">🔔</div>
      <h3 className="font-semibold text-lg mb-2">Smart Notifications</h3>
      <p className="text-sm text-gray-400 max-w-xs">
        Get real-time alerts right on your phone.
      </p>
    </div>

    {/* Feature 3 */}
    <div className="flex flex-col items-center">
      <div className="text-4xl mb-4">📱</div>
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


{/* Testimonials */}
<section className="w-full px-6 md:px-24 py-12 text-center bg-[#2E2D2D]">
  <h2 className="text-xl font-semibold mb-8">Trusted by Users Worldwide</h2>
  <div className="flex flex-col md:flex-row justify-center gap-6">
    <div className="bg-[#2a2a2a] p-6 rounded-md max-w-xs text-sm text-gray-300">“Lorem ipsum dolor sit amet, consectetur adipiscing elit.”</div>
    <div className="bg-[#2a2a2a] p-6 rounded-md max-w-xs text-sm text-gray-300">“Lorem ipsum dolor sit amet, consectetur adipiscing elit.”</div>
    <div className="bg-[#2a2a2a] p-6 rounded-md max-w-xs text-sm text-gray-300">“Lorem ipsum dolor sit amet, consectetur adipiscing elit.”</div>
  </div>
  
</section>

{/* Contact Form */}
<section className="w-full px-6 md:px-24 py-16 bg-[#2E2D2D]">
  <h2 className="text-xl font-semibold mb-10 text-center">Contact Us!</h2>
  <div className="flex flex-col md:flex-row items-center justify-center gap-12">
    
    {/* Formulario */}
    <form className="max-w-md w-full space-y-4 text-left">
      <input
        className="w-full px-4 py-2 bg-[#2a2a2a] text-white rounded placeholder-gray-400"
        type="text"
        placeholder="Enter Name"
      />
      <input
        className="w-full px-4 py-2 bg-[#2a2a2a] text-white rounded placeholder-gray-400"
        type="email"
        placeholder="Enter Email"
      />
      <textarea
        className="w-full px-4 py-2 bg-[#2a2a2a] text-white rounded placeholder-gray-400"
        rows={4}
        placeholder="Enter Description"
      ></textarea>
      <button className="bg-[#FFD166] text-black px-6 py-2 rounded-full font-semibold hover:brightness-90 transition w-full">
        Send
      </button>
    </form>

    {/* Logo */}
    <div className="flex justify-center">
      <img
        src="/images/logosin.svg"
        alt="LOCKITY logo"
        className="w-[12rem] h-auto opacity-90"
      />
    </div>
  </div>
</section>

    </div>
  );
}
