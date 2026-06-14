import { UserCircle2 } from "lucide-react";

export default function WhoAreYouModal({ colleagues, onSelect }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-modal">
        <div className="flex flex-col items-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mb-3">
            <UserCircle2 size={30} color="#0d9488" strokeWidth={1.5} />
          </div>
          <h2 className="font-display font-bold text-[20px] text-slate-800 tracking-[-0.3px] m-0">Bine ai venit!</h2>
          <p className="text-sm text-slate-400 mt-1">Cine ești tu?</p>
        </div>
        <div className="flex flex-col gap-2">
          {colleagues.map(c => (
            <button key={c.id} onClick={() => onSelect(c.name)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-teal-50 hover:border-teal-200 transition-all duration-150 cursor-pointer font-sans text-left">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center text-[14px] font-bold shrink-0">
                {c.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-semibold text-slate-700 text-[15px]">{c.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
