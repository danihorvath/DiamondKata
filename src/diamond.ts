function diamondKata(letter: string): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  if (!letter) throw new Error("No character provided.");
  if (typeof letter !== "string") throw new Error("Invalid input provided.");
  if (letter.length !== 1) throw new Error("More than one character provided.");
  if (alphabet.indexOf(letter) < 0)
    throw new Error("Provided character is not part of the alphabet.");

  const usedLetters = alphabet.slice(0, alphabet.indexOf(letter) + 1);
  const matrixWidth = usedLetters.length * 2 - 1;

  const halfDiamond = usedLetters.split("").map((letter, i) => {
    const middle =
      i === 0 ? letter : `${letter}${" ".repeat(i * 2 - 1)}${letter}`;
    const side = " ".repeat((matrixWidth - middle.length) / 2);
    return `${side}${middle}${side}`;
  });

  return [...halfDiamond, ...halfDiamond.reverse().slice(1)].join("\n");
}

export default diamondKata;
