'use client'

import React, { useState, useEffect } from 'react'

interface GroupWrapperProps {
  className?: string
}

// Chart data with accurate values based on Figma design
const CHART_DATA = {
  maxValue: 400,
  bars: [
    { label: 'Ad view', value: 385, color: '#76a0d3' }, // Light blue
    { label: 'Email Open', value: 200, color: '#71b6a5' }, // Light green
    { label: 'Website Visit', value: 125, color: '#e6c14b' }, // Light orange/yellow
    { label: 'Product Demo', value: 95, color: '#c8a2e2' }, // Light purple
    { label: 'Purchase', value: 65, color: '#c88b74' }, // Light brown/pink
  ],
  yAxisLabels: [400, 300, 200, 100, 0],
}

export const GroupWrapper: React.FC<GroupWrapperProps> = ({ className }) => {
  const [showSection1, setShowSection1] = useState(false)
  const [showSection2, setShowSection2] = useState(false)
  const [showSection3, setShowSection3] = useState(false)

  useEffect(() => {
    // Section 1 appears immediately
    const timer1 = setTimeout(() => setShowSection1(true), 100)
    
    // Section 2 appears after 1 second
    const timer2 = setTimeout(() => setShowSection2(true), 1100)
    
    // Section 3 appears after 2 seconds
    const timer3 = setTimeout(() => setShowSection3(true), 2100)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  // Calculate bar heights as percentage of chart height
  const getBarHeight = (value: number, chartHeight: number) => {
    return (value / CHART_DATA.maxValue) * chartHeight
  }

  return (
    <div className={`flex flex-col w-full min-h-[280px] sm:min-h-[400px] lg:h-[854px] items-start gap-2.5 py-3 sm:py-6 md:py-8 lg:py-[235px] bg-tokens-color-surface-surface-tertiary rounded-[13px] ${className}`}>
      {/* Mobile/Tablet Version (CSS-based chart) - Hidden on lg screens */}
      <div className="relative w-full max-w-[260px] sm:max-w-[350px] md:max-w-[380px] lg:hidden h-[240px] sm:h-[320px] md:h-[350px] mx-auto px-2 sm:px-4">
        <div className="relative w-full h-full">
          {/* Section 1 - First Message Bubble (Light Purple) */}
          <div className={`absolute w-[92%] sm:w-[96%] md:w-[97%] top-0 left-0 transition-all duration-700 ease-out transform ${
            showSection1 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-4 scale-95'
          }`}>
            <div className="relative w-full h-[42px] sm:h-[50px] md:h-[54px] bg-[#f3e8ff] rounded-[9.36px] shadow-[0px_3.74px_3.74px_rgba(209,173,249,0.2)] p-2 sm:p-3">
              <img
                className="absolute w-[22px] sm:w-[26px] md:w-[30px] h-[22px] sm:h-[26px] md:h-[30px] top-[6px] sm:top-[8px] md:top-[9px] left-2 sm:left-3 object-cover rounded-full"
                alt="User avatar"
                src="/img/ellipse-27.png"
              />
              <p className="absolute top-[6px] sm:top-[9px] md:top-[10px] left-[28px] sm:left-[38px] md:left-[42px] right-2 sm:right-3 font-SF-Pro font-medium text-black text-[9px] sm:text-[11px] md:text-[12px] tracking-[0] leading-[1.3]">
                There's a problem in our sales funnel. I'm
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>Thinking its a leak in our pipeline
              </p>
            </div>
          </div>

          {/* Section 2 - Second Message Bubble (Lighter/Almost White) */}
          <div className={`absolute w-[75%] sm:w-[82%] md:w-[85%] top-[48px] sm:top-[58px] md:top-[62px] left-[2%] sm:left-[3%] md:left-[3.5%] transition-all duration-700 ease-out transform ${
            showSection2 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-6 scale-95'
          }`}>
            <div className="relative w-full h-[32px] sm:h-[36px] md:h-[38px] bg-[#fafafa] rounded-[5.62px] shadow-[0px_3.74px_3.74px_rgba(209,173,249,0.2)] p-2 sm:p-3">
              <p className="absolute top-[6px] sm:top-[8px] md:top-[9px] left-2 sm:left-3 font-SF-Pro font-normal text-black text-[9px] sm:text-[11px] md:text-[12px] tracking-[0] leading-[1.3]">
                Yes, lets start dig in starting with graph.
              </p>
            </div>
          </div>

          {/* Section 3 - Sales Funnel Chart */}
          <div className={`absolute w-[88%] sm:w-[92%] md:w-[94%] top-[88px] sm:top-[102px] md:top-[108px] left-[4%] sm:left-[6%] md:left-[7%] transition-all duration-700 ease-out transform ${
            showSection3 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-8 scale-95'
          }`}>
            <div className="relative w-full h-[140px] sm:h-[200px] md:h-[240px] bg-white rounded-[6.55px] shadow-[0px_3.74px_3.74px_rgba(209,173,249,0.2)] p-3 sm:p-4 md:p-5">
              {/* Chart Title */}
              <div className="absolute top-[12px] sm:top-[18px] md:top-[22px] left-[12px] sm:left-[16px] md:left-[20px] font-SF-Pro font-medium text-black text-[10px] sm:text-xs md:text-sm tracking-[0] leading-[normal]">
                Sales Funnel
              </div>

              {/* Chart Container */}
              <div className="absolute top-[48px] sm:top-[60px] md:top-[70px] left-[12px] sm:left-[18px] md:left-[24px] right-[12px] sm:right-[18px] md:right-[24px] bottom-[32px] sm:bottom-[40px] md:bottom-[44px]">
                {/* Y-Axis Labels */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  {CHART_DATA.yAxisLabels.map((label, index) => (
                    <div
                      key={label}
                      className="absolute font-SF-Pro font-medium text-black text-[8px] sm:text-[10px] md:text-[11px] tracking-[0] leading-[normal]"
                      style={{
                        top: `${(index / (CHART_DATA.yAxisLabels.length - 1)) * 100}%`,
                        transform: 'translateY(-50%)',
                        left: '0',
                      }}
                    >
                      {label}
                    </div>
                  ))}
                </div>

                {/* Chart Grid and Bars Container */}
                <div className="absolute left-[20px] sm:left-[28px] md:left-[32px] right-0 top-0 bottom-0">
                  {/* Grid Lines - Horizontal (thin, light gray) */}
                  <div className="absolute inset-0 flex flex-col justify-between">
                    {CHART_DATA.yAxisLabels.map((_, index) => (
                      <div
                        key={`grid-h-${index}`}
                        className="w-full"
                        style={{
                          borderTop: '1px solid #e5e7eb',
                          height: '1px',
                        }}
                      />
                    ))}
                  </div>

                  {/* Y-Axis Tick Marks */}
                  <div className="absolute left-0 top-0 bottom-0 w-[5px] flex flex-col justify-between pointer-events-none">
                    {CHART_DATA.yAxisLabels.map((_, index) => (
                      <div
                        key={`tick-${index}`}
                        className="w-[5px] h-[1px] bg-black"
                        style={{
                          marginTop: index === 0 ? '0' : 'auto',
                          marginBottom: index === CHART_DATA.yAxisLabels.length - 1 ? '0' : 'auto',
                        }}
                      />
                    ))}
                  </div>

                  {/* Chart Bars */}
                  <div className="absolute inset-0 flex items-end justify-between gap-[2px] sm:gap-1.5 md:gap-2 px-[2px] sm:px-1.5 md:px-2">
                    {CHART_DATA.bars.map((bar, index) => {
                      const chartHeight = 100 // Percentage-based height
                      const barHeightPercent = getBarHeight(bar.value, chartHeight)
                      
                      return (
                        <div
                          key={bar.label}
                          className="flex flex-col items-center justify-end flex-1 relative"
                          style={{
                            height: '100%',
                            minWidth: '0',
                          }}
                        >
                          {/* Bar with rounded top corners only */}
                          <div
                            className="w-full transition-all duration-500 ease-out"
                            style={{
                              height: `${barHeightPercent}%`,
                              backgroundColor: bar.color,
                              minHeight: '4px',
                              borderRadius: '4.68px 4.68px 0 0',
                              width: '100%',
                              animation: showSection3 ? 'barGrow 0.8s ease-out forwards' : 'none',
                              animationDelay: `${2.1 + index * 0.1}s`,
                            }}
                          />
                        </div>
                      )
                    })}
                  </div>

                  {/* X-Axis Labels */}
                  <div className="absolute -bottom-[28px] sm:-bottom-[36px] md:-bottom-[40px] left-0 right-0 flex justify-between items-start">
                    {CHART_DATA.bars.map((bar, index) => {
                      const isMultiLine = bar.label.includes(' ') || bar.label === 'Email Open' || bar.label === 'Website Visit' || bar.label === 'Product Demo'
                      const labelParts = bar.label.split(' ')
                      
                      return (
                        <div
                          key={`label-${bar.label}`}
                          className="flex flex-col items-center font-SF-Pro font-medium text-black text-[7px] sm:text-[9px] md:text-[10px] tracking-[0] leading-[1.2] text-center"
                          style={{
                            width: `${100 / CHART_DATA.bars.length}%`,
                          }}
                        >
                          {isMultiLine && labelParts.length > 1 ? (
                            <>
                              <span>{labelParts[0]}</span>
                              <span>{labelParts.slice(1).join(' ')}</span>
                            </>
                          ) : (
                            <span className="whitespace-nowrap">{bar.label}</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Right Y-Axis Line */}
                <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-black" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Version (SVG-based chart) - Only visible on lg screens */}
      <div className="hidden lg:block relative w-full max-w-[402.44px] h-[365px] mx-auto">
        <div className="absolute w-full max-w-[424px] h-[298px] top-[67px] left-0">
          {/* Section 3 */}
          <div className={`absolute w-full max-w-[388px] h-[275px] top-[22px] left-9 transition-all duration-700 ease-out transform ${
            showSection3 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-8 scale-95'
          }`}>
            <div className="relative w-full max-w-[366px] h-[275px] bg-white rounded-[6.55px] shadow-[0px_3.74px_3.74px_#d1adf933]">
              <div className="absolute top-[38px] left-[29px] font-SF-Pro font-medium text-black text-sm tracking-[0] leading-[normal]">
                Sales Funnel
              </div>

              <div className="absolute w-[280px] h-[138px] top-[95px] left-[41px]">
                <img
                  className="absolute w-[277px] h-px top-0 left-1"
                  alt="Vector"
                  src="/img/vector-36.svg"
                />

                <img
                  className="absolute w-[277px] h-px top-[34px] left-1"
                  alt="Vector"
                  src="/img/vector-37.svg"
                />

                <img
                  className="absolute w-[277px] h-px top-[69px] left-1"
                  alt="Vector"
                  src="/img/vector-38.svg"
                />

                <img
                  className="absolute w-[277px] h-px top-[103px] left-1"
                  alt="Vector"
                  src="/img/vector-39.svg"
                />

                <img
                  className="absolute w-[277px] h-px top-[137px] left-1"
                  alt="Vector"
                  src="/img/vector-40.svg"
                />

                <img
                  className="absolute w-px h-[138px] top-0 left-[3px]"
                  alt="Vector"
                  src="/img/vector-37-1.svg"
                />

                <img
                  className="absolute w-px h-[138px] top-0 left-[49px]"
                  alt="Vector"
                  src="/img/vector-46.svg"
                />

                <img
                  className="absolute w-px h-[138px] top-0 left-24"
                  alt="Vector"
                  src="/img/vector-47.svg"
                />

                <img
                  className="absolute w-px h-[138px] top-0 left-[143px]"
                  alt="Vector"
                  src="/img/vector-48.svg"
                />

                <img
                  className="absolute w-px h-[138px] top-0 left-[190px]"
                  alt="Vector"
                  src="/img/vector-49.svg"
                />

                <img
                  className="absolute w-px h-[138px] top-0 left-[237px]"
                  alt="Vector"
                  src="/img/vector-50.svg"
                />

                <img
                  className="absolute w-[5px] h-px top-0 left-0"
                  alt="Vector"
                  src="/img/vector-41.svg"
                />

                <img
                  className="absolute w-[5px] h-px top-[34px] left-0"
                  alt="Vector"
                  src="/img/vector-42.svg"
                />

                <img
                  className="absolute w-[5px] h-px top-[68px] left-0"
                  alt="Vector"
                  src="/img/vector-43.svg"
                />

                <img
                  className="absolute w-[5px] h-px top-[102px] left-0"
                  alt="Vector"
                  src="/img/vector-44.svg"
                />

                <img
                  className="absolute w-[5px] h-px top-[137px] left-0"
                  alt="Vector"
                  src="/img/vector-45.svg"
                />

                <div className="h-[137px] top-px left-2.5 bg-[#76a0d3] absolute w-9 rounded-[4.68px]" />

                <div className="h-[69px] top-[68px] left-[60px] bg-[#71b6a5] absolute w-9 rounded-[4.68px]" />

                <div className="h-12 top-[90px] left-28 bg-[#e6c14b] absolute w-9 rounded-[4.68px]" />

                <div className="h-[35px] top-[103px] left-[165px] bg-[#c8a2e2] absolute w-9 rounded-[4.68px]" />

                <div className="h-[22px] top-[115px] left-[219px] bg-[#c88b74] absolute w-9 rounded-[4.68px]" />
              </div>

              <img
                className="absolute w-px h-[138px] top-[95px] left-[322px]"
                alt="Vector"
                src="/img/vector-36-1.svg"
              />

              <div className="absolute top-[87px] left-[13px] font-SF-Pro font-medium text-black text-[12.2px] tracking-[0] leading-[normal]">
                400
              </div>

              <div className="top-[120px] left-[13px] absolute font-SF-Pro font-medium text-black text-[12.2px] tracking-[0] leading-[normal]">
                300
              </div>

              <div className="top-[155px] left-[13px] absolute font-SF-Pro font-medium text-black text-[12.2px] tracking-[0] leading-[normal]">
                200
              </div>

              <div className="top-[190px] left-[13px] absolute font-SF-Pro font-medium text-black text-[12.2px] tracking-[0] leading-[normal]">
                100
              </div>

              <div className="top-[222px] left-[27px] absolute font-SF-Pro font-medium text-black text-[12.2px] tracking-[0] leading-[normal]">
                0
              </div>

              <div className="absolute top-[235px] left-[50px] font-SF-Pro font-medium text-black text-[11.2px] tracking-[0] leading-[normal] whitespace-nowrap">
                Ad view
              </div>

              <div className="absolute top-[235px] left-[260px] font-SF-Pro font-medium text-black text-[11.2px] tracking-[0] leading-[normal] whitespace-nowrap">
                Purchase
              </div>

              <div className="absolute top-[235px] left-[109px] font-SF-Pro font-medium text-black text-[11.2px] tracking-[0] leading-[normal]">
                Email
                <br />
                Open
              </div>

              <div className="absolute top-[235px] left-[153px] font-SF-Pro font-medium text-black text-[11.2px] text-center tracking-[0] leading-[normal]">
                Website
                <br />
                Visit
              </div>

              <div className="absolute top-[235px] left-[206px] font-SF-Pro font-medium text-black text-[11.2px] text-center tracking-[0] leading-[normal]">
                Product
                <br />
                Demo
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className={`absolute w-[277px] h-10 top-0 left-0 shadow-[0px_3.74px_3.74px_#d1adf933] transition-all duration-700 ease-out transform ${
            showSection2 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-6 scale-95'
          }`}>
            <div className="relative w-[275px] h-10 bg-white rounded-[5.62px]">
              <p className="absolute top-3 left-1.5 font-SF-Pro font-normal text-black text-sm tracking-[0] leading-[normal]">
                Yes, lets start dig in starting with graph.
              </p>
            </div>
          </div>
        </div>

        {/* Section 1 */}
        <div className={`absolute w-[372px] h-[57px] top-0 left-0 shadow-[0px_3.74px_3.74px_#d1adf933] transition-all duration-700 ease-out transform ${
          showSection1 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-4 scale-95'
        }`}>
          <div className="relative w-[370px] h-[57px] bg-[#fffcfc] rounded-[9.36px]">
            <img
              className="absolute w-[33px] h-[33px] top-[9px] left-2 object-cover"
              alt="Ellipse"
              src="/img/ellipse-27.png"
            />

            <p className="absolute top-[13px] left-[61px] font-SF-Pro font-medium text-black text-[13.1px] tracking-[0] leading-[normal]">
              There's a problem in our sales funnel. I'm
              <br />
              Thinking its a leak in our pipeline
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}