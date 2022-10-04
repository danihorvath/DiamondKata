import diamond from "./diamond";
import fc from "fast-check";
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const invalidChars = fc.char().filter((v) => alphabet.indexOf(v) < 0);
const validChars = fc.char().filter((v) => alphabet.indexOf(v) >= 0);

// Trying to call the diamond with different typed properties but string.
// Should throw an Error.
test("throws error, if not string provided", () => {
  fc.assert(
    fc.property(
      fc.anything().filter((v) => typeof v !== "string"),
      (data) => {
        // @ts-expect-error
        expect(() => diamond(data)).toThrow(Error);
      }
    )
  );
});

// Trying to call the diamond with different strings.
// If its more then a character, throws error.
test("throws error if more than one character provided", () => {
  fc.assert(
    fc.property(
      fc.string().filter((v) => v.length > 1),
      (data) => {
        expect(() => diamond(data)).toThrow(Error);
      }
    )
  );
});

// Trying to call the diamond with characters which are not part of the alphabet.
// It should throw error.
test("throws error if provided character is not part of the alphabet", () => {
  fc.assert(
    fc.property(invalidChars, (data) => {
      expect(() => diamond(data)).toThrow(Error);
    })
  );
});

// If we call diamond with a valid char, should always return something.
test("returned value is never empty", () => {
  fc.assert(
    fc.property(validChars, (data) => {
      expect(diamond(data).length).toBeGreaterThan(0);
    })
  );
});

// When we call with 'A' returns 'A' only
test("returns A for argument A", () => {
  expect(diamond("A")).toBe("A");
});

// If we call it with any valid char, the returned value has only 'A' letter.
test("first and last rows only have an A", () => {
  fc.assert(
    fc.property(validChars, (data) => {
      const returnedRows = diamond(data).split("\n");
      const inFirstRow = returnedRows[0].replace(/ /g, "");
      const inLastRow = returnedRows[returnedRows.length - 1].replace(/ /g, "");

      expect(inFirstRow).toBe("A");
      expect(inLastRow).toBe("A");
    })
  );
});

// If we call it with any valid char, the returned number of rows will be equal
// to the (called char's index in the alphabet * 2 - 1)
test("if i = letters index in alphabet, n of rows = i*2+1 )", () => {
  fc.assert(
    fc.property(validChars, (data) => {
      const returned = diamond(data);
      const i = alphabet.indexOf(data);
      const n = returned.split("\n").length;
      expect(n).toBe(i * 2 + 1);
    })
  );
});

// When we call it with any valid char, the rows' length will be the same
// as the number of returned rows.
test("n of characters (per row) is matching with n of rows", () => {
  fc.assert(
    fc.property(validChars, (data) => {
      const returned = diamond(data);
      const rows = returned.split("\n");
      const check = rows.every((v) => v.length === rows.length);
      expect(check).toBe(true);
    })
  );
});

// The returned diamond is symmetric around vertical axis,
// if the rows of the transformed matrix are palindromes.
test("symmetric around vertical axis", () => {
  fc.assert(
    fc.property(validChars, (data) => {
      const returned = diamond(data);
      const rows = returned.split("\n");
      const check = rows.every((v) => v === v.split("").reverse().join(""));
      expect(check).toBe(true);
    })
  );
});

// The returned diamond is symmetric around horizontal axis,
// if the rows of the transformed matrix are palindromes.
test("symmetric around horizontal axis", () => {
  fc.assert(
    fc.property(validChars, (data) => {
      const returned = diamond(data);
      const matrix = returned.split("\n").map((row) => row.split(""));
      const transposedMatrix = matrix[0].map((col, i) =>
        matrix.map((row) => row[i])
      );
      const check = transposedMatrix.every(
        (v) => v.join("") === v.reverse().join("")
      );
      expect(check).toBe(true);
    })
  );
});

// Checks the number of leading spaces in each row. (v.search(/[^ ]/))
// It must match with the absolute value of (indexInAlphabet - rowNumber)
test("n of leading spaces is abs(indexInAlphabet - rowNumber)", () => {
  fc.assert(
    fc.property(validChars, (data) => {
      const returned = diamond(data);
      const rows = returned.split("\n");
      const indexInAlphabet = alphabet.indexOf(data);
      const check = rows.every(
        (v, i) => v.search(/[^ ]/) === Math.abs(indexInAlphabet - i)
      );
      expect(check).toBe(true);
    })
  );
});

// Sets up an array with the only valid characters for each row based on the
// number of rows. (eg: ABCBA), then checks if they are presented in the right amount.
test("all rows contain the expected letter twice (except A - first and last rows)", () => {
  fc.assert(
    fc.property(validChars, (data) => {
      const returned = diamond(data);
      const rows = returned.split("\n");
      const alphabetUntilChar = alphabet.slice(0, Math.floor(rows.length / 2));
      const expectedLetters = [
        ...alphabetUntilChar.split(""),
        data,
        ...alphabetUntilChar.split("").reverse(),
      ];
      const check = rows.every((v, i) => {
        const expectedLetter = expectedLetters[i];
        const rowWithoutSpaces = v.replace(/ /g, "");
        if (i === 0 || i === rows.length - 1) {
          return rowWithoutSpaces === expectedLetter;
        } else {
          return rowWithoutSpaces === expectedLetter + expectedLetter;
        }
      });
      expect(check).toBe(true);
    })
  );
});
