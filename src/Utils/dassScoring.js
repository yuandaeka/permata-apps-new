export const calculateDASS = (answers) => {
  const depressionIndexes = [2,4,9,12,15,16,20];
  const anxietyIndexes = [1,3,6,8,14,18,19];
  const stressIndexes = [0,5,7,10,11,13,17];

  const sum = (indexes) =>
    indexes.reduce((total, i) => total + answers[i], 0);

  return {
    depression: sum(depressionIndexes),
    anxiety: sum(anxietyIndexes),
    stress: sum(stressIndexes),
  };
};

export const interpretDASS = (scores) => {

  const getLevel = (score) => {
    if (score <= 4) return "Normal";
    if (score <= 6) return "Ringan";
    if (score <= 10) return "Sedang";
    if (score <= 13) return "Berat";
    return "Sangat Berat";
  };

  const depressionLevel = getLevel(scores.depression);
  const anxietyLevel = getLevel(scores.anxiety);
  const stressLevel = getLevel(scores.stress);

  let motivationMessage = "";

  if (
    depressionLevel === "Normal" &&
    anxietyLevel === "Normal" &&
    stressLevel === "Normal"
  ) {
    motivationMessage =
      "Luar biasa! Kondisi emosional Anda stabil dan sehat. Pertahankan keseimbangan ini 🌿✨";
  } else if (
    depressionLevel === "Berat" ||
    anxietyLevel === "Berat" ||
    stressLevel === "Berat" ||
    depressionLevel === "Sangat Berat" ||
    anxietyLevel === "Sangat Berat" ||
    stressLevel === "Sangat Berat"
  ) {
    motivationMessage =
      "Anda sedang melalui masa yang berat. Ingat, Anda tidak sendiri. Bantuan profesional dapat sangat membantu 🤝❤️";
  } else {
    motivationMessage =
      "Ada beberapa tekanan emosional yang terdeteksi. Luangkan waktu untuk self-care dan berbagi cerita dengan orang terpercaya 💙";
  }

  return {
    depressionLevel,
    anxietyLevel,
    stressLevel,
    motivationMessage,
  };
};