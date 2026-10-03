export function getAchievementColor(value: number) {
  if (value < 30) {
    return {
      chart: "#A6323A",
      bar: "bg-[#A6323A]",
      text: "text-[#A6323A]",
    };
  }

  if (value <= 70) {
    return {
      chart: "#B8862E",
      bar: "bg-[#B8862E]",
      text: "text-[#B8862E]",
    };
  }

  return {
    chart: "#3F6E52",
    bar: "bg-[#3F6E52]",
    text: "text-[#3F6E52]",
  };
}
