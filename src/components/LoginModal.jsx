import { useState } from "react";
import { UserCircle2, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

export default function LoginModal() {
  const { colleagues, setCurrentUser, verifyPin, setColleaguePin } = useApp();
  const [step, setStep] = useState("select");
  const [selected, setSelected] = useState(null);
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const reset = () => { setStep("select"); setSelected(null); setPin(""); setPinConfirm(""); setError(""); };

  const handleSelect = (c) => {
    setSelected(c);
    setPin(""); setPinConfirm(""); setError("");
    setStep(c.role === "admin" && !c.pin ? "setpin" : "pin");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!pin) { setError("Introdu PIN-ul"); return; }
    setBusy(true); setError("");
    const role = await verifyPin(selected.name, pin);
    setBusy(false);
    if (role !== null) {
      setCurrentUser(selected.name, role);
    } else {
      setError("PIN incorect. Încearcă din nou.");
      setPin("");
    }
  };

  const handleSetPin = async (e) => {
    e.preventDefault();
    if (pin.length < 4) { setError("PIN-ul trebuie să aibă minim 4 caractere"); return; }
    if (pin !== pinConfirm) { setError("PIN-urile nu coincid"); return; }
    setBusy(true); setError("");
    await setColleaguePin(selected.id, pin);
    setBusy(false);
    setCurrentUser(selected.name, selected.role || "admin");
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-modal">

        {step === "select" && (
          <>
            <div className="flex flex-col items-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mb-3">
                <UserCircle2 size={30} color="#0d9488" strokeWidth={1.5} />
              </div>
              <h2 className="font-display font-bold text-[20px] text-slate-800 tracking-[-0.3px] m-0">Bine ai venit!</h2>
              <p className="text-sm text-slate-400 mt-1">Selectează contul tău</p>
            </div>
            <div className="flex flex-col gap-2">
              {colleagues.map(c => (
                <button key={c.id} onClick={() => handleSelect(c)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-teal-50 hover:border-teal-200 transition-all duration-150 cursor-pointer font-sans text-left">
                  <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center text-[14px] font-bold shrink-0">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-slate-700 text-[15px]">{c.name}</span>
                  {c.role === "admin" && (
                    <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-lg bg-purple-100 text-purple-700">Admin</span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        {step === "pin" && selected && (
          <>
            <button onClick={reset}
              className="flex items-center gap-1.5 text-slate-500 text-[13px] mb-4 bg-transparent border-none cursor-pointer hover:text-slate-700 transition-colors font-sans p-0">
              <ArrowLeft size={15} /> Înapoi
            </button>
            <div className="flex flex-col items-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-[18px] font-bold mb-3">
                {selected.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-display font-bold text-[20px] text-slate-800 tracking-[-0.3px] m-0">{selected.name}</h2>
              <p className="text-sm text-slate-400 mt-1">Introdu PIN-ul tău</p>
            </div>
            {!selected.pin ? (
              <div className="text-center text-[13px] text-slate-500 bg-slate-50 rounded-xl px-4 py-5">
                PIN nesetat — contactează adminul pentru a seta un PIN.
              </div>
            ) : (
              <form onSubmit={handleLogin} className="flex flex-col gap-3">
                <div className="relative">
                  <input
                    type={showPin ? "text" : "password"}
                    value={pin}
                    onChange={e => { setPin(e.target.value); setError(""); }}
                    placeholder="PIN..."
                    autoFocus
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[18px] tracking-[0.3em] font-bold text-slate-700 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all font-sans"
                  />
                  <button type="button" onClick={() => setShowPin(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-0">
                    {showPin ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {error && <div className="text-[12px] text-red-600 text-center font-semibold">{error}</div>}
                <button type="submit" disabled={busy}
                  className="w-full py-3 rounded-xl bg-teal-600 text-white font-bold text-[14px] border-none cursor-pointer hover:bg-teal-700 transition-colors font-sans disabled:opacity-50">
                  {busy ? "Se verifică..." : "Intră"}
                </button>
              </form>
            )}
          </>
        )}

        {step === "setpin" && selected && (
          <>
            <div className="flex flex-col items-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-3">
                <Lock size={26} color="#9333ea" strokeWidth={1.5} />
              </div>
              <h2 className="font-display font-bold text-[20px] text-slate-800 tracking-[-0.3px] m-0">Setează PIN-ul</h2>
              <p className="text-sm text-slate-400 mt-1 text-center">Prima conectare — creează PIN-ul pentru contul tău de admin</p>
            </div>
            <form onSubmit={handleSetPin} className="flex flex-col gap-3">
              <input
                type="password"
                value={pin}
                onChange={e => { setPin(e.target.value); setError(""); }}
                placeholder="PIN nou (min. 4 caractere)"
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[15px] tracking-[0.2em] font-bold text-slate-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all font-sans"
              />
              <input
                type="password"
                value={pinConfirm}
                onChange={e => { setPinConfirm(e.target.value); setError(""); }}
                placeholder="Confirmă PIN-ul"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[15px] tracking-[0.2em] font-bold text-slate-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all font-sans"
              />
              {error && <div className="text-[12px] text-red-600 text-center font-semibold">{error}</div>}
              <button type="submit" disabled={busy}
                className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold text-[14px] border-none cursor-pointer hover:bg-purple-700 transition-colors font-sans disabled:opacity-50">
                {busy ? "Se salvează..." : "Salvează și intră"}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}
