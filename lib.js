const IS_QWERTZ = true;

const charCodeObject = {
    "A": 4,
    "B": 5,
    "C": 6,
    "D": 7,
    "E": 8,
    "F": 9,
    "G": 10,
    "H": 11,
    "I": 12,
    "J": 13,
    "K": 14,
    "L": 15,
    "M": 16,
    "N": 17,
    "O": 18,
    "P": 19,
    "Q": 20,
    "R": 21,
    "S": 22,
    "T": 23,
    "U": 24,
    "V": 25,
    "W": 26,
    "X": 27,
    "Y": IS_QWERTZ ? 29 : 28,
    "Z": IS_QWERTZ ? 28 : 29,
    ".": 55,
    ",": 54,
    "0": 88,
    "1": 89,
    "2": 90,
    "3": 91,
    "4": 92,
    "5": 93,
    "6": 94,
    "7": 95,
    "8": 96,
    "9": 97,
    "/": 84,
    "*": 85,
    "-": 86,
    "+": 87,
    "Ě": 31,
    "Š": 32,
    "Č": 33,
    "Ř": 34,
    "Ž": 35,
    "Ý": 36,
    "Á": 37,
    "Í": 38,
    "É": 39,
    "Ú": 47,
    "Ů": 51,
    " ": 44,
}

const SPECIAL_CHARACTERS = ["?", "!"];

const getSpecialCharacter = (character, keyDelay) => {
    let string;

    switch (character) {
        case "!":
            string = `
            KeyDown 265 1
            KeyDown 52 1
            Delay ${keyDelay} ms
            KeyUp 52 1
            Delay ${keyDelay} ms
            KeyUp 265 1
            `;
            break;
        case "?":
            string = `
            KeyDown 265 1
            KeyDown 54 1
            Delay ${keyDelay} ms
            KeyUp 54 1
            Delay ${keyDelay} ms
            KeyUp 265 1
            `;
            break;
        default:
            string = "";
            break;
    }
    return string;
}

const getKeypress = (character, keyDelay) => {
    let string = "";

    const keyCode = charCodeObject[character.toUpperCase()];
    const isLowerCase = character.toLowerCase() === character;

    if (SPECIAL_CHARACTERS.includes(character)) {
        string = getSpecialCharacter(character, keyDelay);
    }
    else if (keyCode) {
        string = `
        KeyDown ${keyCode} 1
        Delay ${keyDelay} ms
        KeyUp ${keyCode} 1
        Delay ${keyDelay} ms
        `;
    }
    else {
        console.log(`Character ${character} not defined! Not returning...`);
        return string;;
    }


    // Shift press
    if (!isLowerCase) {
        string = `
        KeyDown 265 1
        Delay ${keyDelay} ms
        ${string}
        KeyUp 265 1
        Delay ${keyDelay} ms
        `;
    }

    return string;
}

const getFullMacro = (text, keyDelay = 30, totalDelay = 64, autoEnter = true) => {
    const arrayOfChars = text.split("");

    const script = arrayOfChars.map(character => {
        return getKeypress(character, keyDelay);
    });

    const innerScript = script.join("");

    const fullMacro = transform(innerScript, totalDelay, autoEnter);
    return fullMacro;
}

const transform = (innerScript, totalDelay = 64, autoEnter = true) => {
    return `<Root>
	<DefaultMacro>
		<Major></Major>
		<Description></Description>
		<Comment></Comment>
		<GUIOption>
			<RepeatType>2</RepeatType>
		</GUIOption>
		<KeyUp>
			<Syntax></Syntax>
		</KeyUp>
		<KeyDown>
			<Syntax>
                ${autoEnter && `
                KeyDown 40 1
                Delay 64 ms
                KeyUp 40 1
                Delay 64 ms`
        }
                ${innerScript}
                ${autoEnter && `
                KeyDown 40 1
                Delay 64 ms
                KeyUp 40 1
                Delay 64 ms`
        }
            DelayS ${totalDelay} s
            </Syntax>
		</KeyDown>
		<Software>Text macro</Software>
        </DefaultMacro>
</Root>`;

}

module.exports = { getFullMacro };