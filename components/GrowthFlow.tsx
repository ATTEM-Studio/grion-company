import { revenueValve } from "@/content/revenueValve";
import { Reveal } from "./Reveal";

export function GrowthFlow() {
  return (
    <section id="growth-flow" className="rv-section relative scroll-mt-20 overflow-hidden border-b border-line">
      <div className="rv-ambient rv-ambient-a" aria-hidden="true" />
      <div className="rv-ambient rv-ambient-b" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1180px] px-5 py-24 md:px-8 md:py-32">
        <div className="rv-intro grid grid-cols-1 gap-7 md:grid-cols-[1.12fr_.88fr] md:items-end md:gap-16">
          <div>
            <Reveal as="span" className="text-[11px] font-extrabold tracking-[0.2em] text-accent">
              {revenueValve.eyebrow}
            </Reveal>
            <Reveal
              as="h2"
              delayMs={50}
              className="mt-5 text-[34px] font-black leading-[1.13] tracking-[-0.055em] text-ink sm:text-[43px] md:text-[56px]"
            >
              <span className="block">{revenueValve.headline[0]}</span>
              <span className="block text-accent">{revenueValve.headline[1]}</span>
            </Reveal>
          </div>

          <Reveal as="p" delayMs={120} className="max-w-[500px] text-[15px] leading-[1.9] text-ink-soft md:pb-1">
            {revenueValve.lead}
            <span className="mt-3 block font-bold text-ink">
              그래서 그리온은 광고보다 먼저 병목을 찾습니다.
            </span>
          </Reveal>
        </div>

        <Reveal delayMs={170} className="mt-9">
          <div className="rv-formula">
            <span className="rv-formula-label">{revenueValve.formulaLabel}</span>
            <div className="rv-formula-flow">
              {revenueValve.formula.map((item, index) => (
                <span key={item} className="contents">
                  <b>{item}</b>
                  {index < revenueValve.formula.length - 1 ? <i aria-hidden="true">→</i> : null}
                </span>
              ))}
            </div>
            <span className="rv-formula-pressure">객단가 = 수압</span>
          </div>
        </Reveal>

        <div className="rv-canvas mt-14 md:mt-20">
          <svg className="rv-pipeline" viewBox="0 0 1120 620" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="rvPipeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#315BFF" />
                <stop offset="45%" stopColor="#55A6FF" />
                <stop offset="72%" stopColor="#7FD7FF" />
                <stop offset="100%" stopColor="#315BFF" />
              </linearGradient>
              <filter id="rvPipeGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="7" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M 72 345 C 200 345, 240 320, 350 320 S 520 350, 635 338 S 805 272, 1038 275"
              fill="none"
              stroke="rgba(174,193,232,.42)"
              strokeWidth="34"
              strokeLinecap="round"
            />
            <path
              d="M 72 345 C 200 345, 240 320, 350 320 S 520 350, 635 338 S 805 272, 1038 275"
              fill="none"
              stroke="url(#rvPipeGradient)"
              strokeWidth="18"
              strokeLinecap="round"
              filter="url(#rvPipeGlow)"
              className="rv-pipe-core"
            />
            <path
              d="M 72 345 C 200 345, 240 320, 350 320 S 520 350, 635 338 S 805 272, 1038 275"
              fill="none"
              stroke="rgba(255,255,255,.92)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="3 15"
              className="rv-pipe-signal"
            />
          </svg>

          <div className="rv-mobile-pipe" aria-hidden="true"><span /></div>

          {revenueValve.valves.map((valve, index) => {
            const direction = index === 0 || index === 2 ? "down" : "up";
            return (
              <Reveal
                key={valve.no}
                delayMs={230 + index * 90}
                className={`rv-step rv-step-${index + 1} rv-step-${direction}`}
              >
                <div className="rv-step-stack">
                  <div className="rv-valve-wrap" aria-hidden="true">
                    <span className="rv-valve-halo" />
                    <div className="rv-valve-wheel">
                      <span className="rv-valve-bar rv-valve-bar-x" />
                      <span className="rv-valve-bar rv-valve-bar-y" />
                      <span className="rv-valve-center" />
                    </div>
                  </div>

                  <span className="rv-connector" aria-hidden="true" />

                  <article className="rv-card">
                    <div className="rv-card-top">
                      <span className="rv-card-no tnum">{valve.no}</span>
                      <span className="rv-card-label">VALVE</span>
                    </div>
                    <h3>{valve.title}</h3>
                    <strong>{valve.question}</strong>
                    <p>{valve.body}</p>
                    <div className="rv-card-more">
                      <div className="rv-chips">
                        {valve.items.slice(0, 3).map((item) => <span key={item}>{item}</span>)}
                      </div>
                      <small>{valve.principle}</small>
                    </div>
                  </article>
                </div>
              </Reveal>
            );
          })}

          <div className="rv-flow-caption" aria-hidden="true">
            <span />
            CUSTOMER FLOW
          </div>
        </div>

        <Reveal delayMs={600} className="mt-7 md:mt-10">
          <div className="rv-pressure">
            <div className="rv-pressure-glow" aria-hidden="true" />
            <div className="rv-gauge" aria-hidden="true">
              <svg viewBox="0 0 180 180">
                <circle cx="90" cy="90" r="67" className="rv-gauge-track" />
                <path d="M 42 138 A 68 68 0 1 1 138 138" className="rv-gauge-meter" />
                <g className="rv-gauge-needle">
                  <line x1="90" y1="91" x2="132" y2="62" />
                  <circle cx="90" cy="91" r="9" />
                </g>
              </svg>
              <span>PRESSURE</span>
            </div>

            <div className="rv-pressure-copy">
              <span>{revenueValve.pressure.eyebrow}</span>
              <h3>{revenueValve.pressure.title}</h3>
              <strong>{revenueValve.pressure.question}</strong>
              <p>{revenueValve.pressure.body}</p>
              <div className="rv-pressure-chips">
                {revenueValve.pressure.items.map((item) => <span key={item}>{item}</span>)}
              </div>
            </div>

            <div className="rv-pressure-note">
              <span>FLOW FIRST</span>
              <strong>밸브를 먼저 열고</strong>
              <b>그다음 수압을 높입니다.</b>
            </div>
          </div>
        </Reveal>

        <div className="rv-rules mt-8">
          {revenueValve.rules.map((rule, index) => (
            <Reveal key={rule.title} delayMs={660 + index * 70} className="rv-rule">
              <span className="tnum">0{index + 1}</span>
              <div>
                <h3>{rule.title}</h3>
                <p>{rule.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delayMs={900} className="rv-closing mt-14 md:mt-20">
          <span>{revenueValve.closing.lead}</span>
          <strong>{revenueValve.closing.emphasis}</strong>
          <p>{revenueValve.closing.action}</p>
        </Reveal>
      </div>

      <style>{`
        .rv-section{
          background:#f8faff;
          isolation:isolate;
        }
        .rv-section::before{
          content:"";
          position:absolute;
          inset:0;
          z-index:-3;
          background-image:
            linear-gradient(rgba(37,70,155,.035) 1px,transparent 1px),
            linear-gradient(90deg,rgba(37,70,155,.035) 1px,transparent 1px);
          background-size:52px 52px;
          mask-image:linear-gradient(to bottom,rgba(0,0,0,.78),rgba(0,0,0,.18) 72%,transparent);
          pointer-events:none;
        }
        .rv-ambient{
          position:absolute;
          z-index:-2;
          border-radius:999px;
          pointer-events:none;
          filter:blur(10px);
        }
        .rv-ambient-a{
          width:520px;height:520px;right:-190px;top:-120px;
          background:radial-gradient(circle,rgba(49,91,255,.14),rgba(49,91,255,0) 70%);
        }
        .rv-ambient-b{
          width:440px;height:440px;left:-180px;top:420px;
          background:radial-gradient(circle,rgba(127,215,255,.12),rgba(127,215,255,0) 70%);
        }
        .rv-formula{
          display:inline-flex;
          align-items:center;
          gap:14px;
          max-width:100%;
          padding:12px 14px 12px 17px;
          border:1px solid rgba(193,202,230,.8);
          border-radius:999px;
          background:rgba(255,255,255,.78);
          box-shadow:0 18px 46px rgba(25,42,92,.07);
          backdrop-filter:blur(16px);
        }
        .rv-formula-label{font-size:10px;font-weight:900;color:#10122b;white-space:nowrap}
        .rv-formula-flow{display:flex;align-items:center;gap:8px}
        .rv-formula-flow b{
          padding:7px 10px;border-radius:999px;background:#e7ebff;color:#2945e8;
          font-size:10px;font-weight:900;white-space:nowrap;
        }
        .rv-formula-flow i{font-style:normal;color:#9ca5c4;font-size:10px;font-weight:900}
        .rv-formula-pressure{
          padding-left:13px;border-left:1px solid #dfe4f1;color:#66708e;font-size:10px;font-weight:800;white-space:nowrap;
        }
        .rv-canvas{
          position:relative;
          height:660px;
          border:1px solid rgba(207,214,235,.7);
          border-radius:34px;
          background:
            radial-gradient(circle at 55% 47%,rgba(104,164,255,.08),transparent 34%),
            linear-gradient(145deg,rgba(255,255,255,.86),rgba(245,248,255,.66));
          box-shadow:inset 0 1px 0 rgba(255,255,255,.95),0 30px 80px rgba(29,45,92,.07);
          overflow:hidden;
          backdrop-filter:blur(18px);
        }
        .rv-canvas::before{
          content:"";position:absolute;inset:0;
          background:
            linear-gradient(115deg,transparent 0 35%,rgba(255,255,255,.65) 43%,transparent 51%) -280px 0 / 280px 100% no-repeat;
          animation:rvGlassSweep 8s ease-in-out infinite;
          pointer-events:none;
        }
        .rv-pipeline{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
        .rv-pipe-core{filter:drop-shadow(0 8px 14px rgba(49,91,255,.24))}
        .rv-pipe-signal{animation:rvSignal 2.8s linear infinite}
        .rv-mobile-pipe{display:none}
        .rv-flow-caption{
          position:absolute;left:50%;bottom:26px;transform:translateX(-50%);
          display:flex;align-items:center;gap:8px;color:#9aa4c3;font-size:8px;font-weight:900;letter-spacing:.17em;
        }
        .rv-flow-caption span{width:38px;height:1px;background:linear-gradient(90deg,transparent,#315bff)}
        .rv-step{position:absolute;width:245px;z-index:3}
        .rv-step-1{left:1.5%;top:303px}
        .rv-step-2{left:26.6%;top:65px}
        .rv-step-3{left:52%;top:296px}
        .rv-step-4{left:76.6%;top:18px}
        .rv-step-stack{display:flex;flex-direction:column;align-items:center;position:relative}
        .rv-step-up .rv-card{order:1}
        .rv-step-up .rv-connector{order:2}
        .rv-step-up .rv-valve-wrap{order:3}
        .rv-step-down .rv-valve-wrap{order:1}
        .rv-step-down .rv-connector{order:2}
        .rv-step-down .rv-card{order:3}
        .rv-connector{
          width:2px;height:27px;background:linear-gradient(#9eb4ed,#315bff);opacity:.8;
        }
        .rv-valve-wrap{position:relative;width:68px;height:68px;flex:0 0 68px;display:grid;place-items:center}
        .rv-valve-halo{
          position:absolute;inset:-11px;border-radius:50%;border:1px solid rgba(49,91,255,.16);
          box-shadow:0 0 0 0 rgba(49,91,255,.14);animation:rvHalo 3.8s ease-out infinite;
        }
        .rv-valve-wheel{
          position:relative;width:64px;height:64px;border-radius:50%;
          background:linear-gradient(150deg,rgba(255,255,255,.96),rgba(227,235,255,.84));
          border:7px solid #0e163f;
          box-shadow:0 12px 25px rgba(16,27,74,.16),inset 0 0 0 1px rgba(255,255,255,.9);
          transition:transform .5s cubic-bezier(.2,.8,.2,1),box-shadow .35s ease;
          backdrop-filter:blur(10px);
        }
        .rv-valve-bar{position:absolute;left:50%;top:50%;background:#315bff;border-radius:999px;transform:translate(-50%,-50%);box-shadow:0 0 10px rgba(49,91,255,.22)}
        .rv-valve-bar-x{width:36px;height:5px}.rv-valve-bar-y{width:5px;height:36px}
        .rv-valve-center{position:absolute;left:50%;top:50%;width:11px;height:11px;border-radius:50%;background:#10163f;transform:translate(-50%,-50%);box-shadow:0 0 0 4px rgba(49,91,255,.12)}
        .rv-card{
          width:245px;min-height:205px;padding:18px 18px 16px;border:1px solid rgba(204,212,236,.88);border-radius:22px;
          background:linear-gradient(145deg,rgba(255,255,255,.96),rgba(250,252,255,.86));
          box-shadow:0 18px 42px rgba(24,38,83,.08),inset 0 1px 0 rgba(255,255,255,1);
          backdrop-filter:blur(14px);
          transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s ease,border-color .35s ease;
        }
        .rv-step:hover .rv-card{transform:translateY(-8px);border-color:rgba(49,91,255,.36);box-shadow:0 25px 55px rgba(24,42,100,.14),0 0 0 1px rgba(49,91,255,.06)}
        .rv-step:hover .rv-valve-wheel{transform:rotate(22deg) scale(1.06);box-shadow:0 15px 32px rgba(30,50,120,.2),0 0 22px rgba(49,91,255,.16)}
        .rv-card-top{display:flex;align-items:center;justify-content:space-between}
        .rv-card-no{display:grid;place-items:center;width:29px;height:29px;border-radius:999px;background:#e8ecff;color:#315bff;font-size:9px;font-weight:900}
        .rv-card-label{font-size:8px;font-weight:900;letter-spacing:.16em;color:#929bb7}
        .rv-card h3{margin:14px 0 5px;font-size:23px;line-height:1.05;font-weight:950;letter-spacing:-.045em;color:#10122b}
        .rv-card>strong{display:block;font-size:12px;line-height:1.55;color:#232846}
        .rv-card>p{margin:10px 0 0;font-size:11.5px;line-height:1.7;color:#6a708a}
        .rv-card-more{margin-top:13px;padding-top:12px;border-top:1px solid #e6e9f2}
        .rv-chips{display:flex;flex-wrap:wrap;gap:5px;max-height:0;opacity:0;overflow:hidden;transform:translateY(4px);transition:max-height .35s ease,opacity .3s ease,transform .35s ease}
        .rv-step:hover .rv-chips{max-height:45px;opacity:1;transform:translateY(0)}
        .rv-chips span{padding:5px 7px;border-radius:999px;background:#f0f3fb;color:#68708b;font-size:8.5px;font-weight:800}
        .rv-card-more small{display:block;margin-top:6px;color:#3249d8;font-size:9px;font-weight:800;line-height:1.5}
        .rv-pressure{
          position:relative;display:grid;grid-template-columns:180px minmax(0,1fr) 220px;gap:34px;align-items:center;
          padding:30px 34px;border:1px solid rgba(147,167,255,.22);border-radius:28px;overflow:hidden;
          background:linear-gradient(125deg,#0b1135 0%,#11194a 54%,#17205b 100%);color:#fff;
          box-shadow:0 28px 70px rgba(12,20,60,.18),inset 0 1px 0 rgba(255,255,255,.07);
        }
        .rv-pressure::after{
          content:"";position:absolute;inset:0;pointer-events:none;
          background:linear-gradient(105deg,transparent 0 40%,rgba(255,255,255,.055) 48%,transparent 56%) -320px 0 / 320px 100% no-repeat;
          animation:rvGlassSweep 7s 1.2s ease-in-out infinite;
        }
        .rv-pressure-glow{position:absolute;width:330px;height:330px;left:-80px;top:-80px;border-radius:50%;background:radial-gradient(circle,rgba(65,94,255,.36),transparent 68%);filter:blur(4px);pointer-events:none}
        .rv-gauge{position:relative;z-index:2;width:170px;height:170px;display:grid;place-items:center}
        .rv-gauge svg{width:100%;height:100%;overflow:visible}
        .rv-gauge-track{fill:none;stroke:rgba(255,255,255,.1);stroke-width:14}
        .rv-gauge-meter{fill:none;stroke:#4d67ff;stroke-width:14;stroke-linecap:round;filter:drop-shadow(0 0 10px rgba(77,103,255,.55));stroke-dasharray:265;stroke-dashoffset:265;animation:rvGaugeFill 2s .35s cubic-bezier(.16,1,.3,1) forwards}
        .rv-gauge-needle{transform-origin:90px 91px;transform:rotate(-38deg);animation:rvNeedle 2s .35s cubic-bezier(.16,1,.3,1) forwards}
        .rv-gauge-needle line{stroke:#fff;stroke-width:5;stroke-linecap:round}.rv-gauge-needle circle{fill:#fff;filter:drop-shadow(0 0 8px rgba(255,255,255,.35))}
        .rv-gauge>span{position:absolute;bottom:9px;font-size:7px;font-weight:900;letter-spacing:.18em;color:rgba(255,255,255,.45)}
        .rv-pressure-copy{position:relative;z-index:2}
        .rv-pressure-copy>span{font-size:8px;font-weight:900;letter-spacing:.16em;color:#7287ff}
        .rv-pressure-copy h3{margin:5px 0 4px;font-size:30px;font-weight:950;letter-spacing:-.045em}
        .rv-pressure-copy>strong{font-size:13px}.rv-pressure-copy>p{margin:9px 0 0;max-width:620px;font-size:11.5px;line-height:1.75;color:rgba(255,255,255,.62)}
        .rv-pressure-chips{display:flex;flex-wrap:wrap;gap:5px;margin-top:13px}.rv-pressure-chips span{padding:5px 7px;border-radius:999px;background:rgba(255,255,255,.07);color:rgba(255,255,255,.68);font-size:8.5px;font-weight:800}
        .rv-pressure-note{position:relative;z-index:2;padding:18px;border:1px solid rgba(255,255,255,.09);border-radius:18px;background:rgba(255,255,255,.045);backdrop-filter:blur(12px)}
        .rv-pressure-note span{font-size:7px;font-weight:900;letter-spacing:.17em;color:#7087ff}.rv-pressure-note strong,.rv-pressure-note b{display:block}.rv-pressure-note strong{margin-top:10px;font-size:12px;color:rgba(255,255,255,.68)}.rv-pressure-note b{margin-top:3px;font-size:14px;color:#fff}
        .rv-rules{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
        .rv-rule{display:flex;gap:15px;padding:18px 19px;border-top:1px solid #d9deed;background:rgba(255,255,255,.42)}
        .rv-rule>span{color:#315bff;font-size:9px;font-weight:900}.rv-rule h3{margin:0;font-size:13px;font-weight:900;color:#161a38}.rv-rule p{margin:5px 0 0;font-size:10.5px;line-height:1.65;color:#737a94}
        .rv-closing{text-align:center}.rv-closing>span{font-size:12px;font-weight:750;color:#6f7691}.rv-closing>strong{display:block;margin-top:5px;font-size:clamp(25px,3vw,38px);font-weight:950;letter-spacing:-.05em;color:#111531}.rv-closing>p{margin:9px 0 0;font-size:13px;font-weight:850;color:#315bff}
        @keyframes rvSignal{to{stroke-dashoffset:-72}}
        @keyframes rvHalo{0%{box-shadow:0 0 0 0 rgba(49,91,255,.15);opacity:.8}70%{box-shadow:0 0 0 14px rgba(49,91,255,0);opacity:.15}100%{box-shadow:0 0 0 0 rgba(49,91,255,0);opacity:0}}
        @keyframes rvGlassSweep{0%,22%{background-position:-320px 0}58%,100%{background-position:calc(100% + 320px) 0}}
        @keyframes rvGaugeFill{to{stroke-dashoffset:62}}
        @keyframes rvNeedle{to{transform:rotate(18deg)}}
        @media(max-width:980px){
          .rv-canvas{height:auto;padding:42px 20px 42px 76px;overflow:visible}
          .rv-pipeline,.rv-flow-caption{display:none}
          .rv-mobile-pipe{display:block;position:absolute;left:45px;top:58px;bottom:58px;width:10px;border-radius:999px;background:rgba(180,194,228,.44);overflow:hidden}
          .rv-mobile-pipe span{display:block;width:100%;height:100%;background:linear-gradient(#315bff,#7fd7ff 70%,#315bff);transform-origin:top;animation:rvMobileFlow 2.8s cubic-bezier(.16,1,.3,1) both}
          .rv-step{position:relative;left:auto;top:auto;width:100%;margin:0 0 26px}
          .rv-step:last-of-type{margin-bottom:0}
          .rv-step-stack{display:block}
          .rv-valve-wrap{position:absolute;left:-65px;top:20px;width:58px;height:58px}
          .rv-valve-wheel{width:54px;height:54px;border-width:6px}.rv-valve-bar-x{width:30px}.rv-valve-bar-y{height:30px}
          .rv-connector{display:none}
          .rv-card{width:100%;min-height:0;padding:18px}
          .rv-chips{max-height:45px;opacity:1;transform:none}
          .rv-pressure{grid-template-columns:150px minmax(0,1fr);gap:20px}.rv-pressure-note{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;gap:14px}.rv-pressure-note strong,.rv-pressure-note b{display:inline;margin:0}
          @keyframes rvMobileFlow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
        }
        @media(max-width:640px){
          .rv-section::before{background-size:42px 42px;opacity:.75}
          .rv-formula{display:block;border-radius:20px;padding:14px}.rv-formula-label{display:block;margin-bottom:9px}.rv-formula-flow{gap:5px}.rv-formula-flow b{padding:6px 8px;font-size:9px}.rv-formula-pressure{display:block;margin-top:10px;padding:9px 0 0;border-left:0;border-top:1px solid #e0e4ef}
          .rv-canvas{margin-left:-5px;margin-right:-5px;padding:36px 14px 36px 67px;border-radius:26px}.rv-mobile-pipe{left:38px;top:50px;bottom:50px;width:8px}.rv-valve-wrap{left:-56px;top:18px}
          .rv-card h3{font-size:21px}.rv-card>p{font-size:11px}
          .rv-pressure{grid-template-columns:1fr;padding:24px 20px;text-align:left}.rv-gauge{width:145px;height:145px;margin:auto}.rv-pressure-note{display:block}.rv-pressure-note strong,.rv-pressure-note b{display:block}.rv-pressure-note strong{margin-top:9px}.rv-pressure-note b{margin-top:2px}
          .rv-rules{grid-template-columns:1fr;gap:0}.rv-rule{background:transparent;padding:16px 4px}
          .rv-closing{text-align:left}.rv-closing>strong{font-size:27px;line-height:1.3}
        }
        @media(prefers-reduced-motion:reduce){
          .rv-pipe-signal,.rv-valve-halo,.rv-canvas::before,.rv-pressure::after,.rv-gauge-meter,.rv-gauge-needle,.rv-mobile-pipe span{animation:none!important}
          .rv-gauge-meter{stroke-dashoffset:62}.rv-gauge-needle{transform:rotate(18deg)}
        }
      `}</style>
    </section>
  );
}
