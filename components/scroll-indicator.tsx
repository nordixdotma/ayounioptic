"use client"

export default function ScrollIndicator() {
  return (
    <div className="scroll-indicator">
      <button className="mouse">
        <div className="scroll" />
      </button>

      <style jsx>{`
        .scroll-indicator {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .mouse {
          width: 25px;
          height: 40px;
          border: 1px solid rgba(255, 255, 255, 0.8);
          background-color: transparent;
          border-radius: 20px !important;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: pointer;
        }
        
        .scroll {
          width: 3px;
          height: 10px;
          background-color: rgba(255, 255, 255, 0.8);
          border-radius: 2px !important;
          position: absolute;
          bottom: 9px;
          animation: move_918 1.5s linear infinite;
        }
        
        @keyframes move_918 {
          0% {
            bottom: 9px;
          }
          50% {
            bottom: 5px;
          }
          100% {
            bottom: 9px;
          }
        }
      `}</style>
    </div>
  )
}
