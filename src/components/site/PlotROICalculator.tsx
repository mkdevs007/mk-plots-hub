import { useState } from "react";
import { Info, Sparkles, TrendingUp, Lightbulb, Compass, Award, ShieldCheck } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const cityAppreciation: Record<string, number> = {
  Bangalore: 12,
  Mysore: 10,
  Hubli: 8,
  Tumkur: 9,
};

const cityInsights: Record<string, string> = {
  Bangalore:
    "Bangalore's tech corridors (East/South) are witnessing rapid expansion. Plots in outer areas (e.g., Devanahalli, Sarjapur) yield maximum returns due to upcoming metro/highway connectivity.",
  Mysore:
    "Mysore is a preferred clean-city destination for IT satellites and premium residential projects. High-quality layouts here offer stable, low-risk appreciation with lower entry costs.",
  Hubli:
    "Hubli-Dharwad is a primary logistics and educational hub in North Karnataka. A holding period of 5+ years is advised to leverage new industrial corridor growth.",
  Tumkur:
    "Tumkur is part of the Chennai-Bangalore Industrial Corridor. Plot prices here are highly affordable, making it a hotbed for long-term land banking with high multipliers.",
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

  // Generate dynamic financial suggestions
  const getPeriodSuggestion = (y: number) => {
    if (y < 3) {
      return "Short holding periods are ideal for liquidity, but higher transaction costs apply. We recommend holding for 5+ years to maximize compounding gains.";
    } else if (y <= 7) {
      return "A 5-7 year window is the optimal investment duration. This allows nearby infrastructure developments (roads, commercial hubs) to complete, unlocking maximum land value.";
    } else {
      return "Generational Wealth Choice! Land investments held for 8+ years experience powerful compounding. You will benefit from long-term capital gains benefits and major regional price re-rating.";
    }
  };

  const extraProfitFD = futureValuePlot - futureValueFD;
  const extraProfitGold = futureValuePlot - futureValueGold;

  return (
    <div className="bg-[#0C0C1E] border border-gold/20 rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] max-w-5xl mx-auto space-y-8 text-primary-foreground relative overflow-hidden">
      {/* Glowing background circles for visual depth */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gold font-semibold text-xs uppercase tracking-widest">
            <Sparkles className="w-4 h-4 animate-pulse" /> Live Wealth Estimator
          </div>
          <h3 className="font-display text-3xl text-white">Plot ROI Calculator</h3>
          <p className="text-sm text-primary-foreground/70 max-w-xl font-light">
            Estimate the potential appreciation of your land investment compared to traditional
            options like Fixed Deposits (FD) and Gold.
          </p>
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
              {/* Presets Triggers for Budget */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] text-primary-foreground/50 font-semibold uppercase mr-1">
                  Presets:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[5, 15, 30, 50, 100].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setBudget(val)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                        budget === val
                          ? "bg-gold text-gold-foreground border-gold shadow-md shadow-gold/20"
                          : "bg-white/5 hover:bg-white/10 text-primary-foreground/70 border-white/10 hover:border-gold/30 hover:text-primary-foreground"
                      }`}
                    >
                      ₹{val}L
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Target Location / City Input (GORGEOUS GRID OF CARDS) */}
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
                        <div>
                          <div
                            className={`font-display text-lg ${isSelected ? "text-gold font-semibold" : "text-primary-foreground/80 group-hover:text-primary-foreground"}`}
                          >
                            {c}
                          </div>
                          <div className="text-[10px] text-primary-foreground/50 mt-1 uppercase tracking-wider font-semibold">
                            Appreciation
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isSelected
                              ? "bg-gold text-gold-foreground"
                              : "bg-white/10 text-primary-foreground/75"
                          }`}
                        >
                          +{cityAppreciation[c]}%
                        </span>
                      </div>
                      {/* Active indicator dot */}
                      {isSelected && (
                        <span className="absolute bottom-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-gold" />
                      )}
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
                  max="10"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold focus:outline-none"
                />
              </div>
              {/* Presets Triggers for Years */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] text-primary-foreground/50 font-semibold uppercase mr-1">
                  Duration:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[1, 3, 5, 8, 10].map((val) => (
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
                      {val} {val === 1 ? "Yr" : "Yrs"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Outputs & Chart */}
        <div className="lg:col-span-6 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          {/* Main Return Output Box */}
          <div className="space-y-6">
            <div>
              <div className="text-xs text-primary-foreground/60 uppercase tracking-widest font-semibold">
                Estimated Future Value
              </div>
              <div className="font-display text-4xl md:text-5xl text-gold font-bold mt-1 tracking-tight">
                {formatCurrency(futureValuePlot)}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2 font-medium">
                <TrendingUp className="w-3.5 h-3.5 animate-bounce" />
                <span>
                  Net profit of {formatCurrency(futureValuePlot - budget)} in {years} years ({rate}%
                  p.a.)
                </span>
              </div>
            </div>

            {/* Visual Comparison Chart */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h4 className="text-xs font-bold text-primary-foreground/60 uppercase tracking-wider">
                Comparison after {years} years
              </h4>

              <div className="space-y-4">
                {/* Plot */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-gold shrink-0 animate-spin-slow" />
                      <span className="text-primary-foreground/90">
                        Land Plot ({city} @ {rate}%)
                      </span>
                    </span>
                    <span className="font-bold text-gold">{formatCurrency(futureValuePlot)}</span>
                  </div>
                  <div className="h-8 w-full bg-white/5 rounded-lg overflow-hidden flex items-center p-0.5 border border-white/5">
                    <div
                      style={{ width: `${getWidthPercent(futureValuePlot)}%` }}
                      className="h-full bg-gradient-to-r from-amber-600 to-gold text-gold-foreground rounded-md transition-all duration-700 ease-out flex items-center justify-between px-3 shadow-[0_2px_10px_rgba(184,134,11,0.25)] min-w-[40px]"
                    >
                      <span className="text-[10px] font-bold text-gold-foreground tracking-wide uppercase truncate">
                        Plot Yield
                      </span>
                      <span className="text-[10px] font-extrabold text-gold-foreground bg-white/20 px-1.5 py-0.5 rounded shrink-0">
                        {(futureValuePlot / budget).toFixed(1)}x
                      </span>
                    </div>
                  </div>
                </div>

                {/* Gold */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="text-primary-foreground/75">Gold Investment (@ 9%)</span>
                    </span>
                    <span className="text-primary-foreground/90">
                      {formatCurrency(futureValueGold)}
                    </span>
                  </div>
                  <div className="h-8 w-full bg-white/5 rounded-lg overflow-hidden flex items-center p-0.5 border border-white/5">
                    <div
                      style={{ width: `${getWidthPercent(futureValueGold)}%` }}
                      className="h-full bg-gradient-to-r from-amber-700/80 to-amber-500/80 text-white rounded-md transition-all duration-700 ease-out flex items-center justify-between px-3 min-w-[40px]"
                    >
                      <span className="text-[10px] font-bold text-white/90 tracking-wide uppercase truncate">
                        Gold
                      </span>
                      <span className="text-[10px] font-semibold text-white/95 shrink-0">
                        {(futureValueGold / budget).toFixed(1)}x
                      </span>
                    </div>
                  </div>
                </div>

                {/* FD */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-primary-foreground/75">Fixed Deposit (FD @ 7%)</span>
                    </span>
                    <span className="text-primary-foreground/90">
                      {formatCurrency(futureValueFD)}
                    </span>
                  </div>
                  <div className="h-8 w-full bg-white/5 rounded-lg overflow-hidden flex items-center p-0.5 border border-white/5">
                    <div
                      style={{ width: `${getWidthPercent(futureValueFD)}%` }}
                      className="h-full bg-gradient-to-r from-slate-700/80 to-slate-500/80 text-white rounded-md transition-all duration-700 ease-out flex items-center justify-between px-3 min-w-[40px]"
                    >
                      <span className="text-[10px] font-bold text-white/90 tracking-wide uppercase truncate">
                        FD
                      </span>
                      <span className="text-[10px] font-semibold text-white/95 shrink-0">
                        {(futureValueFD / budget).toFixed(1)}x
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions Section */}
      <div className="border-t border-white/10 pt-8 space-y-6 relative z-10">
        <div className="flex items-center gap-2 text-gold font-semibold text-sm">
          <Lightbulb className="w-4 h-4" />
          <span>Smart Investment Suggestions & Market Insights</span>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: Outperformance Benefit */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-2.5 hover:border-gold/30 transition-all duration-300">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
              <Award className="w-4 h-4 shrink-0" />
              <span>Plot Outperformance</span>
            </div>
            <p className="text-xs text-primary-foreground/70 leading-relaxed font-light">
              Investing in a <span className="font-semibold text-white">{city}</span> plot beats
              Fixed Deposit by{" "}
              <span className="font-semibold text-emerald-400">
                {formatCurrency(extraProfitFD)}
              </span>{" "}
              and outpaces Gold returns by{" "}
              <span className="font-semibold text-emerald-400">
                {formatCurrency(extraProfitGold)}
              </span>
              .
            </p>
          </div>

          {/* Card 2: City Market Outlook */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-2.5 hover:border-gold/30 transition-all duration-300">
            <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs uppercase tracking-wider">
              <Compass className="w-4 h-4 shrink-0" />
              <span>{city} Market Outlook</span>
            </div>
            <p className="text-xs text-primary-foreground/70 leading-relaxed font-light">
              {cityInsights[city]}
            </p>
          </div>

          {/* Card 3: Holding Period Strategy */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-2.5 hover:border-gold/30 transition-all duration-300">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                Strategy ({years} {years === 1 ? "Year" : "Years"})
              </span>
            </div>
            <p className="text-xs text-primary-foreground/70 leading-relaxed font-light">
              {getPeriodSuggestion(years)}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-2 relative z-10">
        <p className="flex gap-1.5 text-[10px] text-primary-foreground/50 leading-normal bg-white/5 p-3.5 rounded-xl border border-white/5">
          <Info className="w-3.5 h-3.5 shrink-0 text-gold mt-0.5" />
          <span>
            Disclaimer: Appreciation rates are historical averages and are not guaranteed. Land
            appreciation depends heavily on site development, location access, clear titles, and
            local zoning laws.
          </span>
        </p>
      </div>
    </div>
  );
}
