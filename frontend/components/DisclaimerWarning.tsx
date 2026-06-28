import React from 'react';

export default function DisclaimerWarning() {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 text-sm text-gray-400 border-t border-white/5 bg-[#070B1A]/50">
      <div className="flex flex-col gap-4 max-w-4xl mx-auto text-center md:text-left">
        <p>
          <span className="text-[#F59E0B] font-bold mr-2">⚠ Disclaimer:</span> 
          All calculations are estimates based on historical data and assumed returns. Past performance does not guarantee future results. Investment values may fluctuate, and actual returns can differ significantly.
        </p>
        <p>
          <span className="text-[#00F5A0] font-bold mr-2">💡</span> 
          Think of this as a financial time machine, not a prediction machine. Future returns are never guaranteed.
        </p>
        <p>
          <span className="text-[#F59E0B] font-bold mr-2">⚠</span> 
          Returns shown are hypothetical and based on historical market performance. Investments involve risk, including possible loss of capital. Please consult a qualified financial advisor before making investment decisions.
        </p>
      </div>
    </div>
  );
}
