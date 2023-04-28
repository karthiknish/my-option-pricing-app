// utils/pricer_Black76.ts

import { DateTime } from "luxon";
import math from "mathjs";
import { brent } from "./brent";

class Pricer_Black76 {
  private _maturityDate: DateTime;
  private _rf: number;
  private _strike: number;

  constructor(maturityDate: DateTime, rf: number, strike: number) {
    this._maturityDate = maturityDate;
    this._rf = rf;
    this._strike = strike;
  }

  public PV(
    priceDate: DateTime,
    future: number,
    volatility: number
  ): [number, number] {
    const t = (this._maturityDate.diff(priceDate, "days").days || 0) / 365;

    const d1 =
      (Math.log(future) - Math.log(this._strike) + (volatility ** 2 / 2) * t) /
      (volatility * Math.sqrt(t));
    const d2 = d1 - volatility * Math.sqrt(t);

    const normalCDF = (x: number): number =>
      0.5 * (1 + math.erf(x / Math.sqrt(2)));

    const call =
      Math.exp(-this._rf * t) *
      (future * normalCDF(d1) - this._strike * normalCDF(d2));
    const put =
      Math.exp(-this._rf * t) *
      (this._strike * normalCDF(-d2) - future * normalCDF(-d1));

    return [call, put];
  }

  public impliedVol(
    priceDate: DateTime,
    future: number,
    option: number,
    useCall: boolean = true
  ): number {
    const err = (x: number): number => {
      const [call, put] = this.PV(priceDate, future, x);
      return useCall ? call - option : put - option;
    };

    const impliedVol = brent(err, 0.01, 100, 1e-8, 100);

    return impliedVol;
  }
}

export { Pricer_Black76 };
