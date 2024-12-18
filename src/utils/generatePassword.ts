const generatePassword = (length: number): string => {
  // Define the character sets
  const allCharacters = "abcdefghijklmnopqrstuvwxyz0123456789!@#$";

  // Function to get a random character from a string
  const getRandomCharacter = (str: string): string =>
    str.charAt(Math.floor(Math.random() * str.length));

  let password = "";

  // Fill the rest of the password length with random characters from all sets
  for (let i = password.length; i < length; i++) {
    password += getRandomCharacter(allCharacters);
  }

  // Shuffle the password to ensure random distribution of character types
  password = password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");

  return password;
};

export default generatePassword;
