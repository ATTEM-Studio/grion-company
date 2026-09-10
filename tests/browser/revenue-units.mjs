/** Run against the real calculator with a Playwright-compatible page after navigation. */
export async function verifyRevenueUnits(page) {
  const calculator = page.getByRole("region", { name: "그리온 목표 매출 계산기" });
  const expectText = async (text) => {
    if (!(await calculator.innerText()).split("\n").includes(text)) {
      throw new Error(`Revenue unit regression: expected ${text}`);
    }
  };
  const fixtures = [
    { current: "300000000", goal: "500000000", currentLabel: "3억 원", goalLabel: "5억 원", gap: "2억 원", restored: "300,000,000" },
    { current: "30,000,000", goal: "50,000,000", currentLabel: "3,000만 원", goalLabel: "5,000만 원", gap: "2,000만 원", restored: "30,000,000" },
    { current: "0", goal: "1000000", currentLabel: "0원", goalLabel: "100만 원", gap: "100만 원", restored: "0" },
  ];
  for (const fixture of fixtures) {
    await calculator.getByRole("textbox", { name: "현재 월매출", exact: true }).fill(fixture.current);
    await calculator.getByRole("textbox", { name: "목표 월매출", exact: true }).fill(fixture.goal);
    await expectText(`입력한 금액: ${fixture.currentLabel}`);
    await expectText(`입력한 금액: ${fixture.goalLabel}`);
    await calculator.getByRole("button", { name: "내 매출로 계산하기", exact: true }).click();
    await expectText(fixture.currentLabel);
    await expectText(fixture.goalLabel);
    await expectText(fixture.gap);
    await calculator.getByRole("button", { name: "매출 수정", exact: true }).click();
    const restored = await calculator.getByRole("textbox", { name: "현재 월매출", exact: true }).getAttribute("value");
    if (restored !== fixture.restored) throw new Error(`Revenue changed after going back: ${restored}`);
  }
}
