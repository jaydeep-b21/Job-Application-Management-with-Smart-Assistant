import React from "react";

const emojis = [
  "Apple", "🍎", "Google", "🔍", "Microsoft", "🧑‍💻", "Amazon", "📦", "Meta", "🌐", 
  "IBM", "💾", "Samsung", "📱", "Intel", "💡", "Sony", "🎮", "Nvidia", "🎨", 
  "Oracle", "📊", "Siemens", "🏭", "Dell", "💻", "HP", "🖨️", "Cisco", "📡", 
  "SAP", "📈", "Accenture", "🧠", "Adobe", "🖌️", "Qualcomm", "📶", "TCS", "🧑‍💼", 
  "Infosys", "🧾", "Capgemini", "🚀", "Wipro", "🔧", "Salesforce", "☁️", "Uber", "🚗"
];

const ScrollingEmoji = () => {
  return (
    <div className="scrolling-emojis">
      <div className="emoji-strip scroll-left">
        {[...Array(10)]
          .flatMap(() => emojis)
          .map((emoji, i) => (
            <span key={i} className="emoji">
              {emoji}
            </span>
          ))}
      </div>

      <style>{`
        .scrolling-emojis {
          overflow: hidden;
          background: #fef4ffff;
          border-radius: 12px;
          margin-bottom: 15px;
          user-select: none;
          height: 30px;           
          line-height: 30px;      
          padding: 0 8px;          
        }
        .emoji-strip {
          display: inline-block;
          white-space: nowrap;
          font-size: 16px;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-duration: 40s;
          vertical-align: middle;
        }
        .emoji {
          margin: 0 6px;
          display: inline-block;
          line-height: 25px;
        }
        .scroll-left {
          animation-name: scrollLeft;
        }
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default ScrollingEmoji;
