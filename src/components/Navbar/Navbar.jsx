import { useRef, useState, useEffect } from "react";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { MdArrowOutward } from "react-icons/md";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import AnimateBtn from "../Buttons/AnimateBtn";
import "./navbar.css";

gsap.registerPlugin(SplitText, ScrollSmoother);

const LINKS = [
  { label: "Home", target: "#home" },
  { label: "Capsules", target: "#capsules" },
  { label: "Gallery", target: "#gallery" },
  { label: "Activities", target: "#activities" },
  { label: "Reviews", target: "#reviews" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const container = useRef(null);
  const tl = useRef(null);

  useGSAP(
    () => {
      // Split every big link + every meta line into masked lines
      const linkSplit = SplitText.create(".menu-link-text", {
        type: "lines",
        mask: "lines",
      });
      const metaSplit = SplitText.create(".menu-meta-item", {
        type: "lines",
        mask: "lines",
      });

      // Slow endless spin for the decorative asterisk
      gsap.to(".menu-star-inner", {
        rotate: 360,
        duration: 18,
        repeat: -1,
        ease: "none",
      });

      gsap.set(".menu-overlay", {
        clipPath: "inset(100% 0% 0% 0% round 48px 48px 0px 0px)",
      });

      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .set(".menu-overlay", { autoAlpha: 1 }, 0)
        .to(
          ".menu-overlay",
          {
            clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)",
            duration: 1.1,
            ease: "expo.inOut",
          },
          0
        )
        .from(
          ".menu-star",
          { yPercent: 40, autoAlpha: 0, duration: 1.4 },
          0.55
        )
        .from(
          linkSplit.lines,
          { yPercent: 120, rotate: 5, duration: 1.2, stagger: 0.075 },
          0.42
        )
        .from(
          ".menu-index",
          { yPercent: 200, autoAlpha: 0, duration: 0.9, stagger: 0.075 },
          0.52
        )
        .from(
          metaSplit.lines,
          { yPercent: 130, duration: 1, stagger: 0.045 },
          0.62
        )
        .from(
          ".menu-rule",
          { scaleX: 0, transformOrigin: "left center", duration: 1.1 },
          0.6
        );
    },
    { scope: container }
  );

  const setMenu = (next) => {
    setOpen(next);
    const t = tl.current;
    if (!t) return;
    if (next) t.timeScale(1).play();
    else t.timeScale(1.5).reverse();
    ScrollSmoother.get()?.paused(next);
    document.body.style.overflow = next ? "hidden" : "";
  };

  const toggle = () => setMenu(!open);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && open && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const go = (target) => (e) => {
    e.preventDefault();
    setMenu(false);
    gsap.delayedCall(0.35, () => {
      const smoother = ScrollSmoother.get();
      if (smoother) smoother.scrollTo(target, true, "top top");
      else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    });
  };

  return (
    <div ref={container}>
      {/* ---------- Fullscreen menu overlay ---------- */}
      <div className="menu-overlay">
        <div className="menu-star" aria-hidden="true">
          <span className="menu-star-inner">*</span>
        </div>

        <div className="menu-inner">
          <div className="menu-top">
            <p className="menu-meta-item menu-label">Navigation</p>
            <p className="menu-meta-item menu-label">Capsule&reg; &copy;2025</p>
          </div>

          <nav className="menu-links">
            {LINKS.map((l, i) => (
              <a
                key={l.label}
                href={l.target}
                className="menu-link"
                onClick={go(l.target)}
              >
                <span className="menu-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="menu-link-text">{l.label}</span>
                <MdArrowOutward className="menu-link-arrow" />
              </a>
            ))}
          </nav>

          <div className="menu-bottom">
            <div className="menu-rule" aria-hidden="true"></div>
            <div className="menu-bottom-cols">
              <div className="menu-col">
                <p className="menu-meta-item menu-label">Location</p>
                <p className="menu-meta-item">Zakopane, Poland</p>
              </div>
              <div className="menu-col">
                <p className="menu-meta-item menu-label">Socials</p>
                <p className="menu-meta-item">Instagram &mdash; Facebook &mdash; X</p>
              </div>
              <div className="menu-col menu-col-right">
                <p className="menu-meta-item menu-label">Reservation</p>
                <p className="menu-meta-item">book@capsule.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Pill button ---------- */}
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={toggle}
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 w-fit h-10 p-1 flex items-center justify-end gap-2 rounded-4xl z-50 cursor-pointer group transition-colors duration-500 ${
          open ? "bg-[#2a2725]" : "bg-[#f4efe7]"
        }`}
      >
        <div>
          <div
            className={`pl-4 transition-colors duration-500 ${
              open ? "text-[#f4efe7]" : "text-[#2a2725]"
            }`}
          >
            <AnimateBtn btnName={open ? "Close" : "Menu"} />
          </div>
        </div>
        <div
          className={`rounded-full p-2 transition-colors duration-500 ${
            open ? "bg-[#f4efe7]" : "bg-[#2a2725]"
          }`}
        >
          <span className="relative block h-4 w-4">
            <IoMdMenu
              className={`absolute inset-0 h-full w-full transition-all duration-500 ${
                open
                  ? "opacity-0 rotate-180 scale-50 text-[#2a2725]"
                  : "opacity-100 rotate-0 text-[#b1a696] group-hover:rotate-[360deg]"
              }`}
            />
            <IoMdClose
              className={`absolute inset-0 h-full w-full transition-all duration-500 ${
                open
                  ? "opacity-100 rotate-0 text-[#2a2725]"
                  : "opacity-0 -rotate-180 scale-50 text-[#b1a696]"
              }`}
            />
          </span>
        </div>
      </button>
    </div>
  );
};

export default Navbar;
