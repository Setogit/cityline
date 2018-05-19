'use strict';

const mj = require('mathjs');

/**
 * Class UnitConverter
 */
class UnitConverter {

  // setogit: TODO: mathjs does not accept '°', "'", '"'
  // The value of mathjs parser exceeds this feature value.
  constructor() {
    this.regex = new RegExp('([^\(\)\/\*]+)[\)]*([[\*\/]*)[\(]*([^\)]*)]*');
    this.ops = {
      minute: [60.0, 's'], min: [60.0, 's'],
      hour: [3600.0, 's'], h: [3600.0, 's'],
      day: [86400.0, 's'], d: [86400.0, 's'],
      degree: [0.017453292519943295, 'rad'], /* π/180 */
      // '°': [0.017453292519943295, 'rad'], /* π/180 */
      arcminute: [0.0002908882086657216, 'rad'], /* π/10800 */
      // "'": [0.0002908882086657216, 'rad'], /* π/10800 */
      arcsecond: [0.00000484813681109536, 'rad'], /* π/648000 */
      // '"': [0.00000484813681109536, 'rad'], /* π/648000 */
      hectare: [10000.0, 'm2'], ha: [10000.0, 'm2'],
      litre: [0.001, 'm3'], l: [0.001, 'm3'],
      tonne: [1000, 'kg'], t: [1000, 'kg'],
    };
  }

  /*
   * Units format has been validated by mathjs.
   * setogit: TODO
   *   - Handle paren nesting
   *   - Support resursive
   * Returns:
   *   ret.unit : '' ==> valid format, but not supported yet
   */
  _regexUnits(units) {
    const re = this.regex;
    const m = re.exec(units);
    const op = m[2] ? (m[2][0] === '/' ?
      'div' : (m[2][0] === '*' ? 'multi' : null)) : null;
    const x = m[1] ? m[1].toLowerCase() : null;
    const y = m[3] ? m[3].toLowerCase() : null;
    let ret = {unit: '', factor: 1.0};
    if (!x) return ret;
    if (!(x in this.ops)) return ret;
    ret.unit = this.ops[x][1];
    ret.factor = ret.factor * this.ops[x][0];
    if (y) {
      if (!(y in this.ops)) { // TODO: support recursive
        return {unit: '', factor: 1.0};
      }
      switch (op) {
        case 'multi':
          ret.unit = ret.unit + '*' + this.ops[y][1];
          ret.factor = ret.factor * this.ops[y][0];
          break;
        case 'div':
          ret.unit = ret.unit + '/' + this.ops[y][1];
          ret.factor = ret.factor / this.ops[y][0];
          break;
        default:
          break;
      }
    }
    return ret;
  }

  _parseUnits(units) {
    let unitName = null;
    let multiFactor = null;
    try {
      mj.parse(units);
      let result = this._regexUnits(units);
      if (!result) throw new Error('Invalid units');
      unitName = result.unit;
      multiFactor = result.factor;
    } catch (e) {
    }
    return {
      unit_name: unitName,
      multiplication_factor: multiFactor,
    };
  }

  /**
   * @param {String} units - Source unit string
   * @return {Object} {'unit_name': <String>, 'multiplication_factor': <Float>}.
   */
  toSI(units) {
    return this._parseUnits(units);
  }
}

module.exports = new UnitConverter();
