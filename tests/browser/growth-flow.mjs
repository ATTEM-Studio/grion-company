/** Exercise the real section with a Playwright-compatible page after navigation. */
export async function verifyGrowthFlow(page) {
  const firstChoice = page.getByRole("button", { name: "찾는 사람이 적어요", exact: true });
  if (await firstChoice.count() !== 1) throw new Error("Visitors need a visible situation button to start the flow.");
  const choices = page.getByRole("group", { name: "내 사업의 상황 선택" });
  if (await choices.getByRole("button").evaluateAll(els => els.some(el => el.getAttribute("aria-pressed") === "true"))) {
    throw new Error("Do not diagnose a stage before the visitor chooses a situation.");
  }
  const panel = page.getByRole("region", { name: "선택한 상황의 확인 방법" });
  const fixtures = [
    ["찾는 사람이 적어요", "노출부터 살펴볼까요?"],
    ["봐도 관심 없이 지나가요", "유입부터 살펴볼까요?"],
    ["알아보지만 선택하지 않아요", "방문부터 살펴볼까요?"],
    ["한 번 이용하고 끝나요", "재방문부터 살펴볼까요?"],
  ];
  for (const [situation, heading] of fixtures) {
    const button = choices.getByRole("button", { name: situation, exact: true });
    await button.click();
    await panel.getByRole("heading", { name: heading, exact: true }).waitFor({ state: "visible" });
    if (await button.getAttribute("aria-pressed") !== "true") throw new Error("Selected situation is not exposed accessibly.");
    await panel.getByText("확인할 숫자", { exact: true }).waitFor({ state: "visible" });
    await panel.getByText("먼저 해볼 일", { exact: true }).waitFor({ state: "visible" });
  }
  const pipe = page.getByTestId("growth-flow-pipe");
  const initialWidth = Number(await pipe.getAttribute("stroke-width"));
  await page.getByRole("button", { name: "객단가를 높여보면", exact: true }).click();
  const reset = page.getByRole("button", { name: "원래 흐름으로 보기", exact: true });
  await reset.waitFor({ state: "visible" });
  if (await reset.getAttribute("aria-pressed") !== "true") throw new Error("Pressure toggle did not turn on.");
  if (Number(await pipe.getAttribute("stroke-width")) <= initialWidth) throw new Error("Pressure should visibly widen the flow.");
  await reset.press("Enter");
  await page.getByRole("button", { name: "객단가를 높여보면", exact: true }).waitFor({ state: "visible" });
  if (Number(await pipe.getAttribute("stroke-width")) !== initialWidth) throw new Error("Keyboard reset should restore the original flow.");
  await panel.getByRole("link", { name: "이 상황으로 상담 이어가기", exact: true }).click();
  const concern = page.getByRole("textbox", { name: /^현재 가장 큰 고민/ });
  if (!(await concern.evaluate(el => el.value)).includes("한 번 이용하고 끝나요")) throw new Error("Selected concern should carry into the existing consultation form.");
}
