'use client'

import React, { useState, useEffect } from 'react'

interface GroupWrapperProps {
  className?: string
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
  return (
    <div className={`flex flex-col w-full min-h-[300px] sm:min-h-[400px] lg:h-[854px] items-start gap-2.5 py-4 sm:py-8 lg:py-[235px] bg-tokens-color-surface-surface-tertiary rounded-[13px] ${className}`}>
      <div className="relative w-full max-w-[280px] lg:min-w-[350px] sm:max-w-[350px] lg:max-w-[402.44px] h-[250px] sm:h-[300px] lg:h-[365px] mx-auto">
        <div className="absolute w-full max-w-[300px] sm:max-w-[380px] lg:max-w-[424px] h-[200px] sm:h-[250px] lg:h-[298px] top-[40px] sm:top-[50px] lg:top-[67px] left-0">
          {/* Section 3 */}
          <div className={`absolute w-full max-w-[280px] sm:max-w-[350px] lg:max-w-[388px] h-[160px] sm:h-[200px] lg:h-[275px] top-[10px] sm:top-[15px] lg:top-[22px] left-2 sm:left-4 lg:left-9 transition-all duration-700 ease-out transform ${
            showSection3 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-8 scale-95'
          }`}>
            <div className="relative w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[366px] h-[160px] sm:h-[200px] lg:h-[275px] bg-white rounded-[6.55px] shadow-[0px_3.74px_3.74px_#d1adf933]">
              <div className="absolute top-[20px] sm:top-[30px] lg:top-[38px] left-[15px] sm:left-[20px] lg:left-[29px] font-body-primary font-medium text-black text-xs sm:text-sm tracking-[0] leading-[normal]">
                Sales Funnel
              </div>

              <div className="absolute w-[200px] sm:w-[240px] lg:w-[280px] h-[100px] sm:h-[120px] lg:h-[138px] top-[60px] sm:top-[75px] lg:top-[95px] left-[20px] sm:left-[30px] lg:left-[41px]">
                <img
                  className="absolute w-[190px] sm:w-[230px] lg:w-[277px] h-px top-0 left-1"
                  alt="Vector"
                  src="/img/vector-36.svg"
                />

                <img
                  className="absolute w-[190px] sm:w-[230px] lg:w-[277px] h-px top-[20px] sm:top-[25px] lg:top-[34px] left-1"
                  alt="Vector"
                  src="/img/vector-37.svg"
                />

                <img
                  className="absolute w-[190px] sm:w-[230px] lg:w-[277px] h-px top-[40px] sm:top-[50px] lg:top-[69px] left-1"
                  alt="Vector"
                  src="/img/vector-38.svg"
                />

                <img
                  className="absolute w-[190px] sm:w-[230px] lg:w-[277px] h-px top-[60px] sm:top-[75px] lg:top-[103px] left-1"
                  alt="Vector"
                  src="/img/vector-39.svg"
                />

                <img
                  className="absolute w-[190px] sm:w-[230px] lg:w-[277px] h-px top-[80px] sm:top-[100px] lg:top-[137px] left-1"
                  alt="Vector"
                  src="/img/vector-40.svg"
                />

                <img
                  className="absolute w-px h-[80px] sm:h-[100px] lg:h-[138px] top-0 left-[3px]"
                  alt="Vector"
                  src="/img/vector-37-1.svg"
                />

                <img
                  className="absolute w-px h-[80px] sm:h-[100px] lg:h-[138px] top-0 left-[30px] sm:left-[35px] lg:left-[49px]"
                  alt="Vector"
                  src="/img/vector-46.svg"
                />

                <img
                  className="absolute w-px h-[80px] sm:h-[100px] lg:h-[138px] top-0 left-[60px] sm:left-[70px] lg:left-24"
                  alt="Vector"
                  src="/img/vector-47.svg"
                />

                <img
                  className="absolute w-px h-[80px] sm:h-[100px] lg:h-[138px] top-0 left-[90px] sm:left-[110px] lg:left-[143px]"
                  alt="Vector"
                  src="/img/vector-48.svg"
                />

                <img
                  className="absolute w-px h-[80px] sm:h-[100px] lg:h-[138px] top-0 left-[120px] sm:left-[145px] lg:left-[190px]"
                  alt="Vector"
                  src="/img/vector-49.svg"
                />

                <img
                  className="absolute w-px h-[80px] sm:h-[100px] lg:h-[138px] top-0 left-[150px] sm:left-[180px] lg:left-[237px]"
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

                <div className="h-[80px] sm:h-[100px] lg:h-[137px] top-px left-2.5 bg-[#76a0d3] absolute w-6 sm:w-7 lg:w-9 rounded-[4.68px]" />

                <div className="h-[40px] sm:h-[50px] lg:h-[69px] top-[40px] sm:top-[50px] lg:top-[68px] left-[35px] sm:left-[45px] lg:left-[60px] bg-[#71b6a5] absolute w-6 sm:w-7 lg:w-9 rounded-[4.68px]" />

                <div className="h-[25px] sm:h-[30px] lg:h-12 top-[55px] sm:top-[70px] lg:top-[90px] left-[65px] sm:left-[80px] lg:left-28 bg-[#e6c14b] absolute w-6 sm:w-7 lg:w-9 rounded-[4.68px]" />

                <div className="h-[20px] sm:h-[25px] lg:h-[35px] top-[60px] sm:top-[75px] lg:top-[103px] left-[95px] sm:left-[115px] lg:left-[165px] bg-[#c8a2e2] absolute w-6 sm:w-7 lg:w-9 rounded-[4.68px]" />

                <div className="h-[15px] sm:h-[18px] lg:h-[22px] top-[65px] sm:top-[82px] lg:top-[115px] left-[125px] sm:left-[150px] lg:left-[219px] bg-[#c88b74] absolute w-6 sm:w-7 lg:w-9 rounded-[4.68px]" />
              </div>

              <img
                className="absolute w-px h-[138px] top-[95px] left-[322px]"
                alt="Vector"
                src="/img/vector-36-1.svg"
              />

              <div className="absolute top-[50px] sm:top-[65px] lg:top-[87px] left-[8px] sm:left-[10px] lg:left-[13px] font-body-primary font-medium text-black text-[10px] sm:text-[11px] lg:text-[12.2px] tracking-[0] leading-[normal]">
                400
              </div>

              <div className="top-[70px] sm:top-[90px] lg:top-[120px] left-[8px] sm:left-[10px] lg:left-[13px] absolute font-body-primary font-medium text-black text-[10px] sm:text-[11px] lg:text-[12.2px] tracking-[0] leading-[normal]">
                300
              </div>

              <div className="top-[90px] sm:top-[115px] lg:top-[155px] left-[8px] sm:left-[10px] lg:left-[13px] absolute font-body-primary font-medium text-black text-[10px] sm:text-[11px] lg:text-[12.2px] tracking-[0] leading-[normal]">
                200
              </div>

              <div className="top-[110px] sm:top-[140px] lg:top-[190px] left-[8px] sm:left-[10px] lg:left-[13px] absolute font-body-primary font-medium text-black text-[10px] sm:text-[11px] lg:text-[12.2px] tracking-[0] leading-[normal]">
                100
              </div>

              <div className="top-[130px] sm:top-[160px] lg:top-[222px] left-[15px] sm:left-[20px] lg:left-[27px] absolute font-body-primary font-medium text-black text-[10px] sm:text-[11px] lg:text-[12.2px] tracking-[0] leading-[normal]">
                0
              </div>

              <div className="absolute top-[150px] sm:top-[190px] lg:top-[235px] left-[25px] sm:left-[35px] lg:left-[50px] font-body-primary font-medium text-black text-[9px] sm:text-[10px] lg:text-[11.2px] tracking-[0] leading-[normal] whitespace-nowrap">
                Ad view
              </div>

              <div className="absolute top-[150px] sm:top-[190px] lg:top-[235px] left-[160px] sm:left-[200px] lg:left-[260px] font-body-primary font-medium text-black text-[9px] sm:text-[10px] lg:text-[11.2px] tracking-[0] leading-[normal] whitespace-nowrap">
                Purchase
              </div>

              <div className="absolute top-[150px] sm:top-[190px] lg:top-[235px] left-[60px] sm:left-[80px] lg:left-[109px] font-body-primary font-medium text-black text-[9px] sm:text-[10px] lg:text-[11.2px] tracking-[0] leading-[normal]">
                Email
                <br />
                Open
              </div>

              <div className="absolute top-[150px] sm:top-[190px] lg:top-[235px] left-[90px] sm:left-[120px] lg:left-[153px] font-body-primary font-medium text-black text-[9px] sm:text-[10px] lg:text-[11.2px] text-center tracking-[0] leading-[normal]">
                Website
                <br />
                Visit
              </div>

              <div className="absolute top-[150px] sm:top-[190px] lg:top-[235px] left-[125px] sm:left-[160px] lg:left-[206px] font-body-primary font-medium text-black text-[9px] sm:text-[10px] lg:text-[11.2px] text-center tracking-[0] leading-[normal]">
                Product
                <br />
                Demo
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className={`absolute w-[200px] sm:w-[240px] lg:w-[277px] h-8 sm:h-9 lg:h-10 top-0 left-0 shadow-[0px_3.74px_3.74px_#d1adf933] transition-all duration-700 ease-out transform ${
            showSection2 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-6 scale-95'
          }`}>
            <div className="relative w-[190px] sm:w-[230px] lg:w-[275px] h-8 sm:h-9 lg:h-10 bg-white rounded-[5.62px]">
              <p className="absolute top-2 sm:top-2.5 lg:top-3 left-1 sm:left-1.5 font-body-primary font-normal text-black text-xs sm:text-sm tracking-[0] leading-[normal]">
                Yes, lets start dig in starting with graph.
              </p>
            </div>
          </div>
        </div>

        {/* Section 1 */}
        <div className={`absolute w-[250px] sm:w-[320px] lg:w-[372px] h-[45px] sm:h-[50px] lg:h-[57px] top-0 left-0 shadow-[0px_3.74px_3.74px_#d1adf933] transition-all duration-700 ease-out transform ${
          showSection1 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-4 scale-95'
        }`}>
          <div className="relative w-[240px] sm:w-[310px] lg:w-[370px] h-[45px] sm:h-[50px] lg:h-[57px] bg-[#fffcfc] rounded-[9.36px]">
            <img
              className="absolute w-[25px] sm:w-[28px] lg:w-[33px] h-[25px] sm:h-[28px] lg:h-[33px] top-[8px] sm:top-[9px] left-2 object-cover"
              alt="Ellipse"
              src="/img/ellipse-27.png"
            />

            <p className="absolute top-[8px] sm:top-[10px] lg:top-[13px] left-[35px] sm:left-[45px] lg:left-[61px] font-body-primary font-medium text-black text-[10px] sm:text-[11px] lg:text-[13.1px] tracking-[0] leading-[normal]">
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
