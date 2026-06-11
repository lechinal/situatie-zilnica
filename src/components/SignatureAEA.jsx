import semnaturaImg from "../assets/images/semnatura/aea-black.png";

export default function SignatureAEA() {
  return (
    <div className="flex items-center gap-2 justify-center">
      <span className="text-[10px] text-slate-300 tracking-wider">
        v1.0 · 2026
      </span>
      <img
        src={semnaturaImg}
        alt="AEA"
        style={{ height: 32, width: "auto", opacity: 0.5 }}
      />
    </div>
  );
}
