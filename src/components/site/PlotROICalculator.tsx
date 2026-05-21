import { useState } from "react";
import { Info, Sparkles, TrendingUp, Lightbulb, Compass, Award, ShieldCheck, ChevronDown } from "lucide-react";

const cityAppreciation: Record<string, number> = {
  Bangalore: 12,
  Mysore: 10,
  Hubli: 8,
  Tumkur: 9,
};

const cityInsights: Record<string, string> = {
  Bangalore: "Bangalore's tech corridors (East/South) are witnessing rapid expansion. Plots in outer areas (e.g., Devanahalli, Sarjapur) yield maximum returns due to upcoming metro/highway connectivity.",
  Mysore: "Mysore is a preferred clean-city destination for IT satellites and premium residential projects. High-quality layouts here offer stable, low-risk appreciation with lower entry costs.",
  Hubli: "Hubli-Dharwad is a primary logistics and educational hub in North Karnataka. A holding period of 5+ years is advised to leverage new industrial corridor growth.",
  Tumkur: "Tumkur is part of the Chennai-Bangalore Industrial Corridor. Plot prices here are highly affordable, making it a hotbed for long-term land banking with high multipliers.",
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
    <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-card-hover max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Inputs, Triggers & Suggestions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center gap-2 text-gold font-semibold text-sm uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Live ROI Estimator
          </div>
          <div>
            <h3 className="font-display text-3xl">Plot ROI Calculator</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Estimate the potential appreciation of your land investment compared to traditional investment options like Fixed Deposits (FD) and Gold.
            </p>
          </div>

          <div className="space-y-6 pt-2">
            {/* Initial Budget Input */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <label className="text-foreground">Initial Budget</label>
                <span className="text-gold font-bold">{budget} Lakh</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="1"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-gold focus:outline-none"
              />
              {/* Presets Triggers for Budget */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase mr-1">Presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[5, 15, 30, 50, 100].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setBudget(val)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                        budget === val
                          ? "bg-gold text-gold-foreground border-gold shadow-md shadow-gold/20"
                          : "bg-background hover:bg-secondary text-muted-foreground border-border hover:border-gold/30 hover:text-foreground"
                      }`}
                    >
                      ₹{val}L
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Target Location / City Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold">Target Location / City</label>
              <div className="relative">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background hover:bg-secondary/40 border border-border focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none transition text-sm font-semibold text-foreground cursor-pointer appearance-none pr-10"
                >
                  {Object.keys(cityAppreciation).map((c) => (
                    <option key={c} value={c} className="bg-card text-foreground font-medium">
                      {c} (Avg {cityAppreciation[c]}% p.a.)
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold pointer-events-none" />
              </div>
              {/* Presets Triggers for City */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase mr-1">Locations:</span>
                <div className="flex flex-wrap gap-1.5">
                  {Object.keys(cityAppreciation).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCity(c)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                        city === c
                          ? "bg-gold text-gold-foreground border-gold shadow-md shadow-gold/20"
                          : "bg-background hover:bg-secondary text-muted-foreground border-border hover:border-gold/30 hover:text-foreground"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Holding Period Input */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <label className="text-foreground">Holding Period</label>
                <span className="text-gold font-bold">{years} {years === 1 ? "Year" : "Years"}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-gold focus:outline-none"
              />
              {/* Presets Triggers for Years */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase mr-1">Duration:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[1, 3, 5, 8, 10].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setYears(val)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                        years === val
                          ? "bg-gold text-gold-foreground border-gold shadow-md shadow-gold/20"
                          : "bg-background hover:bg-secondary text-muted-foreground border-border hover:border-gold/30 hover:text-foreground"
                      }`}
                    >
                      {val} {val === 1 ? "Yr" : "Yrs"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Suggestions & Advice Box (moved here to balance white space) */}
          <div className="bg-gradient-to-br from-card to-secondary/30 border border-gold/25 rounded-2xl p-5 space-y-4 shadow-sm pt-6 border-t border-border/40">
            <div className="flex items-center gap-2 text-gold font-semibold text-sm">
              <Lightbulb className="w-4 h-4" />
              <span>Smart Investment Suggestions</span>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Financial Outperformance Suggestion */}
              <div className="flex gap-2.5 leading-relaxed">
                <Award className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block mb-0.5">Plot Outperformance Benefit</strong>
                  <span className="text-muted-foreground">
                    Investing in a <span className="font-semibold text-foreground">{city}</span> plot beats Fixed Deposit by{" "}
                    <span className="font-semibold text-emerald-500">{formatCurrency(extraProfitFD)}</span> and outpaces Gold returns by{" "}
                    <span className="font-semibold text-emerald-500">{formatCurrency(extraProfitGold)}</span>.
                  </span>
                </div>
              </div>

              {/* City Market Suggestion */}
              <div className="flex gap-2.5 leading-relaxed border-t border-border/60 pt-3">
                <Compass className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block mb-0.5">{city} Market Outlook</strong>
                  <span className="text-muted-foreground">{cityInsights[city]}</span>
                </div>
              </div>

              {/* Holding Period Suggestion */}
              <div className="flex gap-2.5 leading-relaxed border-t border-border/60 pt-3">
                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block mb-0.5">Holding Period Strategy ({years} {years === 1 ? "Year" : "Years"})</strong>
                  <span className="text-muted-foreground">{getPeriodSuggestion(years)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Outputs & Chart */}
        <div className="lg:col-span-6 space-y-6 h-full flex flex-col justify-between">
          {/* Main Return Output Box */}
          <div className="bg-secondary/40 border border-border rounded-2xl p-6 space-y-6">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Estimated Future Value</div>
              <div className="font-display text-4xl md:text-5xl text-gold font-bold mt-1 tracking-tight">
                {formatCurrency(futureValuePlot)}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                <TrendingUp className="w-3.5 h-3.5 animate-bounce" />
                <span>
                  Net growth of {formatCurrency(futureValuePlot - budget)} in {years} years ({rate}% p.a.)
                </span>
              </div>
            </div>

            {/* Visual Comparison Chart */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Comparison after {years} years</h4>
              
              <div className="space-y-4">
                {/* Plot */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-gold inline-block"></span>
                      Land Plot ({city} @ {rate}%)
                    </span>
                    <span className="font-bold text-gold">{formatCurrency(futureValuePlot)}</span>
                  </div>
                  <div className="h-7 w-full bg-secondary/80 rounded-md overflow-hidden flex items-center">
                    <div
                      style={{ width: `${getWidthPercent(futureValuePlot)}%` }}
                      className="h-full gold-gradient rounded-md transition-all duration-500 relative flex items-center px-3 min-w-[40px]"
                    >
                      <span className="text-[10px] font-bold text-gold-foreground truncate">Plot Yield</span>
                    </div>
                  </div>
                </div>

                {/* Gold */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                      Gold Investment (@ 9%)
                    </span>
                    <span className="text-foreground">{formatCurrency(futureValueGold)}</span>
                  </div>
                  <div className="h-7 w-full bg-secondary/80 rounded-md overflow-hidden flex items-center">
                    <div
                      style={{ width: `${getWidthPercent(futureValueGold)}%` }}
                      className="h-full bg-amber-600/70 rounded-md transition-all duration-500 flex items-center px-3 min-w-[40px]"
                    >
                      <span className="text-[10px] font-bold text-white truncate">Gold</span>
                    </div>
                  </div>
                </div>

                {/* FD */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span>
                      Fixed Deposit (FD @ 7%)
                    </span>
                    <span className="text-foreground">{formatCurrency(futureValueFD)}</span>
                  </div>
                  <div className="h-7 w-full bg-secondary/80 rounded-md overflow-hidden flex items-center">
                    <div
                      style={{ width: `${getWidthPercent(futureValueFD)}%` }}
                      className="h-full bg-slate-500/60 rounded-md transition-all duration-500 flex items-center px-3 min-w-[40px]"
                    >
                      <span className="text-[10px] font-bold text-white truncate">FD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="flex gap-1.5 text-[10px] text-muted-foreground leading-normal bg-secondary/20 p-3 rounded-xl border border-border/40">
              <Info className="w-3.5 h-3.5 shrink-0 text-gold mt-0.5" />
              <span>
                Disclaimer: Appreciation rates are historical averages and are not guaranteed. Land appreciation depends heavily on site development, location access, clear titles, and local zoning laws.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
