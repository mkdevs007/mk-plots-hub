import { useState } from "react";
import { Sparkles, TrendingUp, Compass, Award } from "lucide-react";

const cityAppreciation: Record<string, number> = {
  Bangalore: 12,
  Mysore: 10,
  Hubli: 8,
  Tumkur: 9,
};

export function PlotROICalculator() {
  const [budget, setBudget] = useState<number>(15); // in Lakhs
  const [city, setCity] = useState<string>("Bangalore");
  const [years, setYears] = useState<number>(5);

  const rate = cityAppreciation[city] ?? 10;

  // Future Value = P * (1 + r)^n
  const futureValuePlot = budget * Math.pow(1 + rate / 100, years);
  const futureValueFD = budget * Math.pow(1 + 0.07, years); // FD average 7%
  const futureValueGold = budget * Math.pow(1 + 0.09, years); // Gold average 9%

  const formatCurrency = (val: number) => {
    const rupees = val * 100000;
    if (rupees >= 10000000) {
      return `₹${(rupees / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(rupees / 100000).toFixed(2)} Lakh`;
  };

  const maxVal = Math.max(futureValuePlot, futureValueFD, futureValueGold);
  const getWidthPercent = (val: number) => {
    return (val / maxVal) * 100;
  };

  return (
    <div className="bg-[#1C0624] border border-gold/20 rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] max-w-5xl mx-auto space-y-8 text-primary-foreground relative overflow-hidden">
      {/* Glowing background circles for visual depth */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gold font-semibold font-nav text-xs uppercase tracking-widest">
            <Sparkles className="w-4 h-4 animate-pulse" /> Live Wealth Estimator
          </div>
          <h3 className="font-display text-3xl text-white">Plot ROI Calculator</h3>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-stretch relative z-10">
        {/* Left Column: Inputs & Triggers */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Initial Budget Input */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-semibold">
                <label className="text-primary-foreground/95">Initial Investment</label>
                <span className="text-gold font-bold text-base">₹{budget} Lakh</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="1"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold focus:outline-none"
                />
              </div>
            </div>

            {/* Target Location / City Input */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-primary-foreground/95">
                Target Location / City
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(cityAppreciation).map((c) => {
                  const isSelected = city === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCity(c)}
                      className={`relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-300 group hover:-translate-y-0.5 cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-br from-gold/15 to-gold/5 border-gold shadow-[0_4px_20px_rgba(184,134,11,0.15)]"
                          : "bg-white/5 hover:bg-white/10 border-white/10 hover:border-gold/30"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span
                          className={`text-sm font-bold transition-colors ${
                            isSelected
                              ? "text-white"
                              : "text-primary-foreground/80 group-hover:text-white"
                          }`}
                        >
                          {c}
                        </span>
                        <span
                          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide ${
                            isSelected
                              ? "bg-gold/20 text-gold"
                              : "bg-white/5 text-primary-foreground/50 group-hover:bg-white/10 group-hover:text-primary-foreground"
                          }`}
                        >
                          +{cityAppreciation[c]}%
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] text-primary-foreground/60 leading-normal">
                        Appreciation p.a.
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Holding Period Input */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-semibold">
                <label className="text-primary-foreground/95">Holding Period</label>
                <span className="text-gold font-bold text-base">
                  {years} {years === 1 ? "Year" : "Years"}
                </span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold focus:outline-none"
                />
              </div>
              {/* Presets for Years */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] text-primary-foreground/50 font-semibold uppercase mr-1">
                  Presets:
                </span>
                <div className="flex gap-1.5">
                  {[3, 5, 7, 10, 15].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setYears(val)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                        years === val
                          ? "bg-gold text-gold-foreground border-gold shadow-md shadow-gold/20"
                          : "bg-white/5 hover:bg-white/10 text-primary-foreground/70 border-white/10 hover:border-gold/30 hover:text-primary-foreground"
                      }`}
                    >
                      {val}Y
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visualization Results */}
        <div className="lg:col-span-6 bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col justify-between gap-6">
          <div className="space-y-5">
            {/* Header Result */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-primary-foreground/50 uppercase tracking-widest block">
                Estimated Value
              </span>
              <div className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
                {formatCurrency(futureValuePlot)}
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/10">
                <TrendingUp className="w-3.5 h-3.5 animate-bounce" />
                <span>
                  Net profit of {formatCurrency(futureValuePlot - budget)} in {years} years ({rate}%
                  p.a.)
                </span>
              </div>
            </div>

            {/* Comparison Chart */}
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-primary-foreground/60 uppercase">
                  <span>Land Plot</span>
                  <span>{formatCurrency(futureValuePlot)}</span>
                </div>
                <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${getWidthPercent(futureValuePlot)}%` }}
                    className="h-full bg-gold"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-primary-foreground/60 uppercase">
                  <span>Gold</span>
                  <span>{formatCurrency(futureValueGold)}</span>
                </div>
                <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${getWidthPercent(futureValueGold)}%` }}
                    className="h-full bg-amber-500"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-primary-foreground/60 uppercase">
                  <span>Fixed Deposit</span>
                  <span>{formatCurrency(futureValueFD)}</span>
                </div>
                <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${getWidthPercent(futureValueFD)}%` }}
                    className="h-full bg-slate-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
