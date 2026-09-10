"use client";

import { useId, useState } from "react";
import { revenueValve } from "@/content/revenueValve";
import { BOTTLENECK_SELECTED_EVENT, type BottleneckSelectedDetail } from "@/lib/events";
import styles from "./GrowthFlow.module.css";

export function GrowthFlow() {
  const [selected, setSelected] = useState<number | null>(null);
  const [pressureBoosted, setPressureBoosted] = useState(false);
  const instanceId = useId();
  const panelId = `${instanceId}-insight`;
  const gradientId = `${instanceId}-water`;
  const active = selected === null ? null : revenueValve.valves[selected];

  const carryConcern = () => {
    if (!active) return;
    window.dispatchEvent(new CustomEvent<BottleneckSelectedDetail>(BOTTLENECK_SELECTED_EVENT, {
      detail: { concern: `${active.situation} — ${active.title}부터 함께 확인하고 싶습니다.` },
    }));
  };

  return (
    <section id="growth-flow" className={styles.root} data-boosted={pressureBoosted} aria-labelledby={`${instanceId}-title`}>
      <div className={styles.container}>
        <div className={styles.intro}>
          <div>
            <p className={styles.eyebrow}>{revenueValve.eyebrow}</p>
            <h2 id={`${instanceId}-title`}>{revenueValve.headline[0]}<br /><span>{revenueValve.headline[1]}</span></h2>
          </div>
          <p className={styles.lead}>{revenueValve.lead}</p>
        </div>
        <div className={styles.explorer}>
          <div className={styles.picker}>
            <p className={styles.stepLabel}>내 상황에서 시작하기</p>
            <h3>어떤 상황이 가장 비슷한가요?</h3>
            <p className={styles.pickerHint}>누르면 먼저 확인할 곳이 보여요.</p>
            <div className={styles.choices} role="group" aria-label="내 사업의 상황 선택">
              {revenueValve.valves.map((valve, index) => (
                <button type="button" key={valve.no} className={styles.choice}
                  aria-label={valve.situation} aria-pressed={selected === index} aria-controls={panelId}
                  onClick={() => setSelected(index)}>
                  <span className={styles.number} aria-hidden="true">{valve.no}</span>
                  <span className={styles.choiceCopy}><small>{valve.title}</small><strong>{valve.situation}</strong></span>
                  <span className={styles.arrow} aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
          </div>
          <div className={styles.workspace}>
            <div className={styles.diagramHeading}>
              <span>고객이 매출로 이어지는 흐름</span>
              <span className={styles.diagramStatus}>{active ? `${active.title} 살펴보기` : "네 개의 밸브"}</span>
            </div>
            <div className={styles.diagram}>
              <svg className={styles.pipeline} viewBox="0 0 640 100" preserveAspectRatio="none" aria-hidden="true">
                <defs><linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3449f5" /><stop offset="65%" stopColor="#74cfff" /><stop offset="100%" stopColor="#3449f5" />
                </linearGradient></defs>
                <path d="M80 50 H560" stroke="#e5eafa" strokeWidth="28" strokeLinecap="round" />
                <path d="M80 50 H560" stroke={`url(#${gradientId})`} strokeWidth={pressureBoosted ? 24 : 12}
                  strokeLinecap="round" className={styles.pipeCore} data-testid="growth-flow-pipe" />
                <path d="M80 50 H560" stroke="white" strokeWidth={pressureBoosted ? 5 : 3}
                  strokeDasharray="5 14" strokeLinecap="round" className={styles.signal} />
              </svg>
              <ol className={styles.nodes}>
                {revenueValve.valves.map((valve, index) => (
                  <li key={valve.no} className={styles.node} data-selected={selected === index}>
                    <span className={styles.wheel} aria-hidden="true"><i /></span><span>{valve.title}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div id={panelId} className={styles.insight} role="region" aria-label="선택한 상황의 확인 방법" aria-live="polite" aria-atomic="true">
              {active ? (
                <div className={styles.insightContent} key={active.no}>
                  <p className={styles.stepLabel}>먼저 살펴볼 지점</p>
                  <h3>{active.title}부터 살펴볼까요?</h3>
                  <p className={styles.insightLead}>{active.insight}</p>
                  <div className={styles.checks}>
                    <div><p>확인할 숫자</p><h4>{active.metric}</h4><span>{active.metricHelp}</span></div>
                    <div><p>먼저 해볼 일</p><h4>{active.action}</h4><span>{active.actionHelp}</span></div>
                  </div>
                  <a href="#diagnosis" onClick={carryConcern} className={styles.consult}>이 상황으로 상담 이어가기 <span aria-hidden="true">→</span></a>
                  <p className={styles.qualifier}>선택한 상황에서 시작하는 점검이에요. 실제 병목은 데이터를 함께 보고 판단합니다.</p>
                </div>
              ) : (
                <div className={styles.empty}>
                  <span className={styles.emptyIcon} aria-hidden="true">?</span>
                  <p className={styles.stepLabel}>어디부터 봐야 할지 막막하다면</p>
                  <h3>익숙한 상황 하나가<br />실마리가 될 수 있어요.</h3>
                  <p>상황을 골라보세요.<br />확인할 숫자와 먼저 해볼 일을 함께 보여드릴게요.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.pressure}>
          <div className={styles.gauge} aria-hidden="true">
            <svg viewBox="0 0 160 160">
              <path d="M34 126 A65 65 0 1 1 126 126" className={styles.gaugeTrack} />
              <path d="M34 126 A65 65 0 1 1 126 126" className={styles.gaugeMeter} />
              <g className={styles.needle}><line x1="80" y1="80" x2="123" y2="60" /><circle cx="80" cy="80" r="7" /></g>
            </svg><span>객단가 효과</span>
          </div>
          <div className={styles.pressureCopy}>
            <p className={styles.pressureEyebrow}>{revenueValve.pressure.eyebrow}</p>
            <h3>{revenueValve.pressure.headline[0]}<br />{revenueValve.pressure.headline[1]}</h3>
            <p>{revenueValve.pressure.body}</p>
          </div>
          <div className={styles.pressureControl}>
            <button type="button" aria-pressed={pressureBoosted} onClick={() => setPressureBoosted(value => !value)}>
              {pressureBoosted ? "원래 흐름으로 보기" : "객단가를 높여보면"}<span aria-hidden="true">{pressureBoosted ? "↶" : "↗"}</span>
            </button>
            <p aria-live="polite">{pressureBoosted ? "결제 건수가 같다면, 평균 결제금액이 높아질수록 매출도 늘어납니다." : "눌러서 위 흐름의 변화를 확인해 보세요."}</p>
            <span>객단가 효과를 보여주는 개념 화면</span>
          </div>
        </div>
        <div className={styles.closing}>
          <p>어디를 바꿀지 살펴봤다면,<br className={styles.mobileBreak} /> 이제 필요한 변화량을 계산해 보세요.</p>
          <a href="#growth-calculator">내 목표 매출 계산하기 <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>
  );
}
