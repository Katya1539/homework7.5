module.exports = {
  generateName: function (length) {
    let name = "";
    let chars = "abcdefgABCDEFG1234567890";
    let charLength = chars.length;
    for (let i = 0; i < length; i++) {
      name += chars.charAt(Math.floor(Math.random() * charLength));
    }
    return name;
  },
};