"client"; // Ostaje client komponenta
"use client";

import { useState } from "react";

export default function LeadMagnetPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName");
    const email = formData.get("email");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center items-center p-6 selection:bg-red-100 selection:text-red-900">
      <div className="max-w-xl w-full bg-white p-8 md:p-12 border border-zinc-200 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        
        {!isSubmitted ? (
          <div>
            <span className="text-sm font-bold tracking-wider text-red-600 uppercase mb-4 block">
               GET YOUR COMPLETE BLOOD WORK GUIDE
            </span>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight leading-[1.1] mb-4">
              Know what to check. Understand what it means.
            </h1>
            
            <p className="text-base text-zinc-600 leading-relaxed mb-8">
              Get my free “Complete Blood Work Guide” — a practical checklist covering the key blood markers across CBC, iron status, metabolic health, liver, kidney, lipids, thyroid, hormones, vitamins and inflammation.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  name="firstName"
                  type="text"
                  required
                  placeholder="First Name"
                  className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all text-sm"
                />
              </div>
              
              <div>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email Address"
                  className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all text-sm"
                />
              </div>

              {errorMsg && (
                <p className="text-red-600 text-xs font-medium">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-zinc-900 hover:bg-red-600 text-white font-semibold text-sm px-6 py-4 rounded-md transition-colors duration-300 flex justify-center items-center disabled:opacity-70 cursor-pointer"
              >
                {isLoading ? "PROCESSING..." : "GET THE FREE GUIDE"}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-8">
            <span className="text-4xl mb-4 block"></span>
            
            <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight mb-2">
              YOUR GUIDE IS READY 
            </h2>
            
            <p className="text-base text-zinc-600 mb-8">
              “Thanks for requesting the Complete Blood Work Guide. Check your inbox as well!”
            </p>
            
            <a
              href="/The_Complete_Blood_Work_Guide_Exact.pdf"
              download
              className="inline-flex justify-center w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-6 py-4 rounded-md transition-colors duration-300"
            >
              DOWNLOAD THE GUIDE
            </a>
          </div>
        )}
        
      </div>
    </div>
  );
}