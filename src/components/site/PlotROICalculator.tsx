import { useState } from "react";
import { Info, Sparkles, TrendingUp } from "lucide-react";

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
    <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-card-hover max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Inputs */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-gold font-semibold text-sm uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Calculate Appreciation
          </div>
          <h3 className="font-display text-3xl">Plot ROI Calculator</h3>
          <p className="text-sm text-muted-foreground">
            Estimate the potential appreciation of your land investment compared to traditional investment options.
          </p>

          <div className="space-y-4 pt-4">
            <div>
              <div className="flex justify-between text-sm font-semibold mb-2">
                <label className="text-foreground">Initial Budget (₹ Lakh)</label>
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
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>₹5 Lakh</span>
                <span>₹50 Lakh</span>
                <span>₹100 Lakh</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Target Location / City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-background border border-border focus:border-gold focus:ring-2 focus:ring-gold/30 outline-none transition text-sm font-medium"
              >
                {Object.keys(cityAppreciation).map((c) => (
                  <option key={c} value={c}>
                    {c} (Avg {cityAppreciation[c]}% p.a.)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold mb-2">
                <label className="text-foreground">Holding Period (Years)</label>
                <span className="text-gold font-bold">{years} Years</span>
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
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1 Year</span>
                <span>5 Years</span>
                <span>10 Years</span>
              </div>
            </div>
          </div>
        </div>

        {/* Outputs & Chart */}
        <div className="bg-secondary/40 border border-border rounded-xl p-6 space-y-6 flex flex-col justify-between h-full">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Estimated Future Value</div>
            <div className="font-display text-4xl md:text-5xl text-gold font-bold mt-1 tracking-tight">
              {formatCurrency(futureValuePlot)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 mt-2 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>
                Net growth of {formatCurrency(futureValuePlot - budget)} in {years} years ({rate}% p.a.)
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Comparison after {years} years</h4>
            
            {/* Custom Bars */}
            <div className="space-y-3">
              {/* Plot */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Land Plot ({city} @ {rate}%)</span>
                  <span className="font-bold text-gold">{formatCurrency(futureValuePlot)}</span>
                </div>
                <div className="h-6 w-full bg-secondary rounded-md overflow-hidden flex items-center">
                  <div
                    style={{ width: `${getWidthPercent(futureValuePlot)}%` }}
                    className="h-full gold-gradient rounded-md transition-all duration-500 relative flex items-center px-2"
                  >
                    <span className="text-[10px] font-bold text-gold-foreground truncate">Plot Yield</span>
                  </div>
                </div>
              </div>

              {/* Gold */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Gold Investment (@ 9%)</span>
                  <span className="text-foreground">{formatCurrency(futureValueGold)}</span>
                </div>
                <div className="h-6 w-full bg-secondary rounded-md overflow-hidden flex items-center">
                  <div
                    style={{ width: `${getWidthPercent(futureValueGold)}%` }}
                    className="h-full bg-yellow-600/60 rounded-md transition-all duration-500 flex items-center px-2"
                  >
                    <span className="text-[10px] font-bold text-white truncate">Gold</span>
                  </div>
                </div>
              </div>

              {/* FD */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Fixed Deposit (FD @ 7%)</span>
                  <span className="text-foreground">{formatCurrency(futureValueFD)}</span>
                </div>
                <div className="h-6 w-full bg-secondary rounded-md overflow-hidden flex items-center">
                  <div
                    style={{ width: `${getWidthPercent(futureValueFD)}%` }}
                    className="h-full bg-slate-400 rounded-md transition-all duration-500 flex items-center px-2"
                  >
                    <span className="text-[10px] font-bold text-white truncate">Fixed Deposit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="flex gap-1.5 text-[10px] text-muted-foreground mt-4 leading-normal">
            <Info className="w-3.5 h-3.5 shrink-0 text-gold" />
            Disclaimer: Appreciation rates are historical averages and are not guaranteed. Land appreciation depends heavily on site development and location.
          </p>
        </div>
      </div>
    </div>
  );
}
