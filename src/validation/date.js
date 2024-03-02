class DateValidation {
  static isAfter(date, dateCompare) {
    return new Date(date) > new Date(dateCompare);
  }

  static isBefore(date, dateCompare) {
    return new Date(date) < new Date(dateCompare);
  }

  static isSameOrAfter(date, dateCompare) {
    return new Date(date) >= new Date(dateCompare);
  }

  static isSameOrBefore(date, dateCompare) {
    return new Date(date) <= new Date(dateCompare);
  }
}

module.exports = {
  DateValidation,
};
