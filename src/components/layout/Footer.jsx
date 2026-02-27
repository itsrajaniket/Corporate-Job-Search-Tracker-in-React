import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-stone-200 pt-10 pb-6 relative overflow-hidden mt-8">
      {/* Subtle background flair */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-stone-200 to-transparent"></div>

      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-center">
          {/* LEFT COLUMN: Brand & Connect */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
                <i className="fas fa-anchor text-white text-[10px]"></i>
              </div>
              <span className="font-display font-black text-slate-800 tracking-tight text-xl">
                90-Day Anchor
              </span>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed max-w-sm font-medium mb-5">
              The ultimate corporate job search tracker. Manage applications and
              calculate your notice period with precision.
            </p>

            <ul className="flex gap-3">
              <li>
                <a
                  href="https://www.linkedin.com/in/itsaniketraj/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm hover:-translate-y-0.5 text-sm"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/itsrajaniket"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-500 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-100 transition-all shadow-sm hover:-translate-y-0.5 text-sm"
                >
                  <i className="fab fa-github"></i>
                </a>
              </li>
            </ul>
          </div>

          {/* RIGHT COLUMN: The Compact Form */}
          <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-lg shadow-stone-200/40 relative">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
              Get in Touch
            </h3>

            <form
              action="https://formsubmit.co/aniketrajid@gmail.com"
              method="POST"
              className="space-y-3 relative z-10"
            >
              <input
                type="hidden"
                name="_subject"
                value="New Portfolio Submission!"
              />
              <input type="hidden" name="_captcha" value="false" />
              {/* <input
                type="hidden"
                name="_next"
                value="https://yourusername.github.io/your-repo/#contact"
              /> */}

              <div className="grid grid-cols-2 gap-3">
                {/* Name Input */}
                <div className="relative group">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder=" "
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all peer"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-3 top-2.5 text-stone-400 transition-all peer-focus:-top-2 peer-focus:text-[9px] peer-focus:font-bold peer-focus:text-amber-600 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:text-stone-500 bg-white px-1 text-xs"
                  >
                    Name
                  </label>
                </div>

                {/* Email Input */}
                <div className="relative group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder=" "
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all peer"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-3 top-2.5 text-stone-400 transition-all peer-focus:-top-2 peer-focus:text-[9px] peer-focus:font-bold peer-focus:text-amber-600 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:text-stone-500 bg-white px-1 text-xs"
                  >
                    Email
                  </label>
                </div>
              </div>

              {/* Message Input */}
              <div className="relative group">
                <textarea
                  id="message"
                  name="message"
                  rows="2"
                  required
                  placeholder=" "
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all peer resize-none"
                ></textarea>
                <label
                  htmlFor="message"
                  className="absolute left-3 top-2.5 text-stone-400 transition-all peer-focus:-top-2 peer-focus:text-[9px] peer-focus:font-bold peer-focus:text-amber-600 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:text-stone-500 bg-white px-1 text-xs"
                >
                  Message / Feedback
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-lg hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Send Message <i className="fas fa-paper-plane text-[10px]"></i>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-4 border-t border-stone-100 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <div className="font-medium flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} 90-Day Anchor.</span>
            <span className="hidden md:inline-block w-1 h-1 rounded-full bg-stone-300"></span>
            <span className="hidden md:inline">
              Data is saved locally by default.
            </span>
          </div>

          <div className="font-medium">
            Built by{" "}
            <a
              href="https://yourportfolio.com"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-slate-700 hover:text-amber-600 transition-colors border-b border-transparent hover:border-amber-600 pb-0.5"
            >
              Aniket Raj
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
